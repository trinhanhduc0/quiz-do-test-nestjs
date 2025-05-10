import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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
    const cleanedQuestionAnswers = createAnswerDto.question_answer.map((qa) => {
      const cleaned: any = {
        question_id: qa.question_id,
        type: qa.type,
      };

      if (qa.fill_in_the_blank?.length) {
        cleaned.fill_in_the_blank = qa.fill_in_the_blank;
      }

      if (qa.options?.length) {
        cleaned.options = qa.options;
      }

      return cleaned;
    });

    const cleanedDto = {
      ...createAnswerDto,
      question_answer: cleanedQuestionAnswers,
    };

    const created = new this.testAnswerModel(cleanedDto);
    return created.save();
  }

  async findOne(test_id: ObjectId, email: string): Promise<Answer> {
    const answer = await this.testAnswerModel
      .findOne({ test_id, email })
      .exec();
    if (!answer) {
      throw new NotFoundException(
        `Answer for test_id ${test_id} not found for email ${email}`,
      );
    }
    return answer;
  }

  async updateAnswer(dto: UpdateAnswerDto, emailId: string, email: string) {
    const testIdHex = dto.test_id?.toString();

    // 3. Lấy danh sách câu hỏi từ Redis
    const rawQuestionJson = await this.redis.hgetAll(
      `questions_id_${testIdHex}`,
    );
    const rawQuestionDefault = await this.redis.get(
      `questions_default_${testIdHex}`,
    );
    if (!rawQuestionJson || !rawQuestionDefault) {
      throw new NotFoundException('Test questions not found in Redis');
    }

    const parsedQuestions: Record<string, Question[]> = {};

    for (const key in rawQuestionJson) {
      try {
        const value = rawQuestionJson[key];
        Logger.log('rawQuestionJson', rawQuestionJson);
        // const jsonString =
        //   typeof value === 'string' ? value : value?.toString?.();

        // if (typeof jsonString === 'string') {
        //   parsedQuestions[key] = JSON.parse(jsonString) as Question[];
        // } else {
        //   console.warn(`Value for key ${key} is not a string.`);
        // }
      } catch (error) {
        console.error(`Failed to parse questions for key ${key}`, error);
      }
    }

    if (!testIdHex || !parsedQuestions[testIdHex]) {
      throw new NotFoundException('Parsed questions not found');
    }

    // 4. Tính điểm
    const totalScore = this.calculateScore(
      parsedQuestions[testIdHex],
      dto.question_answer,
    );

    // 5. Ghi vào DB
    const savedAnswer = await this.testAnswerModel.updateOne({
      testId: dto.test_id,
      email_id: emailId,
      email: email,
      question_answer: dto.question_answer,
      score: totalScore,
    });

    return savedAnswer;
  }

  private calculateScore(questions: Question[], answers: any[]): number {
    let score = 0;

    for (const answer of answers) {
      const q = questions.find((q) => q._id.toString() === answer.question_id);
      if (!q) continue;

      switch (q.type) {
        case 'single': // single_choice_question
          if (
            q.correctOptionId &&
            answer.optionIds?.[0] === q.correctOptionId
          ) {
            score += q.score;
          }
          break;

        case 'multiple': // multiple_choice_question
          if (Array.isArray(q.correctOptionId)) {
            const correctSet = new Set(q.correctOptionId);
            const answerSet = new Set(answer.optionIds as string[] | []);
            if (this.setEquals(correctSet, answerSet)) {
              score += q.score;
            }
          }
          break;

        case 'fill': // fill_in_the_blank
          if (
            Array.isArray(q.fill_in_the_blank) &&
            Array.isArray(answer.fill_in_the_blank) &&
            q.fill_in_the_blank.length === answer.fill_in_the_blank.length
          ) {
            const isCorrect = q.fill_in_the_blank.every(
              (correct, idx) =>
                correct.blank.trim().toLowerCase() ===
                answer.fill_in_the_blank[idx]?.trim().toLowerCase(),
            );
            if (isCorrect) score += q.score;
          }
          break;

        case 'order': // order_question
          if (
            Array.isArray(q.correctOptionId) &&
            Array.isArray(answer.optionIds) &&
            q.correctOptionId.length === answer.optionIds.length
          ) {
            const isCorrect = q.correctOptionId.every(
              (id, index) => id === answer.optionIds[index],
            );
            if (isCorrect) score += q.score;
          }
          break;

        case 'match': // match_choice_question
          const isCorrect = q.match.every(
            (correct, idx) => correct.matchid === answer[idx].matchid,
          );
          if (isCorrect) score += q.score;
          break;

        case 'text':
          // if (
          //   typeof q.correctAnswer === 'string' &&
          //   typeof answer.answerText === 'string' &&
          //   q.correctAnswer.trim().toLowerCase() ===
          //     answer.answerText.trim().toLowerCase()
          // ) {
          //   score += q.score;
          // }
          break;

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
