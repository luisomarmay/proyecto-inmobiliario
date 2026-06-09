import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoController } from './contacto.controller';
import { ContactoService } from './contacto.service';
import { Contacto } from './contacto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto])],
  controllers: [ContactoController],
  providers: [ContactoService],
})
export class ContactoModule {}