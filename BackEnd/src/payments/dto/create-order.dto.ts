import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  studentName: string;

  @IsNotEmpty()
  @IsEmail()
  studentEmail: string;

  @IsNotEmpty()
  @IsString()
  studentPhone: string;
}
