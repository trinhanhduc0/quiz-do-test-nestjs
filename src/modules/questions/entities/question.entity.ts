// src/modules/question/entities/question.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { FillInTheBlank } from './fill-in-the-blank.entity';
import { MatchItems, MatchOptions } from './match-answer.entity';
import { Metadata } from './metadata.entity';
import { Option } from './option.entity';
import { QuestionContent } from './question-content.entity';
import { OrderItems } from './order.entity';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Question {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  metadata: Metadata;

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

  @Prop({ type: [Option], default: [] })
  options: Option[];

  @Prop({ type: [FillInTheBlank], default: [] })
  fill_in_the_blanks: FillInTheBlank[];

  @Prop({ type: [OrderItems], default: [] })
  order_items: OrderItems[];

  @Prop({ type: [MatchItems], default: [] })
  match_items: MatchItems[];

  @Prop({ type: [MatchOptions], default: [] })
  match_options: MatchOptions[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
