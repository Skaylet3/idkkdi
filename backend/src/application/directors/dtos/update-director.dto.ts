import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDirectorDto {
  @ApiPropertyOptional({
    description: 'Director email address',
    example: 'director@school.com',
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Director full name',
    example: 'John Director',
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;
}
