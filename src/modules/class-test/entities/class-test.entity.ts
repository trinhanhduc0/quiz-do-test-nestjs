// src/modules/class-test/entities/class-test.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Tests } from './test-embedded.entity';

export type ClassTestDocument = HydratedDocument<Classes>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Classes {
  @Prop({ required: true })
  class_name: string;

  @Prop({ required: true })
  author_mail: string;

  @Prop({ type: [Types.ObjectId], ref: 'Test' })
  test_id: Types.ObjectId[];

  @Prop({ required: true })
  email_id: string;

  @Prop({ type: [String], default: [] })
  students_accept: string[];

  @Prop({ type: [String], default: [] })
  students_wait: string[];

  @Prop({ default: false })
  is_public: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [Tests], default: [] })
  test: Tests[];
}

export const ClassTestSchema = SchemaFactory.createForClass(Classes);
