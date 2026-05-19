import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // importante para no importarlo en cada módulo
    }),
    RentModule,
  ],
})
export class AppModule {}