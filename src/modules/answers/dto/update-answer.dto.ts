// src/modules/answer/dto/create-answer.dto.ts
import { Types } from 'mongoose';

export class CreateFillInTheBlankDto {
  id: Types.ObjectId;
  correct_answer: string;
}

export class CreateOptionAnswerDto {
  id: Types.ObjectId;
  matchid?: Types.ObjectId;
}

export class CreateQuestionAnswerDto {
  question_id: Types.ObjectId;
  type: string;
  fill_in_the_blank?: CreateFillInTheBlankDto[];
  options?: CreateOptionAnswerDto[];
}

export class UpdateAnswerDto {
  test_id: Types.ObjectId;
  email_id: string;
  email: string;
  question_answer: CreateQuestionAnswerDto[];
}
