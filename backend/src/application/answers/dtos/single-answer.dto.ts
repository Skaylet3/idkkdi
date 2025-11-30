import { IsString, IsOptional, IsUUID } from 'class-validator';

export class SingleAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  @IsOptional()
  answerText?: string;

  @IsString()
  @IsOptional()
  selectedOption?: string;
}
