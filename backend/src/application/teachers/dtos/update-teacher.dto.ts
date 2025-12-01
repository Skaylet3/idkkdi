import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTeacherDto {
  @ApiPropertyOptional({
    description: 'Teacher email address',
    example: 'teacher@school.com',
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Teacher full name',
    example: 'Jane Teacher',
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;
}
