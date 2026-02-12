/**
 * DTO types for UI consumption. See DTO_CONTRACT.md.
 */

export interface ProductCardDTO {
  id: number | string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  images?: string[];
  availability?: string;
  stock?: 'in-stock' | 'out-of-stock' | 'on-backorder';
  brand?: { name: string; slug?: string } | null;
  partNumber?: string;
  rating?: number;
  reviewsCount?: number;
}

export interface ProductDetailsDTO extends ProductCardDTO {
  excerpt: string;
  description: string;
  variants?: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    stockLevel: string;
  }>;
  options?: Array<{
    name: string;
    slug: string;
    values: Array<{ name: string; slug: string }>;
  }>;
  attributes?: Array<{
    name: string;
    slug: string;
    values: Array<{ name: string; slug: string }>;
  }>;
  categories?: Array<{ id: number; name: string; slug: string }>;
}

export interface TecDocDetailsDTO {
  productId: number;
  technicalSpecs: Array<{ name: string; value: string; unit?: string }>;
  compatibleVehicles: Array<{
    manufacturer: string;
    manufacturerCode: string;
    vehicles: Array<{ ktypno: string; model: string; years: string; engine: string }>;
  }>;
  oeReferences: Array<{ manufacturer: string; references: string[] }>;
}
