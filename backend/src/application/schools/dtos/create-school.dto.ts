import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty({
    description: 'School name (minimum 2 characters)',
    example: 'Springfield Elementary School',
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({
    description: 'School physical address',
    example: '123 Main St, Springfield, ST 12345',
    type: String,
  })
  @IsString()
  @IsOptional()
  address?: string;
}
