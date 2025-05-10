import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './entities/answer.entity';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { RedisService } from '../redis/entities/redi.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
