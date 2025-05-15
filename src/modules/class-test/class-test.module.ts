import { Module } from '@nestjs/common';
import { ClassTestService } from './class-test.service';
import { ClassTestController } from './class-test.controller';
import { Classes, ClassTestSchema } from './entities/class-test.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsService } from '../questions/questions.service';
import { QuestionsModule } from '../questions/questions.module';
import {
  Question,
  QuestionSchema,
} from '../questions/entities/question.entity';
import { Answer, AnswerSchema } from '../answers/entities/answer.entity';
import { AnswersModule } from '../answers/answers.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    AnswersModule,
    QuestionsModule,
    RedisModule,
    MongooseModule.forFeature([
      { name: Classes.name, schema: ClassTestSchema },
      { name: Question.name, schema: QuestionSchema }, // Assuming you have a Question schema defined
    ]), // Assuming you have a Classes schema defined
  ],
  controllers: [ClassTestController],
  providers: [ClassTestService],
  exports: [ClassTestModule],
})
export class ClassTestModule {}
