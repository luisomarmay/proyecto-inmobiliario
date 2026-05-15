// ============================================================
// user.entity.ts
// Define la tabla "users" en PostgreSQL via TypeORM.
// Cada columna aquí = una columna en la base de datos.
// ============================================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Roles disponibles en el sistema.
// Agregar más roles aquí si el proyecto crece.
export enum UserRole {
  ADMIN = 'admin',
  CLIENTE = 'cliente_final',
}

@Entity('users') // nombre de la tabla en PostgreSQL
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  // nullable: true porque usuarios de Google no tienen contraseña local
  @Column({ nullable: true, select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENTE })
  role: UserRole;

  // Si el usuario se registró con Google, guardamos su ID de Google
  @Column({ nullable: true })
  googleId: string;

  // URL del avatar (viene de Google o se sube manualmente)
  @Column({ nullable: true })
  avatar: string;

  // Para invalidar refresh tokens (logout)
  @Column({ type: 'text', nullable: true, select: false })
  refreshToken?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'text', nullable: true, select: false })
  resetPasswordToken?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  resetPasswordExpires?: Date | null;
}
