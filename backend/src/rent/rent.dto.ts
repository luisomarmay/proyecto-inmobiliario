// rent.dto.ts
export class GetPropertiesDto {
  page?: number;
  limit?: number;
  search?: {
    operation_type?: string;    // 'sale' | 'rent'
    property_types?: string[];  // ['house', 'apartment', ...]
    min_price?: number;
    max_price?: number;
    min_bedrooms?: number;
    min_bathrooms?: number;
    min_parking_spaces?: number;
  };
}