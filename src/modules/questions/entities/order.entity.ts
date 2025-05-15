import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class OrderItems {
  @Prop()
  id: Types.ObjectId;

  @Prop()
  text: string;

  @Prop()
  order: number;
}
