# DTO_CONTRACT.md — Product Shape Unification (No Behavior Change)

**Purpose:** Define minimal DTOs for UI and mapping layers so components consume stable shapes instead of raw API objects. No change to user-facing behavior.

---

## DTOs (Data Transfer Objects)

### ProductCardDTO

Used for: product cards, wishlist/compare cards, quickview header, search results.

```ts
interface ProductCardDTO {
  id: number | string;   // allow string for Vendure id
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
```

### ProductDetailsDTO

Card fields plus full description, variants, options, attributes. Used for: product detail page, quickview body.

```ts
interface ProductDetailsDTO extends ProductCardDTO {
  excerpt: string;
  description: string;
  variants?: Array<{ id: string; name: string; sku: string; price: number; stockLevel: string }>;
  options?: Array<{ name: string; slug: string; values: Array<{ name: string; slug: string }> }>;
  attributes?: Array<{ name: string; slug: string; values: Array<{ name: string; slug: string }> }>;
  categories?: Array<{ id: number; name: string; slug: string }>;
}
```

### TecDocDetailsDTO

TecDoc-specific data shown on product page. Kept separate; compose in view layer with ProductDetailsDTO.

```ts
interface TecDocDetailsDTO {
  productId: number;
  technicalSpecs: Array<{ name: string; value: string; unit?: string }>;
  compatibleVehicles: Array<{
    manufacturer: string;
    manufacturerCode: string;
    vehicles: Array<{ ktypno: string; model: string; years: string; engine: string }>;
  }>;
  oeReferences: Array<{ manufacturer: string; references: string[] }>;
}
```

---

## Mapping Layer

- **UI components** must consume DTOs (or IProduct where DTO is not yet applied), not raw GraphQL/Car/TecDoc types.
- **Avoid deep merges** that create one huge object; keep ProductDetailsDTO and TecDocDetailsDTO separate and compose in the view (e.g. product page renders ProductDetailsDTO + TecDocDetailsDTO side by side).

### Files

| File | Responsibility |
|------|----------------|
| `src/services/mappers/vendureToDto.ts` | Map Vendure Product / Variant → ProductCardDTO, ProductDetailsDTO. |
| `src/services/mappers/tecdocToDto.ts` | Map TecdocProductData → TecDocDetailsDTO. |
| `src/services/mappers/mergeProductDetails.ts` | Optional: combine ProductDetailsDTO + TecDocDetailsDTO for a single “product page view model” without deep merge of large trees. Prefer passing both to the view. |

### Integration

- **Minimal integration:** New code and refactors use mappers; existing components can keep using IProduct until migrated. When mapping from Vendure, use products.api response shape and map to DTO; when mapping from Car API vehicle products, map to ProductCardDTO. TecDoc hook returns TecdocProductData → map to TecDocDetailsDTO in the component or in the hook wrapper.

---

## Rules

1. UI consumes DTOs; avoid passing raw API objects to presentational components.
2. Keep TecDoc separate from Vendure in the data model; compose in the view.
3. Do not add fields to DTOs that are only used in one place; keep DTOs minimal.
4. Mappers must be pure (no side effects); same input → same output.
