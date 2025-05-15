// src/modules/answer/dto/create-answer.dto.ts
import { Date, Types } from 'mongoose';

export class CreateAnswerDto {
  class_id: Types.ObjectId;
  test_id: Types.ObjectId;
  author_mail: string;
  email_id: string;
  email: string;

  start_time: number;
}
