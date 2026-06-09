import { Controller, Post, Body } from '@nestjs/common';
import { ContactoService } from './contacto.service';

@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

//   @Post()
//   async crear(@Body() body: { nombre: string; correo: string; mensaje: string }) {
//     return this.contactoService.crear(body.nombre, body.correo, body.mensaje);
//   }
// }

@Post('easybroker')
async crearEasyBroker(@Body() body: {
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  return this.contactoService.crearEasyBroker(body);
}
}