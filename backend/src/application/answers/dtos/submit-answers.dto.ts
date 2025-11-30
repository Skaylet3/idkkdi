import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { SingleAnswerDto } from './single-answer.dto';

export class SubmitAnswersDto {
  @IsUUID()
  eventId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleAnswerDto)
  @ArrayMinSize(1)
  answers: SingleAnswerDto[];
}
