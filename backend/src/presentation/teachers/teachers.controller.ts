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
import { TeachersService } from '../../application/teachers/teachers.service';
import { CreateTeacherDto } from '../../application/teachers/dtos/create-teacher.dto';
import { UpdateTeacherDto } from '../../application/teachers/dtos/update-teacher.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DIRECTOR')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  async create(
    @Body() dto: CreateTeacherDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.teachersService.create(dto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    // Director sees only their school's teachers
    if (!user.schoolId) {
      throw new ForbiddenException('Director not assigned to school');
    }
    return this.teachersService.findBySchoolId(user.schoolId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teachersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.teachersService.delete(id);
  }
}
