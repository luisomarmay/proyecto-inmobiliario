import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './guards/google-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const tokens = await this.authService.register(dto);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return res.json({
      accessToken: tokens.accessToken,
      user: tokens.user,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return res.json({
      accessToken: tokens.accessToken,
      user: tokens.user,
    });
  }

  // GET /auth/google
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.googleLogin(req.user as any);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    const frontendUrl = this.configService.get('FRONTEND_URL');
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${tokens.accessToken}&role=${tokens.user.role}`,
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = (req as any).cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No hay refresh token' });
    }
    const decoded = this.extractPayload(refreshToken);
    const tokens = await this.authService.refreshTokens(decoded.sub, refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return res.json({ accessToken: tokens.accessToken });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    const userId = (req.user as any).id;
    await this.authService.logout(userId);
    res.clearCookie('refreshToken');
    return res.json({ message: 'Sesión cerrada correctamente' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });
  }

  private extractPayload(token: string): any {
    const base64 = token.split('.')[1];
    return JSON.parse(Buffer.from(base64, 'base64url').toString());
  }
  // POST /auth/forgot-password
  // Body: { email }
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.forgotPassword(body.email);
    // Siempre mismo mensaje para no revelar si el email existe
    return {
      message: 'Si el correo existe recibirás un enlace en tu bandeja.',
    };
  }

  // POST /auth/reset-password
  // Body: { token, password }
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; password: string }) {
    await this.authService.resetPassword(body.token, body.password);
    return { message: 'Contraseña actualizada correctamente.' };
  }
}
