import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ClassTestService } from './class-test.service';
import { Request, Response } from 'express';
import { GetTestDto } from './dto/get-test.dto';
import { AuthGuard } from '../auth/guards/auth.guards';

@Controller('class-test')
export class ClassTestController {
  constructor(
    private readonly classTestService: ClassTestService,
    private readonly quesionService: ClassTestService, // <-- thêm vào đây
  ) {}

  @UseGuards(AuthGuard) // <-- bảo vệ JWT ở đây
  @Post('get-question-of-test')
  async getQuestionOfTest(
    @Body() dto: GetTestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const email: string = req.user.email || ''; // thông tin từ JwtStrategy
    const emailID: string = req.user.email_id || '';
    Logger.log(email);
    Logger.log(emailID);
    if (!emailID) {
      throw new HttpException('Invalid email ID', HttpStatus.BAD_REQUEST);
    }

    try {
      if (dto !== undefined) {
        const result = await this.classTestService.getQuestionOfTest(
          dto.class_id as string,
          dto.test_id as string,
          email,
        );
        res.status(HttpStatus.OK).json(result);
      }
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }
}
