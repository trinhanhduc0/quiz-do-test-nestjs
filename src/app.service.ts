import { Injectable, Logger } from '@nestjs/common';
import { AnswersService } from './modules/answers/answers.service';
import { Answer } from './modules/answers/entities/answer.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
