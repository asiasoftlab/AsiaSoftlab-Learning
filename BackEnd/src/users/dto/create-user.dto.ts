import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id: string; // Firebase Auth UID

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsEnum(['student', 'instructor', 'admin'])
  role: 'student' | 'instructor' | 'admin';
}
