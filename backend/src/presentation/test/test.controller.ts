import { Controller, Post, Body } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateAdminDto } from './dtos/create-admin.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('create-admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.testService.createAdminAccount(createAdminDto);
  }
}
