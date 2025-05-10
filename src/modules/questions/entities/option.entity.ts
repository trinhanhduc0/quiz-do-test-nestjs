import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class Option {
  @Prop()
  id: Types.ObjectId;

  @Prop()
  matchid: Types.ObjectId;

  @Prop()
  text: string;

  @Prop()
  imageurl: string;

  @Prop()
  iscorrect: boolean;

  @Prop()
  match: string;

  @Prop()
  order: number;
}
