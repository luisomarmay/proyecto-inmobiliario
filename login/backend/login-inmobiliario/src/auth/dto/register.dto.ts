import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'El nombre es muy corto' })
  @MaxLength(80)
  name: string;

  @IsEmail({}, { message: 'Ingresa un email válido' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud|live|msn)\.com$/,
    { message: 'Solo se permiten correos Gmail, Hotmail, Outlook, Yahoo o iCloud' }
  )
  email: string;
  
@IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^[a-zA-Z0-9]+$/,  { message: 'La contraseña no puede contener caracteres especiales' }
  )
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, { message: 'La contraseña debe tener al menos una mayúscula, una minúscula y un número' }
    )
  password: string;
}
