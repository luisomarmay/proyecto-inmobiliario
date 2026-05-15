// ============================================================
// jwt.strategy.ts
// Passport strategy para validar el token JWT en cada request.
// Se ejecuta automáticamente cuando usas @UseGuards(JwtAuthGuard).
//
// Flujo: request → JwtAuthGuard → JwtStrategy.validate() → req.user
// ============================================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

// Estructura del payload que guardamos dentro del JWT
export interface JwtPayload {
  sub: string;      // user ID (estándar JWT: "subject")
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Extrae el token del header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Si el token expiró, rechaza la petición automáticamente
      ignoreExpiration: false,
      // Clave secreta para verificar la firma del token
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Este método se llama DESPUÉS de verificar la firma del token.
  // Lo que retornes aquí queda disponible como req.user en el controlador.
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }

    // req.user tendrá: { id, email, role }
    return { id: user.id, email: user.email, role: user.role };
  }
}
