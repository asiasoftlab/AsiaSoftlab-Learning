import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  applyLink?: string;

  @IsOptional()
  @IsIn(['Open', 'Closed'])
  status?: 'Open' | 'Closed';
}

