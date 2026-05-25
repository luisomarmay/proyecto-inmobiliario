import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ContactoModule } from './contacto/contacto.module';
import { Contacto } from './contacto/contacto.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get('DATABASE_URL');

        // Si hay DATABASE_URL (Railway) la usa, si no usa las variables individuales (local)
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Contacto],
            synchronize: true,
            ssl: { rejectUnauthorized: false }, // requerido en Railway
          };
        }

        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASS'),
          database: config.get('DB_NAME'),
          entities: [User, Contacto],
          synchronize: true,
        };
      },
    }),

    AuthModule,

    ContactoModule,
  ],
})
export class AppModule {}
