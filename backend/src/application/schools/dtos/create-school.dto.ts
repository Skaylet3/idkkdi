import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  address?: string;
}
