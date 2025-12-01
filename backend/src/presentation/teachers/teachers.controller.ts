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
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TeachersService } from '../../application/teachers/teachers.service';
import { CreateTeacherDto } from '../../application/teachers/dtos/create-teacher.dto';
import { UpdateTeacherDto } from '../../application/teachers/dtos/update-teacher.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@ApiTags('Teachers')
@ApiBearerAuth('JWT-auth')
@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DIRECTOR')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiOperation({ summary: 'Create teacher', description: 'Create a new teacher in director\'s school (Director only)' })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires DIRECTOR role or not assigned to school' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() dto: CreateTeacherDto, @CurrentUser() user: JwtPayload) {
    return this.teachersService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List teachers', description: 'Get all teachers in director\'s school (Director only)' })
  @ApiResponse({ status: 200, description: 'Returns list of teachers in director\'s school' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires DIRECTOR role or not assigned to school' })
  async findAll(@CurrentUser() user: JwtPayload) {
    // Director sees only their school's teachers
    if (!user.schoolId) {
      throw new ForbiddenException('Director not assigned to school');
    }
    return this.teachersService.findBySchoolId(user.schoolId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Teacher UUID', type: String, format: 'uuid' })
  @ApiOperation({ summary: 'Get teacher by ID', description: 'Get detailed teacher information (Director only)' })
  @ApiResponse({ status: 200, description: 'Returns teacher details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires DIRECTOR role' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async findOne(@Param('id') id: string) {
    return this.teachersService.findById(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Teacher UUID', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateTeacherDto })
  @ApiOperation({ summary: 'Update teacher', description: 'Update teacher information (Director only)' })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires DIRECTOR role' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Teacher UUID', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete teacher', description: 'Delete a teacher (Director only)' })
  @ApiResponse({ status: 204, description: 'Teacher deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires DIRECTOR role' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async delete(@Param('id') id: string) {
    await this.teachersService.delete(id);
  }
}
