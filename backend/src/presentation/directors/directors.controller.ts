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
import { DirectorsService } from '../../application/directors/directors.service';
import { CreateDirectorDto } from '../../application/directors/dtos/create-director.dto';
import { UpdateDirectorDto } from '../../application/directors/dtos/update-director.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('directors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  @Post()
  async create(@Body() dto: CreateDirectorDto) {
    return this.directorsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.directorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.directorsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDirectorDto) {
    return this.directorsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.directorsService.delete(id);
  }
}
