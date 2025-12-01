import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SingleAnswerDto {
  @ApiProperty({
    description: 'Question ID being answered',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  questionId: string;

  @ApiPropertyOptional({
    description: 'Free text answer (for FREE_TEXT questions)',
    example: 'The facilities are excellent and well-maintained',
    type: String,
  })
  @IsString()
  @IsOptional()
  answerText?: string;

  @ApiPropertyOptional({
    description: 'Selected option (for MULTIPLE_CHOICE questions)',
    example: 'YES',
    type: String,
  })
  @IsString()
  @IsOptional()
  selectedOption?: string;
}
