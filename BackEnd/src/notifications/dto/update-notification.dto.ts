import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message?: string;

  @IsOptional()
  @IsEnum(['info', 'success', 'warning', 'alert'])
  type?: 'info' | 'success' | 'warning' | 'alert';
}
