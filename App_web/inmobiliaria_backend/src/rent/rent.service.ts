import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import axios from 'axios';

@Injectable()
export class RentService {

  // ENDPOINT BASE
  private readonly baseUrl =
    'https://api.rentcast.io/v1/listings/sale';

  // OBTENER PROPIEDADES
  async getProperties() {

    try {

      // PETICIÓN A RENTCAST
      const response = await axios.get(

        this.baseUrl,

        {

          headers: {

            // API KEY
            'X-Api-Key':
              process.env.RENTCAST_KEY,

          },

          // FILTROS
          params: {

            city: 'Houston',

            state: 'TX',

            limit: 20,

          },

        },
      );

      // MOSTRAR RESPUESTA EN TERMINAL
      console.log('RESPUESTA API:');

      console.log(
        JSON.stringify(
          response.data,
          null,
          2,
        ),
      );

      // RENTCAST YA DEVUELVE ARRAY
      const properties = response.data;

      // LIMPIAR DATOS
      return properties.map(
        (property: any) => ({

          id:
            property.id ||
            property.propertyId,

          price:
            property.price || 0,

          bedrooms:
            property.bedrooms || 0,

          bathrooms:
            property.bathrooms || 0,

          city:
            property.city || 'No city',

          address:
            property.formattedAddress ||
            property.addressLine1 ||
            'No address',

          image:

            property.imgSrc ||

            property.photo ||

            property.photos?.[0] ||

            'https://via.placeholder.com/400',

        }),
      );

    } catch (error: any) {

      // ERROR EN TERMINAL
      console.log(
        'ERROR COMPLETO:',
        error.response?.data ||
        error.message,
      );

      console.log(
        'ERROR STATUS:',
        error.response?.status,
      );

      // ERROR PARA FRONTEND
      throw new HttpException(

        error.response?.data?.message ||

        error.message ||

        'Error al conectar con API',

        error.response?.status ||

        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}