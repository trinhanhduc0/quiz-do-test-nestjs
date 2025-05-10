import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionsController {
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return 'Hello';
  }

  @Get()
  findAll() {
    return 'Hi';
  }
}
