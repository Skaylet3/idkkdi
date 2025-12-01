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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { DirectorsService } from '../../application/directors/directors.service';
import { CreateDirectorDto } from '../../application/directors/dtos/create-director.dto';
import { UpdateDirectorDto } from '../../application/directors/dtos/update-director.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Directors')
@ApiBearerAuth('JWT-auth')
@Controller('directors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create director', description: 'Create a new director and assign to school (Admin only)' })
  @ApiResponse({ status: 201, description: 'Director created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'School not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() dto: CreateDirectorDto) {
    return this.directorsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all directors', description: 'Get all directors (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns list of all directors' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  async findAll() {
    return this.directorsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Director UUID', type: String, format: 'uuid' })
  @ApiOperation({ summary: 'Get director by ID', description: 'Get detailed director information (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns director details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'Director not found' })
  async findOne(@Param('id') id: string) {
    return this.directorsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Director UUID', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateDirectorDto })
  @ApiOperation({ summary: 'Update director', description: 'Update director information (Admin only)' })
  @ApiResponse({ status: 200, description: 'Director updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'Director not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async update(@Param('id') id: string, @Body() dto: UpdateDirectorDto) {
    return this.directorsService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Director UUID', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete director', description: 'Delete a director (Admin only)' })
  @ApiResponse({ status: 204, description: 'Director deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  @ApiResponse({ status: 404, description: 'Director not found' })
  async delete(@Param('id') id: string) {
    await this.directorsService.delete(id);
  }
}
