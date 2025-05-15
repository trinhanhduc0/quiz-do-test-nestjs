import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';
import { shuffle } from 'lodash';

import { Classes, ClassTestDocument } from './entities/class-test.entity';
import {
  Question,
  QuestionDocument,
} from '../questions/entities/question.entity';
import { Answer, AnswerDocument } from '../answers/entities/answer.entity';
import { RedisService } from '../redis/redis.service';
import { AnswersService } from '../answers/answers.service';
import { CreateAnswerDto } from '../answers/dto/create-answer.dto';

@Injectable()
export class ClassTestService {
  constructor(
    private readonly redisService: RedisService,
    private readonly answerService: AnswersService,
    @InjectModel(Classes.name) private classModel: Model<ClassTestDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async getAllQuestionsByIds(
    ids: Types.ObjectId[] | string[],
  ): Promise<Partial<Question>[]> {
    if (!ids || ids.length === 0) {
      throw new Error('No question IDs provided');
    }

    const filter = { _id: { $in: ids } };
    const projection = { createdAt: 0, updatedAt: 0, metadata: 0, __v: 0 };

    try {
      return await this.questionModel.find(filter, projection).lean().exec();
    } catch (err) {
      Logger.error('Failed to fetch questions', err);
      throw new Error('Database query failed');
    }
  }

  private cleanAndShuffleQuestions(
    rawQuestions: Partial<Question>[],
  ): Partial<Question>[] {
    return shuffle(
      rawQuestions.map((q) => {
        const cleaned: Partial<Question> = { ...q };

        // Xoá các trường liên quan đến đáp án
        delete (cleaned as any).answer;
        delete (cleaned as any).correct_answers;

        switch (q.type) {
          case 'fill_in_the_blank':
            cleaned.fill_in_the_blanks = q.fill_in_the_blanks?.map((b) => ({
              id: b.id,
              text_before: b.text_before,
              blank: b.blank,
              text_after: b.text_after,
              correct_answer: '', // Reset đáp án
            }));
            break;

          case 'match_choice_question':
            cleaned.match_options = q.match_options?.map((opt) => ({
              id: opt.id,
              text: opt.text,
              match_id: '', // Reset match_id nếu có
            }));
            break;

          case 'order_question':
            cleaned.order_items = q.order_items?.map((item) => ({
              id: item.id,
              text: item.text,
              order: 0,
            }));
            break;

          case 'single_choice_question':
          case 'multiple_choice_question':
            cleaned.options = q.options?.map((opt) => ({
              id: opt.id,
              text: opt.text,
              imageurl: opt.imageurl,
              iscorrect: false,
            }));
            break;

          default:
            break;
        }

        return cleaned;
      }),
    );
  }

  async getQuestionOfTest(
    author_mail: string,
    classID: string,
    testID: string,
    email: string,
  ): Promise<{
    test_info: Record<string, any>;
    questions: Partial<Question>[];
    answer?: Answer;
  }> {
    const classKey = `classTest:${classID}:${testID}`;
    const questionsKey = `classTestQuestions:${testID}`; // Dành cho học sinh (ẩn đáp án)
    const questionsFullKey = `classTestQuestionsFull:${testID}`; // Dành cho admin (đầy đủ)

    const test_id = new Types.ObjectId(testID);
    const class_id = new Types.ObjectId(classID);
    const existingAnswer = await this.answerService.findOne(
      author_mail,
      class_id,
      test_id,
      email,
    );
    if (!existingAnswer.email) {
      const answer_user: CreateAnswerDto = new CreateAnswerDto();
      answer_user.email = email;
      answer_user.class_id = class_id;
      answer_user.author_mail = author_mail;
      answer_user.test_id = test_id;
      await this.answerService.createAnswer(answer_user);
    }
    // 1. Lấy dữ liệu test từ Redis hoặc MongoDB
    let testDoc: any;
    let questionIDs: Types.ObjectId[] = [];

    const cachedTest = await this.redisService.get(classKey);

    if (cachedTest) {
      if (!cachedTest.students_accept?.includes(email)) {
        throw new Error('User not authorized for this test');
      }
      testDoc = cachedTest;
      questionIDs = cachedTest.question_ids;
    } else {
      const result = await this.classModel
        .findOne(
          {
            _id: new Types.ObjectId(classID),
            author_mail: author_mail,
            'test._id': new Types.ObjectId(testID),
            students_accept: email,
          },
          {
            students_accept: 1,
            'test.$': 1,
          },
        )
        .lean();

      if (!result || !result.test?.[0]) {
        throw new Error('No matching test found or user not authorized');
      }

      testDoc = result.test[0];
      testDoc.students_accept = result.students_accept;
      questionIDs = testDoc.question_ids;

      if (testDoc.time_start) {
      }

      await this.redisService.set(classKey, JSON.stringify(testDoc), 3600);
    }

    // 2. Lấy danh sách câu hỏi (ẩn đáp án nếu là học sinh)
    let questions: Partial<Question>[] = [];

    const cachedQuestions = await this.redisService.get(questionsKey);

    if (cachedQuestions) {
      questions = cachedQuestions;
    } else {
      const rawQuestions = await this.getAllQuestionsByIds(questionIDs);

      Logger.log(testDoc.is_test);
      Logger.log(rawQuestions);

      if (testDoc.is_test) {
        // Cache câu hỏi đã làm sạch (ẩn đáp án) → dành cho học sinh
        questions = this.cleanAndShuffleQuestions(rawQuestions);
      } else questions = rawQuestions;

      await this.redisService.set(
        questionsKey,
        JSON.stringify(questions),
        3600,
      );

      // Cache bản đầy đủ có đáp án → dành cho admin (chỉ cần làm 1 lần)
      await this.redisService.set(
        questionsFullKey,
        JSON.stringify(rawQuestions),
        3600,
      );
    }
    const { students_accept, question_ids, email_id, ...info_clean } = testDoc;

    const res = {
      questions,
      ...(existingAnswer.question_answer ? { answer: existingAnswer } : {}),
      test_info: info_clean,
    };

    // 4. Trả về dữ liệu
    return res;
  }
}
