// ============================================================
// roles.decorator.ts
// Decorador personalizado para marcar qué roles puede acceder a una ruta.
// Uso: @Roles(UserRole.ADMIN) encima de un método del controlador.
// ============================================================

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user.entity';

// Clave única que usa RolesGuard para leer los metadatos
export const ROLES_KEY = 'roles';

// Decorator factory: @Roles(UserRole.ADMIN, UserRole.CLIENTE)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
