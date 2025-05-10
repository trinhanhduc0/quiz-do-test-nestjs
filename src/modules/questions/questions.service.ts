import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './entities/question.entity';
//
@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async getAllQuestionsByIds(ids: string[]): Promise<Partial<Question>[]> {
    if (!ids || ids.length === 0) {
      throw new Error('No question IDs provided');
    }

    const objectIds = ids.map((id) => new Types.ObjectId(id));

    const filter = { _id: { $in: objectIds } };

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
}
