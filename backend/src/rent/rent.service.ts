// rent.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

const serviceMap: Record<string, string> = {
  sale: 'Venta',
  rental: 'Renta',
  vacation_rental: 'Renta vacacional',
};

@Injectable()
export class RentService {
  private readonly baseUrl = 'https://api.stagingeb.com/v1/properties';

  async getPropertyById(id: string) {
    try {
      const detail = await axios.get(
        `https://api.stagingeb.com/v1/properties/${id}`,
        {
          headers: {
            'X-Authorization': process.env.EASYBROKER_KEY,
            accept: 'application/json',
          },
        },
      );
      
      const data = detail.data;
      let lat = parseFloat(data.location?.latitude);
      let lng = parseFloat(data.location?.longitude);
      console.log('agent data:', JSON.stringify(data.agent, null, 2));
      console.log('full data keys:', Object.keys(data));
      
      if (isNaN(lat) || isNaN(lng)) {
        if (data.location?.name) {
          try {
            const geoRes = await axios.get(
              'https://nominatim.openstreetmap.org/search',
              {
                params: { q: data.location.name, format: 'json', limit: 1 },
                headers: { 'User-Agent': 'inmobiliaria-app/1.0' },
              },
            );
            const result = geoRes.data?.[0];
            if (result) {
              lat = parseFloat(result.lat);
              lng = parseFloat(result.lon);
            }
          } catch {}
        }
      }

      return {
        id: data.public_id,
        title: data.title,
        price: data.operations?.[0]?.amount,
        service:
          serviceMap[data.operations?.[0]?.type] ?? data.operations?.[0]?.type,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        parking: data.parking_spaces || 0,
        location: data.location?.name,
        description: data.description,
        images: data.property_images?.map((img: any) => img.url) || [
          data.title_image_full,
        ],
        type: data.property_type,
        lot_size: data.lot_size,
        construction_size: data.construction_size,
        lat: isNaN(lat) ? null : lat,
        lng: isNaN(lng) ? null : lng,
        agent: {
          name: data.agent?.full_name,
          phone: data.agent?.mobile_phone,
          email: data.agent?.email,
          image: data.agent?.profile_image_url,
        },
      };
    } catch (error: any) {
      throw new HttpException(
        error.response?.data?.message || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProperties(filters: any = {}) {
    try {
      const params: any = {
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

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
      console.log('pagination raw:', JSON.stringify(pagination, null, 2));

      const properties = await Promise.all(
        content.map(async (property: any) => {
          let lat = 19.4326;
          let lng = -99.1332;

          const detail = await axios.get(
            `https://api.stagingeb.com/v1/properties/${property.public_id}`,
            {
              headers: {
                'X-Authorization': process.env.EASYBROKER_KEY,
                accept: 'application/json',
              },
            },
          );

          const detailLat = parseFloat(detail.data.location?.latitude);
          const detailLng = parseFloat(detail.data.location?.longitude);

          if (!isNaN(detailLat) && !isNaN(detailLng)) {
            lat = detailLat;
            lng = detailLng;
          } else if (detail.data.location?.name) {
            console.log(
              `[${property.public_id}] Sin coords, geocodificando: ${detail.data.location.name}`,
            );
            try {
              const geoRes = await axios.get(
                'https://nominatim.openstreetmap.org/search',
                {
                  params: {
                    q: detail.data.location.name,
                    format: 'json',
                    limit: 1,
                  },
                  headers: {
                    'User-Agent': 'inmobiliaria-app/1.0',
                  },
                },
              );

              const result = geoRes.data?.[0];
              if (result) {
                lat = parseFloat(result.lat);
                lng = parseFloat(result.lon);
                console.log(
                  `[${property.public_id}] Geocodificado: ${lat}, ${lng}`,
                );
              } else {
                console.log(
                  `[${property.public_id}] Geocoding sin resultados, usando default`,
                );
              }
            } catch (geoError) {
              console.log(
                `[${property.public_id}] Error en geocoding, usando default`,
              );
            }
          } else {
            console.log(
              `[${property.public_id}] Sin coords y sin location.name, usando default`,
            );
          }

          return {
            id: property.public_id,
            price: property.operations?.[0]?.amount,
            service:
              serviceMap[property.operations?.[0]?.type] ??
              property.operations?.[0]?.type,
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            location:
              detail.data.location?.name || property.location?.name || null,
            lat,
            lng,
            type: property.property_type,
            parking: property.parking_spaces || 0,
            title: property.title,
            construction_size: detail.data.construction_size,
            lot_size: detail.data.lot_size,
            image: property.title_image_full,
            images: detail.data.property_images?.map((img: any) => img.url) || [
              property.title_image_full,
            ],
          };
        }),
      );

      const filteredProperties = filters.bedrooms
        ? properties.filter((p: any) => p.bedrooms === Number(filters.bedrooms))
        : properties;

      return {
        properties: filteredProperties,
        pagination: {
          total: pagination?.total,
          page: pagination?.page,
          limit: pagination?.per_page,
          totalPages: Math.ceil(pagination?.total / pagination?.limit),
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
