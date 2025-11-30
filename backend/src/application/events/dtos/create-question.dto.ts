import { IsString, IsEnum, IsInt, Min } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  text: string;

  @IsEnum(['FREE_TEXT', 'MULTIPLE_CHOICE'])
  type: 'FREE_TEXT' | 'MULTIPLE_CHOICE';

  @IsInt()
  @Min(1)
  order: number;
}
