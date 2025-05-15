import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guards';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswersService } from './answers.service';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answers')
@UseGuards(AuthGuard) // <-- bảo vệ JWT ở đây
export class AnswersController {
  constructor(private readonly answerSerive: AnswersService) {}
  @Post('submit-test')
  update(@Body() answers_user: UpdateAnswerDto) {
    this.answerSerive.updateAnswer(answers_user);
  }
}
