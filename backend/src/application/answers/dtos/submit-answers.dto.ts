import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { SingleAnswerDto } from './single-answer.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswersDto {
  @ApiProperty({
    description: 'Event ID for which answers are being submitted',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: String,
  })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    description: 'Array of answers for all questions in the event (minimum 1)',
    type: [SingleAnswerDto],
    minItems: 1,
    example: [
      {
        questionId: '123e4567-e89b-12d3-a456-426614174001',
        answerText: 'The facilities are excellent and well-maintained',
      },
      {
        questionId: '123e4567-e89b-12d3-a456-426614174002',
        selectedOption: 'YES',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleAnswerDto)
  @ArrayMinSize(1)
  answers: SingleAnswerDto[];
}
