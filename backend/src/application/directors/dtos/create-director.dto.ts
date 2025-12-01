import { IsString, IsEmail, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDirectorDto {
  @ApiProperty({
    description: 'Director email address',
    example: 'director@school.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Director password (minimum 8 characters)',
    example: 'Director@123',
    minLength: 8,
    type: String,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Director full name',
    example: 'John Director',
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'School ID to assign the director to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  schoolId: string;
}
