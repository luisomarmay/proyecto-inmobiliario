// ============================================================
// auth.module.ts
// Módulo principal de autenticación.
// Aquí se ensamblan todos los piezas: estrategias, guards, servicio.
//
// Para agregar una nueva estrategia (ej. Apple, Facebook):
//   1. Crea strategies/apple.strategy.ts
//   2. Agrégala al array `providers`
// ============================================================

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    // Registra la entidad User para que TypeORM la gestione en este módulo
    TypeOrmModule.forFeature([User]),
    // Passport: framework base para estrategias de autenticación
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JwtModule: configurado de forma asíncrona para leer el .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    MailModule,
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    GoogleStrategy,
    RolesGuard,
  ],

  // Exportamos para que otros módulos puedan usar JwtAuthGuard
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
