
import { faker } from '@faker-js/faker';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RentService {
  private readonly baseUrl = 'https://api.stagingeb.com/v1/properties'; 

  async getProperties() {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'X-Authorization': process.env.EASYBROKER_KEY, 
          'accept': 'application/json',
        },
      });

      console.log('RESPUESTA API:');
      console.log(JSON.stringify(response.data, null, 2));
      const properties = response.data.content;

      return properties.map((property: any) => ({
        id: property.public_id,                          
        price: property.operations?.[0]?.amount,  
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        location: property.location,     
        type: property.property_type,     
        address: property.location?.name,
        image: property.title_image_full,
        /* image: property.title_image_thumb, */
        title: property.title,
      }));

    } catch (error: any) {
      console.log('ERROR COMPLETO:', error.response?.data || error.message);
      console.log('ERROR STATUS:', error.response?.status);

      throw new HttpException(
        error.response?.data?.message || error.message || 'Error al conectar con API',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


 /*  async getProperties() {
    // IMÁGENES DE CASAS
    const images = [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
    ];

    // GENERAR 20 PROPIEDADES
    const properties = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      title: faker.helpers.arrayElement([
        'Luxury Villa',
        'Modern Apartment',
        'Family House',
        'Beachfront Condo',
        'Downtown Penthouse',
      ]),
      price: faker.number.int({
        min: 1000000,
        max: 9000000,
      }),
      bedrooms: faker.number.int({
        min: 1,
        max: 6,
      }),
      bathrooms: faker.number.int({
        min: 1,
        max: 5,
      }),
      city: faker.location.city(),
      address: faker.location.streetAddress(),
      image: images[Math.floor(Math.random() * images.length)],
    }));
    return properties;
  } */


