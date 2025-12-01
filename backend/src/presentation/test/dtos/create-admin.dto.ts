import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@school.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Admin password (minimum 8 characters)',
    example: 'Admin@123',
    minLength: 8,
    type: String,
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Admin full name',
    example: 'System Administrator',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
