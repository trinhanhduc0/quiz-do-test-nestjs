import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Answer } from './entities/answer.entity';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { RedisService } from '../redis/redis.service';
import { Question } from '../questions/entities/question.entity';
// import { RedisService } from '../redis/entities/redi.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Answer.name)
    private readonly testAnswerModel: Model<Answer>,
    private readonly redis: RedisService,
  ) {}

  async createAnswer(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    createAnswerDto.start_time = Date.now();
    const created = new this.testAnswerModel(createAnswerDto);
    return created.save();
  }

  async findOne(
    author_mail: string,
    class_id: Types.ObjectId,
    test_id: Types.ObjectId,
    email: string,
  ): Promise<Answer> {
    const answer = await this.testAnswerModel
      .findOne({ author_mail, class_id, test_id, email })
      .exec();
    if (!answer) {
      return new Answer();
      throw new NotFoundException(
        `Answer for test_id ${test_id} not found for email ${email}`,
      );
    }
    return answer;
  }

  async updateAnswer(dto: UpdateAnswerDto) {
    dto.end_time = Date.now();
    dto.class_id = new Types.ObjectId(dto.class_id);
    dto.test_id = new Types.ObjectId(dto.test_id);

    const questionsKey = `classTestQuestionsFull:${dto.test_id}`; // Dành cho học sinh (ẩn đáp án)

    const cachedQuestions = await this.redis.get(questionsKey);

    if (cachedQuestions) {
      const parsedQuestions = cachedQuestions as (Question | undefined)[];
      const questions: Question[] = parsedQuestions.filter(
        (q): q is Question => q !== undefined,
      );
      dto.score = this.calculateScore(questions, dto.question_answer);
    }

    await this.testAnswerModel.updateOne(dto);
  }

  private calculateScore(
    questions: Question[],
    answers: Record<
      string,
      {
        type: string;
        answer: any;
      }
    >,
  ): number {
    let score = 0;

    for (const [questionId, userAnswer] of Object.entries(answers)) {
      const q = questions.find((q) => q._id.toString() === questionId);
      if (!q) continue;

      switch (q.type) {
        case 'single_choice_question': {
          const correctOption = q.options?.find((opt) => opt.iscorrect);
          if (correctOption?.id === userAnswer.answer) {
            score += q.score;
          }
          break;
        }

        case 'multiple_choice_question': {
          const correctOptions =
            q.options?.filter((opt) => opt.iscorrect).map((opt) => opt.id) ||
            [];
          const answerSet = new Set(userAnswer.answer as string[]);
          const correctSet = new Set(correctOptions);
          if (
            answerSet.size === correctSet.size &&
            [...correctSet].every((id) => answerSet.has(id.toString()))
          ) {
            score += q.score;
          }
          break;
        }

        case 'fill_in_the_blank': {
          const correctBlanks = q.fill_in_the_blanks || [];
          const userBlanks = userAnswer.answer || {};
          const allCorrect = correctBlanks.every((blank) => {
            const userInput = (userBlanks[blank.id.toString()] || '')
              .trim()
              .toLowerCase();
            return userInput === blank.correct_answer.trim().toLowerCase();
          });
          if (allCorrect) {
            score += q.score;
          }
          break;
        }

        case 'order_question': {
          const correctOrder = (q.order_items || [])
            .sort((a, b) => a.order - b.order)
            .map((item) => item.id);
          const userOrder = (userAnswer.answer as string[]) || [];
          const isCorrect =
            correctOrder.length === userOrder.length &&
            correctOrder.every(
              (id, index) => id.toString() === userOrder[index],
            );

          if (isCorrect) {
            score += q.score;
          }

          break;
        }

        case 'match_choice_question': {
          const correctMatch = (q.match_options || []).reduce(
            (acc, opt) => {
              const matchId = opt.match_id?.toString();
              if (!matchId) return acc;
              if (!acc[matchId]) acc[matchId] = [];
              acc[matchId].push(opt.id.toString());
              return acc;
            },
            {} as Record<string, string[]>,
          );

          const userMatch = userAnswer.answer || {};

          const allCorrect = Object.entries(correctMatch).every(
            ([matchId, correctIds]) => {
              const userIds = userMatch[matchId] || [];
              return (
                userIds.length === correctIds.length &&
                correctIds.every((id) => userIds.includes(id))
              );
            },
          );

          if (allCorrect) {
            score += q.score || 0;
          }
          break;
        }

        default:
          console.warn('Unknown question type:', q.type);
          break;
      }
    }
    return score;
  }

  private setEquals(a: Set<string>, b: Set<string>) {
    return a.size === b.size && [...a].every((v) => b.has(v));
  }

  private matchMapsEqual(
    a: Record<string, string>,
    b: Record<string, string>,
  ): boolean {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => a[key] === b[key]);
  }
}
