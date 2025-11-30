import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TestService } from './test.service';
import { CreateAdminDto } from './dtos/create-admin.dto';

@ApiTags('Test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('create-admin')
  @ApiOperation({
    summary: 'Create admin account',
    description: 'Testing utility to create an admin account (replaces database seeding)'
  })
  @ApiResponse({ status: 201, description: 'Admin account created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.testService.createAdminAccount(createAdminDto);
  }
}
