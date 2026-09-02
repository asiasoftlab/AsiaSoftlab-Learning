import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsEnum(['info', 'success', 'warning', 'alert'])
  type?: 'info' | 'success' | 'warning' | 'alert';
}
