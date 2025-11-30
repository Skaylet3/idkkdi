import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateDirectorDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;
}
