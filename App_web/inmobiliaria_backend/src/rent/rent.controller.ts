import { Controller, Get, Query } from '@nestjs/common';
import { RentService } from './rent.service';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Get()
  async getProperties(@Query() query: any) {
    // ← agregar @Query()
    return this.rentService.getProperties(query);
  }
}
