// ============================================================
// roles.guard.ts
// Guard que verifica si el usuario tiene el rol requerido.
// SIEMPRE se usa JUNTO con JwtAuthGuard (primero valida el token,
// luego verifica el rol).
//
// Uso:
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(UserRole.ADMIN)
//   @Get('panel')
//   getAdminPanel() { ... }
// ============================================================

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lee los roles requeridos del decorador @Roles(...)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay @Roles(), la ruta es accesible para cualquier usuario autenticado
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtiene el usuario del request (lo puso JwtStrategy.validate())
    const { user } = context.switchToHttp().getRequest();

    const hasRole = requiredRoles.includes(user?.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere el rol: ${requiredRoles.join(' o ')}`,
      );
    }

    return true;
  }
}
