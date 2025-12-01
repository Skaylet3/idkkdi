import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'Teacher email address',
    example: 'teacher@school.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Teacher password (minimum 8 characters)',
    example: 'Teacher@123',
    minLength: 8,
    type: String,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Teacher full name',
    example: 'Jane Teacher',
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2)
  name: string;
}
