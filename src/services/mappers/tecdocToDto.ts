/**
 * Map TecDoc API response to TecDocDetailsDTO.
 * See DTO_CONTRACT.md and interfaces/tecdoc.ts TecdocProductData.
 */

import type { TecDocDetailsDTO } from './types';
import type { TecdocProductData } from '~/interfaces/tecdoc';

/**
 * Map TecdocProductData to TecDocDetailsDTO (same shape; ensures single DTO type for UI).
 */
export function tecdocToDto(data: TecdocProductData): TecDocDetailsDTO {
  return {
    productId: data.productId,
    technicalSpecs: (data.technicalSpecs ?? []).map((s) => ({
      name: s.name,
      value: s.value,
      unit: s.unit,
    })),
    compatibleVehicles: (data.compatibleVehicles ?? []).map((g) => ({
      manufacturer: g.manufacturer,
      manufacturerCode: g.manufacturerCode,
      vehicles: (g.vehicles ?? []).map((v) => ({
        ktypno: v.ktypno,
        model: v.model,
        years: v.years,
        engine: v.engine,
      })),
    })),
    oeReferences: (data.oeReferences ?? []).map((r) => ({
      manufacturer: r.manufacturer,
      references: r.references ?? [],
    })),
  };
}
