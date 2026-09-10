import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class ChatDto {
  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  history?: Array<{ role: 'user' | 'model'; text: string }>;
}

