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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { AnswersService } from '../../application/answers/answers.service';
import { SubmitAnswersDto } from '../../application/answers/dtos/submit-answers.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@ApiTags('Answers')
@ApiBearerAuth('JWT-auth')
@Controller('answers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  // Teacher submits answers for an event
  @Post('submit')
  @Roles('TEACHER')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: SubmitAnswersDto })
  @ApiOperation({ summary: 'Submit answers', description: 'Teacher submits bulk answers for an event (Teacher only, one submission per event)' })
  @ApiResponse({ status: 201, description: 'Answers submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or missing required answers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TEACHER role' })
  @ApiResponse({ status: 404, description: 'Event or question not found' })
  @ApiResponse({ status: 409, description: 'Conflict - already submitted answers for this event' })
  async submitAnswers(
    @Body() dto: SubmitAnswersDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.answersService.submitAnswers(dto, user);
  }

  // Teacher views their answer history
  @Get('my-history')
  @Roles('TEACHER')
  @ApiOperation({ summary: 'Get my answer history', description: 'Teacher views their complete answer submission history (Teacher only)' })
  @ApiResponse({ status: 200, description: 'Returns teacher\'s answer history across all events' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TEACHER role' })
  async getMyHistory(@CurrentUser() user: JwtPayload) {
    return this.answersService.getMyHistory(user);
  }

  // Teacher views their answers for a specific event
  @Get('my-answers/:eventId')
  @Roles('TEACHER')
  @ApiParam({ name: 'eventId', description: 'Event UUID', type: String, format: 'uuid' })
  @ApiOperation({ summary: 'Get my answers for event', description: 'Teacher views their submitted answers for a specific event (Teacher only)' })
  @ApiResponse({ status: 200, description: 'Returns teacher\'s answers for the specified event' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires TEACHER role' })
  @ApiResponse({ status: 404, description: 'Event not found or no answers submitted' })
  async getMyAnswersForEvent(
    @CurrentUser() user: JwtPayload,
    @Param('eventId') eventId: string,
  ) {
    return this.answersService.getMyAnswersForEvent(user, eventId);
  }

  // Director views results for their school for a specific event
  @Get('school-results/:eventId')
  @Roles('DIRECTOR')
  @ApiParam({ name: 'eventId', description: 'Event UUID', type: String, format: 'uuid' })
  @ApiOperation({ summary: 'Get school results', description: 'Director views all teachers\' results for their school for a specific event (Director only)' })
  @ApiResponse({ status: 200, description: 'Returns all teachers\' answers from director\'s school for the event' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires DIRECTOR role or not assigned to school' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getSchoolResults(
    @CurrentUser() user: JwtPayload,
    @Param('eventId') eventId: string,
  ) {
    return this.answersService.getSchoolResults(user, eventId);
  }

  // Director views complete history for a specific teacher in their school
  @Get('teacher-history/:teacherId')
  @Roles('DIRECTOR')
  @ApiParam({ name: 'teacherId', description: 'Teacher UUID', type: String, format: 'uuid' })
  @ApiOperation({ summary: 'Get teacher history', description: 'Director views complete answer history for a specific teacher in their school (Director only)' })
  @ApiResponse({ status: 200, description: 'Returns complete answer history for the specified teacher' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires DIRECTOR role, not assigned to school, or teacher not in director\'s school' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async getTeacherHistory(
    @CurrentUser() user: JwtPayload,
    @Param('teacherId') teacherId: string,
  ) {
    return this.answersService.getTeacherHistory(user, teacherId);
  }
}
