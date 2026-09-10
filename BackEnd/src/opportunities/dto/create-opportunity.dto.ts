import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateOpportunityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  applyLink: string;

  @IsOptional()
  @IsIn(['Open', 'Closed'])
  status?: 'Open' | 'Closed';
}

