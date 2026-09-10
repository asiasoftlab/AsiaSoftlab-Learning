import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn, IsArray } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @IsOptional()
  @IsString()
  instructorId?: string;

  @IsNotEmpty()
  @IsIn(['Draft', 'Published', 'Unpublished'])
  status: 'Draft' | 'Published' | 'Unpublished';

  @IsOptional()
  @IsArray()
  lessons: any[];

  @IsOptional()
  @IsArray()
  learningObjectives?: string[];
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  originalPrice?: number;

  @IsOptional()
  @IsIn(['Draft', 'Published', 'Unpublished'])
  status?: 'Draft' | 'Published' | 'Unpublished';

  @IsOptional()
  @IsArray()
  lessons?: any[];

  @IsOptional()
  @IsArray()
  learningObjectives?: string[];
}


