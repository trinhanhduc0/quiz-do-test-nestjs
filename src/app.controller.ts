import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AnswersService } from './modules/answers/answers.service';
import { Answer } from './modules/answers/entities/answer.entity';
import { CreateAnswerDto } from './modules/answers/dto/create-answer.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly answersService: AnswersService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'hello world';
  }
}
