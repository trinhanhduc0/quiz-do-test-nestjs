import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/question.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ], // Add any necessary imports here, such as MongooseModule for MongoDB
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsModule], // Export the service if needed in other modules
})
export class QuestionsModule {}
