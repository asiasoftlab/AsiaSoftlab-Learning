import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsBoolean, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  courseTitle: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsOptional()
  certificateId?: string;

  @IsString()
  @IsOptional()
  certificateNumber?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  contentRating?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  instructorRating?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  practicalRating?: number;

  @IsString()
  @IsOptional()
  recommendLikelihood?: 'yes' | 'maybe' | 'no';

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  feedback: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateFeedbackStatusDto {
  @IsString()
  @IsNotEmpty()
  status: 'approved' | 'pending' | 'rejected';
}
