import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class MatchAnswer {
  @Prop()
  matchid: Types.ObjectId;
}
