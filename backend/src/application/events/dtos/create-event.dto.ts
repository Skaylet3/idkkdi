import {
  IsString,
  IsOptional,
  MinLength,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './create-question.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event name (minimum 2 characters)',
    example: 'Q1 2025 School Assessment',
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'First quarter assessment for all teachers',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the event is active and available for participation',
    example: true,
    default: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Array of questions for this event (minimum 1, maximum 50)',
    type: [CreateQuestionDto],
    minItems: 1,
    maxItems: 50,
    example: [
      {
        text: 'How would you rate the school facilities?',
        type: 'FREE_TEXT',
        order: 1,
      },
      {
        text: 'Are you satisfied with student engagement?',
        type: 'MULTIPLE_CHOICE',
        order: 2,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  questions: CreateQuestionDto[];
}
