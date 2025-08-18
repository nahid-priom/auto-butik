# Storefront Guide: Product Listing & Product Detail (Vendure Shop API)

This backend runs Vendure v3.4.0. Use the Shop GraphQL API to render products and variants on the storefront.

- Shop API: POST http://<host>:3000/shop-api
- GraphiQL (Shop): http://<host>:3000/graphiql/shop

## Backend specifics
- Products/variants are created/updated by `src/scripts/sync-pricing-inventory.ts`.
- `product.customFields.tecDoc` is set from the CSV TEC_DOC value.
- Each variant corresponds to a SKU.
- Prices are set per variant. Tax category is enforced to "Zero Tax" → `priceWithTax === price`.
- Inventory is maintained per stock location; the Shop API exposes an aggregate stock status per variant.

## Schema summary (what you need to render)

- Product
  - `id`
  - `name`
  - `slug`
  - `description`
  - `customFields { tecDoc }`
  - `featuredAsset { preview }`
  - `assets { id preview source width height }`
  - `variants: ProductVariant[]`

- ProductVariant
  - `id`
  - `name`
  - `sku`
  - `priceWithTax` (number)
  - `currencyCode`
  - `stockLevel` (availability status)
  - `featuredAsset { preview }`

- Asset
  - `preview` (thumb URL)
  - `source` (original URL)
  - `width` `height` `type`

Notes:
- Use `priceWithTax` for display (since tax is zero it equals `price`).
- Use `stockLevel` (e.g., IN_STOCK, OUT_OF_STOCK) or `inStock` (from search) to drive badges.

## Product listing (paginated)

Use the `products` query for simple, paginated product lists (by product):

```graphql
query Products($options: ProductListOptions) {
  products(options: $options) {
    totalItems
    items {
      id
      name
      slug
      description
      customFields { tecDoc }
      featuredAsset { preview }
      assets { id preview }
      variants {
        id
        name
        sku
        priceWithTax
        currencyCode
        stockLevel
        featuredAsset { preview }
      }
    }
  }
}
```

Variables example:
```json
{
  "options": {
    "skip": 0,
    "take": 24,
    "sort": { "name": "ASC" }
  }
}
```

When you need search relevance, pricing summary, and image previews efficiently for large catalogs, use `search` instead:

```graphql
query ProductSearch($input: SearchInput!) {
  search(input: $input) {
    totalItems
    items {
      productId
      productName
      slug
      productAsset { preview }
      productVariantId
      productVariantName
      sku
      priceWithTax { value currencyCode }
      price { value currencyCode }
      currencyCode
      inStock
      enabled
      productVariantAsset { preview }
    }
  }
}
```

Search variables example:
```json
{
  "input": {
    "term": "",                
    "groupByProduct": true,     
    "skip": 0,
    "take": 24,
    "sort": { "name": "ASC" } 
  }
}
```

Common `search` filters:
- `term`: free-text
- `collectionId`: filter by a collection
- `facetValueIds`: filter by selected facets
- `sort`: `{ price: ASC|DESC }`, `{ name: ASC|DESC }`, `{ createdAt: ASC|DESC }`

## Product detail page (PDP)

Fetch by slug and render product, gallery, variants, and pricing:

```graphql
query ProductDetail($slug: String!) {
  product(slug: $slug) {
    id
    name
    slug
    description
    customFields { tecDoc }
    featuredAsset { preview }
    assets { id preview source width height }
    variants {
      id
      name
      sku
      priceWithTax
      currencyCode
      stockLevel
      featuredAsset { preview }
    }
  }
}
```

Variables:
```json
{ "slug": "the-product-slug" }
```

## Rendering guidelines

- **Image selection**
  - Listing: `productVariantAsset.preview || productAsset.preview`
  - PDP gallery: use `assets` for carousel; fallback to `featuredAsset`.

- **Price**
  - Use `priceWithTax` and format with `currencyCode`.

- **Stock**
  - Listing: `inStock` from `search` or variant `stockLevel`.
  - PDP: show `stockLevel` per variant; disable Add-to-cart if `OUT_OF_STOCK`.

- **SKU & TEC_DOC**
  - Show `variant.sku` and optionally `product.customFields.tecDoc` for technical reference.

- **Pagination**
  - `skip = (page - 1) * take`.
  - `take` is page size (e.g., 24).

## Example fetch helper (Next.js)

```ts
export async function shopQuery<T>(query: string, variables?: Record<string, any>) {
  const res = await fetch(process.env.NEXT_PUBLIC_SHOP_API!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  return json.data as T;
}
```

## Quick checklist

- **Listing page**: Use `products` for simple pages or `search` for better relevance & filters.
- **PDP**: Use `product(slug)`; render images, variants, price, stock, SKU, TEC_DOC.
- **Consistency**: Use `priceWithTax`; it equals price due to zero tax.
- **Performance**: Paginate; avoid over-fetching assets/variants if not needed; cache responses on the client.
