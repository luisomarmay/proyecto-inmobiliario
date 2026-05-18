import { Controller, Get } from '@nestjs/common';
import { RentService } from './rent.service';

@Controller('rent')
export class RentController {

  constructor(
    private readonly rentService: RentService,
  ) {}

  @Get()
  async getProperties() {

    return this.rentService.getProperties();

  }
}