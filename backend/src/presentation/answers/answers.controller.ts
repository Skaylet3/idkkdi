import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnswersService } from '../../application/answers/answers.service';
import { SubmitAnswersDto } from '../../application/answers/dtos/submit-answers.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@Controller('answers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  // Teacher submits answers for an event
  @Post('submit')
  @Roles('TEACHER')
  @HttpCode(HttpStatus.CREATED)
  async submitAnswers(
    @Body() dto: SubmitAnswersDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.answersService.submitAnswers(dto, user);
  }

  // Teacher views their answer history
  @Get('my-history')
  @Roles('TEACHER')
  async getMyHistory(@CurrentUser() user: JwtPayload) {
    return this.answersService.getMyHistory(user);
  }

  // Teacher views their answers for a specific event
  @Get('my-answers/:eventId')
  @Roles('TEACHER')
  async getMyAnswersForEvent(
    @CurrentUser() user: JwtPayload,
    @Param('eventId') eventId: string,
  ) {
    return this.answersService.getMyAnswersForEvent(user, eventId);
  }

  // Director views results for their school for a specific event
  @Get('school-results/:eventId')
  @Roles('DIRECTOR')
  async getSchoolResults(
    @CurrentUser() user: JwtPayload,
    @Param('eventId') eventId: string,
  ) {
    return this.answersService.getSchoolResults(user, eventId);
  }

  // Director views complete history for a specific teacher in their school
  @Get('teacher-history/:teacherId')
  @Roles('DIRECTOR')
  async getTeacherHistory(
    @CurrentUser() user: JwtPayload,
    @Param('teacherId') teacherId: string,
  ) {
    return this.answersService.getTeacherHistory(user, teacherId);
  }
}
