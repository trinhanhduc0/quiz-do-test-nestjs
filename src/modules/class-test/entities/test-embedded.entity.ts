// src/modules/class-test/entities/test-embedded.entity.ts

import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

export class Tests {
  @Prop({ type: Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  test_name: string;

  @Prop()
  descript: string;

  @Prop({ type: [Types.ObjectId] })
  question_ids: Types.ObjectId[];

  @Prop()
  is_test: boolean;

  @Prop()
  start_time: Date;

  @Prop()
  end_time: Date;

  @Prop()
  duration_minutes: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  email_id: string;

  @Prop()
  author_mail: string;

  @Prop({ type: [String], default: [] })
  answer_user: string[];
}
