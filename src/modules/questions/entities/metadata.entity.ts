import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Metadata {
  @Prop()
  author: string;
}
