// ============================================================
// login.dto.ts
// DTO = Data Transfer Object.
// Valida los datos que llegan en el body de la petición.
// class-validator lanza un error automático si no cumple las reglas.
// ============================================================

import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Ingresa un email válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
