// src/modules/answer/schemas/answer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ timestamps: true })
export class FillInTheBlank {
  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId;

  @Prop()
  text_before: string;

  @Prop()
  blank: string;

  @Prop()
  correct_answer: string;

  @Prop()
  text_after: string;
}

@Schema()
export class OptionAnswer {
  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false })
  matchid?: Types.ObjectId;
}

@Schema()
export class QuestionAnswer {
  @Prop({ type: Types.ObjectId })
  question_id: Types.ObjectId;

  @Prop()
  type: string;

  @Prop({ type: [FillInTheBlank], required: false })
  fill_in_the_blank: FillInTheBlank[];

  @Prop({ type: [OptionAnswer], required: false })
  options: OptionAnswer[];
}

@Schema({ timestamps: true })
export class Answer {
  @Prop({ type: Types.ObjectId })
  test_id: Types.ObjectId;

  @Prop()
  email_id: string;

  @Prop()
  email: string;

  @Prop({ type: [QuestionAnswer], default: [] })
  question_answer: QuestionAnswer[];

  @Prop({ type: Number, default: 0 })
  score: number;

  @Prop()
  start_time: Date;

  @Prop()
  end_time: Date;
}

export const FillInTheBlankSchema =
  SchemaFactory.createForClass(FillInTheBlank);
export const OptionAnswerSchema = SchemaFactory.createForClass(OptionAnswer);
export const QuestionAnswerSchema =
  SchemaFactory.createForClass(QuestionAnswer);

export const AnswerSchema = SchemaFactory.createForClass(Answer);
