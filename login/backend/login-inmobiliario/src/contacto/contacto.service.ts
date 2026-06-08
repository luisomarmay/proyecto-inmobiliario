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

  // async crear(nombre: string, correo: string, mensaje: string) {
  //   const contacto = this.contactoRepository.create({ nombre, correo, mensaje });
  //   return this.contactoRepository.save(contacto);
  // }
  async crearEasyBroker(data: any) {
  const res = await fetch('https://api.easybroker.com/v1/contact_requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
        'X-Authorization': process.env.EASYBROKER_API_KEY ?? '', // ← fix aquí
    },
    body: JSON.stringify({
      property_id: data.property_id,
      source: 'tu-dominio.com',
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    }),
  });
  return res.json();
}
}