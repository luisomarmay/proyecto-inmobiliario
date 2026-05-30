// rent.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RentService {
  private readonly baseUrl = 'https://api.stagingeb.com/v1/properties';

  //recibe informacion que solicita el cliente desde el frontend
  async getProperties(filters: any = {}) {
    try {
      /*Paginación*/
      const params: any = {
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      // Mapear filtros del front a los que espera EasyBroker
      if (filters.operation_type)
        params['search[operation_type]'] = filters.operation_type;
      if (filters.property_type)
        params['search[property_types][]'] = filters.property_type;
      if (filters.bedrooms) params['search[bedrooms]'] = filters.bedrooms;
      if (filters.min_bathrooms)
        params['search[min_bathrooms]'] = filters.min_bathrooms;
      if (filters.min_price) params['search[min_price]'] = filters.min_price;
      if (filters.max_price) params['search[max_price]'] = filters.max_price;

      const response = await axios.get(this.baseUrl, {
        headers: {
          'X-Authorization': process.env.EASYBROKER_KEY,
          accept: 'application/json',
        },
        params,
      });

      const { content, pagination } = response.data;

      const properties = content.map((property: any) => ({
        id: property.public_id,
        price: property.operations?.[0]?.amount,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        location: property.location,
        type: property.property_type,
        image: property.title_image_full,
        parking: property.parking_spaces || 0,
        title: property.title,
      }));

      const filteredProperties = filters.bedrooms
        ? properties.filter((p: any) => p.bedrooms === Number(filters.bedrooms))
        : properties;
      // Devolver también la paginación para el front
      return {
        properties:filteredProperties,
        pagination: {
          total: pagination?.total,
          page: pagination?.page,
          limit: pagination?.per_page,
          totalPages: Math.ceil(pagination?.total / pagination?.per_page),
        },
      };
    } catch (error: any) {
      throw new HttpException(
        error.response?.data?.message || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
