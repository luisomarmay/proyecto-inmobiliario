// src/auth/dto/admin-login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Contraseña demasiado corta' })
  password: string;
}
