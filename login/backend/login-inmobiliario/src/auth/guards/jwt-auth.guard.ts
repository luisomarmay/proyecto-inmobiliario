// ============================================================
// jwt-auth.guard.ts
// Guard que protege rutas: solo pasa si el JWT es válido.
// Uso: @UseGuards(JwtAuthGuard) en un controlador o método.
// ============================================================

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
