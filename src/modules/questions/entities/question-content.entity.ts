import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class QuestionContent {
  @Prop()
  text: string;

  @Prop()
  image_url: string;

  @Prop()
  video_url: string;

  @Prop()
  audio_url: string;
}
