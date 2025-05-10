import { Controller, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guards';

@Controller('answers')
@UseGuards(AuthGuard) // <-- bảo vệ JWT ở đây
export class AnswersController {}
