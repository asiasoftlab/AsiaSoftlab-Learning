import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateAssessmentQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  options: string[];

  @IsNumber()
  correctOptionIndex: number;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsNumber()
  @IsOptional()
  points?: number;
}

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  durationMinutes: number;

  @IsNumber()
  passingScore: number;

  @IsNumber()
  maxAttempts: number;

  @IsString()
  @IsOptional()
  status?: 'Published' | 'Draft' | 'Archived';

  @IsArray()
  @IsOptional()
  questions?: CreateAssessmentQuestionDto[];
}

export class UpdateAssessmentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsOptional()
  courseTitle?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @IsNumber()
  @IsOptional()
  passingScore?: number;

  @IsNumber()
  @IsOptional()
  maxAttempts?: number;

  @IsString()
  @IsOptional()
  status?: 'Published' | 'Draft' | 'Archived';

  @IsArray()
  @IsOptional()
  questions?: CreateAssessmentQuestionDto[];
}

export class SubmitAssessmentDto {
  @IsArray()
  answers: {
    questionId: string;
    selectedOption: number;
  }[];

  @IsNumber()
  @IsOptional()
  timeSpentSeconds?: number;
}
