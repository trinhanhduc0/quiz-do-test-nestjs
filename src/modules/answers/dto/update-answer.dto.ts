// src/modules/answer/dto/create-answer.dto.ts
import { Date, Types } from 'mongoose';

// export class CreateFillInTheBlankDto {
//   id: Types.ObjectId;
//   correct_answer: string;
// }

// export class CreateOptionAnswerDto {
//   id: Types.ObjectId;
//   matchid?: Types.ObjectId;
// }

// export class CreateQuestionAnswerDto {
//   question_id: Types.ObjectId;
//   type: string;
//   fill_in_the_blank?: CreateFillInTheBlankDto[];
//   options?: CreateOptionAnswerDto[];
// }

export class UpdateAnswerDto {
  class_id: Types.ObjectId;
  test_id: Types.ObjectId;
  author_mail: string;
  email: string;
  score: number;
  question_answer: Record<
    string,
    {
      type: string;
      answer: any;
    }
  >;
  end_time: number;
}
