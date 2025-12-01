import { IsString, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Question text',
    example: 'How would you rate the school facilities?',
    type: String,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Question type',
    enum: ['FREE_TEXT', 'MULTIPLE_CHOICE'],
    example: 'FREE_TEXT',
  })
  @IsEnum(['FREE_TEXT', 'MULTIPLE_CHOICE'])
  type: 'FREE_TEXT' | 'MULTIPLE_CHOICE';

  @ApiProperty({
    description: 'Display order (position in the questionnaire, starting from 1)',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  order: number;
}
