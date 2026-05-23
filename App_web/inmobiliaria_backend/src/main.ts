import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Permitir conexión con Next.js
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3003'],
  });

  //  Puerto del backend
  await app.listen(process.env.PORT ?? 3002);
}

bootstrap();
