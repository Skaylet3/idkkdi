import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from '../../application/events/events.service';
import { CreateEventDto } from '../../application/events/dtos/create-event.dto';
import { UpdateEventDto } from '../../application/events/dtos/update-event.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Events')
@ApiBearerAuth('JWT-auth')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create event', description: 'Create a new event with questions (Admin only, max 50 questions per event)' })
  @ApiResponse({ status: 201, description: 'Event created successfully with questions' })
  @ApiResponse({ status: 400, description: 'Invalid input data or exceeds 50 questions limit' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all events', description: 'Get all events (All authenticated users)' })
  @ApiResponse({ status: 200, description: 'Returns list of all events' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event with questions', description: 'Get event details including all questions (All authenticated users)' })
  @ApiResponse({ status: 200, description: 'Returns event with all questions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findByIdWithQuestions(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update event', description: 'Update event information (Admin only)' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete event', description: 'Delete an event and all its questions (Admin only)' })
  @ApiResponse({ status: 204, description: 'Event deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async delete(@Param('id') id: string) {
    await this.eventsService.delete(id);
  }
}
