import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, ParseObjectIdPipe } from '@nestjs/mongoose';
import mongoose, { isObjectIdOrHexString, Model, Types } from 'mongoose';
import { Classes, ClassTestDocument } from './entities/class-test.entity';
import {
  Question,
  QuestionDocument,
} from '../questions/entities/question.entity';
import { ObjectId } from 'mongoose';
import { Answer, AnswerDocument } from '../answers/entities/answer.entity';
// import { Class, ClassDocument } from '../schemas/class.schema';

@Injectable()
export class ClassTestService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
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

    const projection = {
      createdAt: 0,
      updatedAt: 0,
      metadata: 0,
      __v: 0,
    };

    try {
      const questions = await this.questionModel
        .find(filter, projection)
        .lean()
        .exec();

      return questions;
    } catch (err) {
      Logger.error('Failed to fetch questions', err);
      throw new Error('Database query failed');
    }
  }

  async getQuestionOfTest(
    classID: string,
    testID: string,
    email: string, // để tra cứu answer
  ): Promise<{
    test_info: Record<string, any>;
    questions: Partial<Question>[];
    answer?: Answer; // thêm nếu tồn tại
  }> {
    const classObjectId = new Types.ObjectId(classID);
    const testObjectId = new Types.ObjectId(testID);

    const result = await this.classModel
      .findOne(
        {
          _id: classObjectId,
          'test._id': testObjectId,
          students_accept: email,
        },
        {
          descript: 1,
          duration_minute: 1,
          start_time: 1,
          end_time: 1,
          'test.$': 1,
        },
      )
      .lean();

    if (!result || !result.test || result.test.length === 0) {
      throw new Error('No matching test found');
    }

    const testDoc = { ...result.test[0] };
    const questionIDsRaw = testDoc.question_ids as Types.ObjectId[];

    if (!questionIDsRaw || !Array.isArray(questionIDsRaw)) {
      throw new Error('question_ids not found or invalid');
    }

    const questions = await this.getAllQuestionsByIds(questionIDsRaw);

    const test_info = {
      descript: testDoc.descript,
      duration_minute: testDoc.duration_minutes,
      start_time: testDoc.start_time,
      end_time: testDoc.end_time,
    };

    const filter = { test_id: testID, email: email };
    const existingAnswer = await this.answerModel.findOne(filter).lean();
    Logger.log('fillter, existingAnswer', filter, existingAnswer);
    const { question_ids, answer_user } = testDoc;
    return {
      test_info: testDoc,
      questions,
      ...(existingAnswer ? { answer: existingAnswer } : {}),
    };
  }
}
