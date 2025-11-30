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
import { SchoolsService } from '../../application/schools/schools.service';
import { CreateSchoolDto } from '../../application/schools/dtos/create-school.dto';
import { UpdateSchoolDto } from '../../application/schools/dtos/update-school.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@ApiTags('Schools')
@ApiBearerAuth('JWT-auth')
@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @ApiOperation({ summary: 'Create school', description: 'Create a new school (Admin only)' })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async create(@Body() dto: CreateSchoolDto, @CurrentUser() user: JwtPayload) {
    return this.schoolsService.create(dto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all schools', description: 'Get all schools (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns list of all schools' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school by ID', description: 'Get detailed school information (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns school details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async findOne(@Param('id') id: string) {
    return this.schoolsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update school', description: 'Update school information (Admin only)' })
  @ApiResponse({ status: 200, description: 'School updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete school', description: 'Delete a school (Admin only)' })
  @ApiResponse({ status: 204, description: 'School deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'School not found' })
  async delete(@Param('id') id: string) {
    await this.schoolsService.delete(id);
  }
}
