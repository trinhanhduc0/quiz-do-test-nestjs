import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class FillInTheBlank {
  @Prop()
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
