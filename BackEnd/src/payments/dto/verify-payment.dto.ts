import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  razorpay_order_id: string;

  @IsNotEmpty()
  @IsString()
  razorpay_payment_id: string;

  @IsNotEmpty()
  @IsString()
  razorpay_signature: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  studentName?: string;

  @IsOptional()
  @IsEmail()
  studentEmail?: string;

  @IsOptional()
  @IsString()
  studentPhone?: string;
}
