// ============================================================
// users.service.ts
// Maneja todas las operaciones relacionadas con usuarios:
// buscar, crear, actualizar. No contiene lógica de auth.
// ============================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    // Inyectamos el repositorio de TypeORM para interactuar con la BD
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // Busca usuario por email. Usado en login y en GoogleStrategy.
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  // Busca usuario por ID. Usado en JwtStrategy para validar tokens.
  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  // Busca usuario por su Google ID. Usado en GoogleStrategy.
  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { googleId } });
  }

  // Crea un nuevo usuario (registro local con email/password).
  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  // Actualiza datos del usuario (refresh token, avatar, etc.)
  async update(id: string, data: Partial<User>): Promise<void> {
    await this.usersRepo.update(id, data);
  }

  // Obtiene usuario con contraseña (para login local).
  // Por defecto TypeORM excluye columnas con select: false.
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password') // incluir columna excluida
      .where('user.email = :email', { email })
      .getOne();
  }
  // Busca usuario por token de recuperación (incluye columna select:false)
  async findByResetToken(token: string): Promise<User | null> {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.resetPasswordToken')
      .addSelect('user.resetPasswordExpires')
      .where('user.resetPasswordToken = :token', { token })
      .getOne();
  }
}
