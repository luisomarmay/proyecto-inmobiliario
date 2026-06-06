import { Controller, Get, Query, Param } from '@nestjs/common';
import { RentService } from './rent.service';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Get()
  async getProperties(@Query() query: any) {
    return this.rentService.getProperties(query);
  }

  @Get(':id')
  async getPropertyById(@Param('id') id: string) {
    return this.rentService.getPropertyById(id);
  }
}