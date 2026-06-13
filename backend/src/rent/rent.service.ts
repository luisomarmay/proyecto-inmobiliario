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
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  private setCached(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCached(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  // Delay entre peticiones para no saturar EasyBroker
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método privado para obtener detalle de una propiedad con caché individual
  private async getPropertyDetail(publicId: string): Promise<any> {
    const cacheKey = `property_detail_${publicId}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const detail = await axios.get(
      `https://api.stagingeb.com/v1/properties/${publicId}`,
      {
        headers: {
          'X-Authorization': process.env.EASYBROKER_KEY,
          accept: 'application/json',
        },
      },
    );

    this.setCached(cacheKey, detail.data);
    return detail.data;
  }

  // Método privado para geocodificar una ubicación
  private async geocode(locationName: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const geoRes = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: { q: locationName, format: 'json', limit: 1 },
          headers: { 'User-Agent': 'inmobiliaria-app/1.0' },
        },
      );
      const result = geoRes.data?.[0];
      if (result) {
        return { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
      }
    } catch {}
    return null;
  }

  // Procesa una propiedad individual (extraído para limpiar getProperties)
  private async processProperty(property: any) {
    let lat = 19.4326;
    let lng = -99.1332;

    const detailData = await this.getPropertyDetail(property.public_id);

    const detailLat = parseFloat(detailData.location?.latitude);
    const detailLng = parseFloat(detailData.location?.longitude);

    if (!isNaN(detailLat) && !isNaN(detailLng)) {
      lat = detailLat;
      lng = detailLng;
    } else if (detailData.location?.name) {
      console.log(`[${property.public_id}] Sin coords, geocodificando: ${detailData.location.name}`);
      const coords = await this.geocode(detailData.location.name);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
        console.log(`[${property.public_id}] Geocodificado: ${lat}, ${lng}`);
      } else {
        console.log(`[${property.public_id}] Geocoding sin resultados, usando default`);
      }
    } else {
      console.log(`[${property.public_id}] Sin coords y sin location.name, usando default`);
    }

    return {
      id: property.public_id,
      price: property.operations?.[0]?.amount,
      service: serviceMap[property.operations?.[0]?.type] ?? property.operations?.[0]?.type,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      location: detailData.location?.name || property.location?.name || null,
      lat,
      lng,
      type: property.property_type,
      parking: property.parking_spaces || 0,
      title: property.title,
      construction_size: detailData.construction_size,
      lot_size: detailData.lot_size,
      image: property.title_image_full,
      images: detailData.property_images?.map((img: any) => img.url) || [property.title_image_full],
    };
  }

  async getPropertyById(id: string) {
    const cacheKey = `property_by_id_${id}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.getPropertyDetail(id);

      let lat = parseFloat(data.location?.latitude);
      let lng = parseFloat(data.location?.longitude);
      console.log('agent data:', JSON.stringify(data.agent, null, 2));
      console.log('full data keys:', Object.keys(data));

      if (isNaN(lat) || isNaN(lng)) {
        if (data.location?.name) {
          const coords = await this.geocode(data.location.name);
          if (coords) {
            lat = coords.lat;
            lng = coords.lng;
          }
        }
      }

      const result = {
        id: data.public_id,
        title: data.title,
        price: data.operations?.[0]?.amount,
        service: serviceMap[data.operations?.[0]?.type] ?? data.operations?.[0]?.type,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        parking: data.parking_spaces || 0,
        location: data.location?.name,
        description: data.description,
        images: data.property_images?.map((img: any) => img.url) || [data.title_image_full],
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

      this.setCached(cacheKey, result);
      return result;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data?.message || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProperties(filters: any = {}) {
    const cacheKey = `properties_${JSON.stringify(filters)}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

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

      // ← Secuencial con delay en vez de Promise.all simultáneo
      const properties: any[] = [];
      for (const property of content) {
        const result = await this.processProperty(property);
        properties.push(result);
        await this.delay(150); // 150ms entre cada petición a EasyBroker
      }

      const filteredProperties = filters.bedrooms
        ? properties.filter((p: any) => p.bedrooms === Number(filters.bedrooms))
        : properties;

      const result = {
        properties: filteredProperties,
        pagination: {
          total: pagination?.total,
          page: pagination?.page,
          limit: pagination?.per_page,
          totalPages: Math.ceil(pagination?.total / pagination?.limit),
        },
      };

      this.setCached(cacheKey, result);
      return result;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data?.message || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}