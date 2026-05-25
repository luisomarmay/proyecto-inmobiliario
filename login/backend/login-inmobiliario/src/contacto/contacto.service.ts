import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacto } from './contacto.entity';

@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Contacto)
    private contactoRepository: Repository<Contacto>,
  ) {}

  async crear(nombre: string, correo: string, mensaje: string) {
    const contacto = this.contactoRepository.create({ nombre, correo, mensaje });
    return this.contactoRepository.save(contacto);
  }
}