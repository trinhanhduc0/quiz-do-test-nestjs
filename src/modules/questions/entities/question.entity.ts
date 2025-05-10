// src/modules/question/entities/question.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { FillInTheBlank } from './fill-in-the-blank.entity';
import { MatchAnswer } from './match-answer.entity';
import { Metadata } from './metadata.entity';
import { Option } from './option.entity';
import { QuestionContent } from './question-content.entity';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Question {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ type: [FillInTheBlank], default: [] })
  fill_in_the_blank: FillInTheBlank[];

  @Prop({ type: [MatchAnswer], default: [] })
  match: MatchAnswer[];

  @Prop()
  metadata: Metadata;

  @Prop({ type: [Option], default: [] })
  options: Option[];

  @Prop()
  question_content: QuestionContent;

  @Prop()
  suggestion: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  type: string;

  @Prop()
  score: number;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  correctOptionId: [];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
