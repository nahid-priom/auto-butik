/**
 * Compose ProductDetailsDTO and TecDocDetailsDTO for the product page view.
 * Does NOT deep-merge; view receives both and composes (per DTO_CONTRACT.md).
 */

import type { ProductDetailsDTO } from './types';
import type { TecDocDetailsDTO } from './types';

export interface ProductPageViewModel {
  product: ProductDetailsDTO;
  tecdoc: TecDocDetailsDTO | null;
}

/**
 * Build view model for product detail page: Vendure product + optional TecDoc.
 * Prefer passing product and tecdoc separately to the view; this is a convenience.
 */
export function mergeProductDetails(
  product: ProductDetailsDTO,
  tecdoc: TecDocDetailsDTO | null
): ProductPageViewModel {
  return {
    product,
    tecdoc,
  };
}
