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
import { SchoolsService } from '../../application/schools/schools.service';
import { CreateSchoolDto } from '../../application/schools/dtos/create-school.dto';
import { UpdateSchoolDto } from '../../application/schools/dtos/update-school.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  async create(
    @Body() dto: CreateSchoolDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.schoolsService.create(dto, user.userId);
  }

  @Get()
  async findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schoolsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.schoolsService.delete(id);
  }
}
