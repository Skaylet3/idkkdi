import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateSchoolDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
