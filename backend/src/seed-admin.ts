// ============================================================
// seed-admin.ts → va en src/seed-admin.ts del backend
// Uso: npx ts-node -r tsconfig-paths/register src/seed-admin.ts
// ============================================================

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './users/user.entity';

// Carga el .env manualmente, sin ConfigService
config();

// ── Cambia estos datos antes de correr ──────────────────────
const ADMIN_NAME     = 'Administrador Principal';
const ADMIN_EMAIL    = 'admin@gmail.com';   // ← tu correo
const ADMIN_PASSWORD = 'Admin123.';             // ← tu contraseña
// ────────────────────────────────────────────────────────────

async function seedAdmin() {
  // Leer credenciales directo de process.env (ya cargado por dotenv)
  const dataSource = new DataSource({
    type: 'postgres',
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER     || 'postgres',
    password: String(process.env.DB_PASS || ''),
    database: process.env.DB_NAME     || 'inmobiliaria',
    entities: [User],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conectado a la base de datos');

    const userRepo = dataSource.getRepository(User);

    // Verificar si ya existe
    const existing = await userRepo.findOne({ where: { email: ADMIN_EMAIL } });

    if (existing) {
      console.log(`⚠️  Ya existe un usuario con el email: ${ADMIN_EMAIL}`);
      if (existing.role !== UserRole.ADMIN) {
        existing.role = UserRole.ADMIN;
        await userRepo.save(existing);
        console.log('✅ Rol actualizado a ADMIN');
      } else {
        console.log('   Ya es ADMIN, no se realizaron cambios.');
      }
      await dataSource.destroy();
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = userRepo.create({
      name:     ADMIN_NAME,
      email:    ADMIN_EMAIL,
      password: hashedPassword,
      role:     UserRole.ADMIN,
    });

    await userRepo.save(admin);

    console.log('✅ Usuario admin creado exitosamente:');
    console.log(`   Nombre: ${ADMIN_NAME}`);
    console.log(`   Email:  ${ADMIN_EMAIL}`);
    console.log(`   Rol:    ${UserRole.ADMIN}`);
    console.log('⚠️  Recuerda cambiar la contraseña después del primer login.');

  } catch (error) {
    console.error('❌ Error al crear el admin:', error);
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
}

seedAdmin();
