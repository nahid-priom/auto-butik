/**
 * Map Vendure GraphQL Product / Variant shapes to UI DTOs.
 * See DTO_CONTRACT.md and products.api.ts Product type.
 */

import type { ProductCardDTO, ProductDetailsDTO } from './types';

/** Vendure product shape from GraphQL (minimal for mapping) */
export interface VendureProductLike {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  customFields?: { tecDoc?: string } | null;
  featuredAsset?: { preview: string } | null;
  assets?: Array<{ preview?: string; source?: string }> | null;
  variants?: Array<{
    id: string;
    name: string;
    sku: string;
    priceWithTax: number;
    stockLevel: string;
    featuredAsset?: { preview: string } | null;
  }> | null;
}

function firstImage(p: VendureProductLike): string | null {
  if (p.assets?.length) {
    const src = p.assets[0].preview ?? p.assets[0].source;
    if (src) return src;
  }
  return p.featuredAsset?.preview ?? null;
}

function stockFromVendure(stockLevel: string): 'in-stock' | 'out-of-stock' | 'on-backorder' {
  switch (stockLevel) {
    case 'IN_STOCK':
    case 'LOW_STOCK':
      return 'in-stock';
    case 'ON_BACKORDER':
      return 'on-backorder';
    default:
      return 'out-of-stock';
  }
}

/**
 * Map Vendure product to ProductCardDTO (minimal fields for cards/lists).
 */
export function vendureProductToCardDto(p: VendureProductLike): ProductCardDTO {
  const v = p.variants?.[0];
  const price = v?.priceWithTax ?? 0;
  const image = firstImage(p);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price,
    compareAtPrice: null,
    image: image ?? null,
    images: image ? [image] : [],
    availability: v ? (v.stockLevel === 'IN_STOCK' || v.stockLevel === 'LOW_STOCK' ? 'in-stock' : 'out-of-stock') : undefined,
    stock: v ? stockFromVendure(v.stockLevel) : 'out-of-stock',
    brand: null,
    partNumber: v?.sku,
  };
}

/**
 * Map Vendure product to ProductDetailsDTO (full detail page).
 */
export function vendureProductToDetailsDto(p: VendureProductLike): ProductDetailsDTO {
  const card = vendureProductToCardDto(p);
  const v = p.variants?.[0];
  const description = p.description ?? '';
  const excerpt = description.length > 150 ? description.slice(0, 150) + '...' : description;
  return {
    ...card,
    excerpt,
    description,
    variants: (p.variants ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.priceWithTax,
      stockLevel: v.stockLevel,
    })),
    options: [],
    attributes: [],
    categories: [],
  };
}
