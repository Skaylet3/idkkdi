import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSchoolDto {
  @ApiPropertyOptional({
    description: 'School name (minimum 2 characters)',
    example: 'Springfield Elementary School',
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'School physical address',
    example: '123 Main St, Springfield, ST 12345',
    type: String,
  })
  @IsString()
  @IsOptional()
  address?: string;
}
