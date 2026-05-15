// ============================================================
// auth.service.ts
// Contiene toda la lógica de autenticación:
//   - register(): crea usuario con contraseña hasheada
//   - login(): valida credenciales y emite tokens
//   - googleLogin(): crea o recupera usuario de Google
//   - refreshTokens(): renueva el access token
//   - logout(): invalida el refresh token
// ============================================================

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
// Estructura de respuesta estándar al hacer login/register
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // ----------------------------------------------------------
  // REGISTRO LOCAL
  // ----------------------------------------------------------
  async register(dto: RegisterDto): Promise<AuthTokens> {
    // Verificar que el email no esté en uso
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Este email ya está registrado');
    }

    // Hashear la contraseña antes de guardar (nunca guardar texto plano)
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.CLIENTE, // por defecto, todo nuevo registro es cliente
    });

    return this.generateAndSaveTokens(user);
  }

  // ----------------------------------------------------------
  // LOGIN LOCAL
  // ----------------------------------------------------------
  async login(dto: LoginDto): Promise<AuthTokens> {
    // Obtener usuario incluyendo la contraseña (columna con select: false)
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    if (!user) {
      // Mismo mensaje para email y password: evitar enumeración de usuarios
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Esta cuenta usa Google. Inicia sesión con Google.',
      );
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.generateAndSaveTokens(user);
  }

  // ----------------------------------------------------------
  // LOGIN / REGISTRO CON GOOGLE
  // Llamado desde GoogleStrategy.validate()
  // ----------------------------------------------------------
  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
  }): Promise<AuthTokens> {
    // 1. Buscar si ya existe por Google ID
    let user = await this.usersService.findByGoogleId(googleUser.googleId);

    if (!user) {
      // 2. Buscar si existe con ese email (registro previo local)
      user = await this.usersService.findByEmail(googleUser.email);

      if (user) {
        // Vincular Google ID a cuenta existente
        await this.usersService.update(user.id, {
          googleId: googleUser.googleId,
          avatar: googleUser.avatar,
        });
      } else {
        // 3. Crear cuenta nueva con Google
        user = await this.usersService.create({
          googleId: googleUser.googleId,
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          role: UserRole.CLIENTE,
        });
      }
    }

    return this.generateAndSaveTokens(user);
  }

  // ----------------------------------------------------------
  // REFRESH TOKEN
  // Renueva el access token usando el refresh token
  // ----------------------------------------------------------
  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Sesión inválida');
    }

    const tokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatch) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    return this.generateAndSaveTokens(user);
  }

  // ----------------------------------------------------------
  // LOGOUT
  // Elimina el refresh token guardado (invalida la sesión)
  // ----------------------------------------------------------
  async logout(userId: string): Promise<void> {
    await this.usersService.update(userId, { refreshToken: null });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    // Siempre respondemos igual aunque el email no exista
    // para no revelar qué emails están registrados
    if (!user) return;

    // Genera un token aleatorio seguro de 32 bytes
    const token = crypto.randomBytes(32).toString('hex');

    // El token expira en 1 hora
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // Guarda el token en la BD
    await this.usersService.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    // Envía el email con el link
    await this.mailService.sendPasswordReset(user.email, token);
  }

  // ----------------------------------------------------------
  // RESTABLECER CONTRASEÑA
  // ----------------------------------------------------------
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // Verifica que el token no haya expirado
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('El enlace de recuperación ha expirado');
    }

    // Hashea la nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 12);

    // Actualiza contraseña y limpia el token
    await this.usersService.update(user.id, {
      password: hashed,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }
  // ----------------------------------------------------------
  // PRIVADO: genera tokens y los guarda
  // ----------------------------------------------------------
  private async generateAndSaveTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Access token: corta duración (15 min)
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    // Refresh token: larga duración (7 días)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // Guardar refresh token hasheado (nunca en texto plano)
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: hashedRefresh });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
}
