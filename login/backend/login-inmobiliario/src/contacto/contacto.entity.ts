import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('contactos')
export class Contacto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  correo!: string;

  @Column('text')
  mensaje!: string;

  @CreateDateColumn()
  fecha!: Date;
}