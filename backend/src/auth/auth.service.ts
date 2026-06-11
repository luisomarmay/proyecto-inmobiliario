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
import { AdminLoginDto } from './dto/admin-login.dto';

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
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Este email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.CLIENTE,
    });

    await this.mailService.sendWelcome(user.email, user.name);

    return this.generateAndSaveTokens(user);
  }

  // ----------------------------------------------------------
  // LOGIN LOCAL
  // ----------------------------------------------------------
  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    if (!user) {
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
  // LOGIN ADMIN
  // Solo permite acceso a usuarios con rol ADMIN
  // ----------------------------------------------------------
  async adminLogin(dto: AdminLoginDto): Promise<AuthTokens> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Esta cuenta usa autenticación social. No permitido en panel admin.',
      );
    }

    const adminPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!adminPasswordMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.generateAndSaveTokens(user);
  }

  // ----------------------------------------------------------
  // LOGIN CON GOOGLE
  // ----------------------------------------------------------
  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
  }): Promise<AuthTokens> {
    let user = await this.usersService.findByGoogleId(googleUser.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(googleUser.email);

      if (user) {
        await this.usersService.update(user.id, {
          googleId: googleUser.googleId,
          avatar: googleUser.avatar,
        });
      } else {
        user = await this.usersService.create({
          googleId: googleUser.googleId,
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          role: UserRole.CLIENTE,
        });
        await this.mailService.sendWelcome(user.email, user.name);
      }
    }

    return this.generateAndSaveTokens(user);
  }

  // ----------------------------------------------------------
  // REFRESH TOKEN
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
  // ----------------------------------------------------------
  async logout(userId: string): Promise<void> {
    await this.usersService.update(userId, { refreshToken: null });
  }

  // ----------------------------------------------------------
  // FORGOT PASSWORD
  // ----------------------------------------------------------
  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersService.update(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    await this.mailService.sendPasswordReset(user.email, token);
  }

  // ----------------------------------------------------------
  // RESET PASSWORD
  // ----------------------------------------------------------
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('El enlace de recuperación ha expirado');
    }

    const hashed = await bcrypt.hash(newPassword, 12);

    await this.usersService.update(user.id, {
      password: hashed,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  // ----------------------------------------------------------
  // LOGIN CON FACEBOOK
  // ----------------------------------------------------------
  async facebookLogin(facebookUser: {
    facebookId: string;
    email: string;
    name: string;
    avatar: string;
  }): Promise<AuthTokens> {
    let user = await this.usersService.findByFacebookId(facebookUser.facebookId);

    if (!user) {
      user = await this.usersService.findByEmail(facebookUser.email);
      if (user) {
        await this.usersService.update(user.id, {
          facebookId: facebookUser.facebookId,
          avatar: facebookUser.avatar,
        });
      } else {
        user = await this.usersService.create({
          facebookId: facebookUser.facebookId,
          email: facebookUser.email,
          name: facebookUser.name,
          avatar: facebookUser.avatar,
          role: UserRole.CLIENTE,
        });
        await this.mailService.sendWelcome(user.email, user.name);
      }
    }

    return this.generateAndSaveTokens(user);
  }

  // ----------------------------------------------------------
  // LOGIN CON TWITTER
  // ----------------------------------------------------------
  async twitterLogin(twitterUser: {
    twitterId: string;
    email: string;
    name: string;
    avatar: string;
  }): Promise<AuthTokens> {
    let user = await this.usersService.findByTwitterId(twitterUser.twitterId);

    if (!user) {
      user = await this.usersService.findByEmail(twitterUser.email);
      if (user) {
        await this.usersService.update(user.id, {
          twitterId: twitterUser.twitterId,
          avatar: twitterUser.avatar,
        });
      } else {
        user = await this.usersService.create({
          twitterId: twitterUser.twitterId,
          email: twitterUser.email,
          name: twitterUser.name,
          avatar: twitterUser.avatar,
          role: UserRole.CLIENTE,
        });
        await this.mailService.sendWelcome(user.email, user.name);
      }
    }

    return this.generateAndSaveTokens(user);
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

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

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
