import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(['student', 'instructor', 'admin'], {
    message: 'Role must be student, instructor, or admin',
  })
  role: 'student' | 'instructor' | 'admin';
}
