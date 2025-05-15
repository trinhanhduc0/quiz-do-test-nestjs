import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class MatchItems {
  @Prop()
  id: Types.ObjectId;

  @Prop()
  text: string;
}

export class MatchOptions {
  @Prop()
  id: Types.ObjectId;

  @Prop()
  text: string;

  @Prop({ required: false })
  match_id: string;
}
