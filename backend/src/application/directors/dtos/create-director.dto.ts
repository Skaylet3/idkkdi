import { IsString, IsEmail, MinLength, IsUUID } from 'class-validator';

export class CreateDirectorDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsUUID()
  schoolId: string;
}
