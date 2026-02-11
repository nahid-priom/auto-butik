# CACHING_STRATEGY.md — Next.js + Client Cache (Pages Router)

**Scope:** Pages Router only. No App Router.

---

## A. Client-Side Query Caching (TanStack Query)

### Adoption

- Use **TanStack Query (React Query)** for:
  - Car API: lookup, dropdowns, category tree, vehicle categories, vehicle-scoped product lists, search.
  - TecDoc: product details by productId.

### Query Keys (stable; vehicle signature where applicable)

| Domain | Query Key Pattern | Stale Time | Cache Time | Notes |
|--------|-------------------|------------|------------|--------|
| Car lookup | `carLookup:{regNr}` | 24h | 24h | Normalize reg (trim, uppercase). |
| Dropdowns | `carDropdown:brands` | 1h | 24h | |
| | `carDropdown:years:{brand}` | 1h | 24h | |
| | `carDropdown:models:{brand}:{year}` | 1h | 24h | |
| | `carDropdown:engines:{brand}:{year}:{model}` | 1h | 24h | |
| | `carDropdown:wheel:{modelId}` | 1h | 24h | |
| Category tree | `categoryTree:{locale}:{modelId\|''}` | 5m | 30m | modelId from current vehicle or '' for global. |
| Vehicle categories | `vehicleCategories:{modelId}:{parentId\|''}` | 5m | 30m | |
| Vehicle products | `carProducts:{vehicleKey}:{categoryId}:{page}:{sort}:{filtersHash}` | 2m | 10m | Invalidate when vehicle changes. |
| Car search | `carSearch:{vehicleKey}:{term}:{page}` | 2m | 10m | |
| TecDoc product | `tecdocProduct:{productId}` | 10m | 1h | |

### Defaults (suggested)

- `staleTime`: 2–5 minutes for list/category data; 10m for TecDoc detail; 1h for dropdowns.
- `gcTime` (cacheTime): 10–30 minutes for lists; 1h for detail and dropdowns.
- Vehicle-scoped keys: always include `vehicleKey` or `modelId` so invalidation on vehicle change is a single `queryClient.removeQueries({ predicate })` or `invalidateQueries`.

---

## B. Apollo Caching (Vendure)

### Current

- `InMemoryCache()` with no typePolicies.
- `fetchPolicy: 'no-cache'` → no read-from-cache; every request hits network.

### Target

- **Normalized cache** for Product and ProductVariant (use `id` and type names).
- **Paginated/search** queries: set `keyArgs` so that different variables (e.g. options, term) get different cache entries.
- **fetchPolicy:** Use `cache-first` or `cache-and-network` for product detail and list so Apollo can serve cached data when appropriate.
- **Do not** duplicate Vendure product list or detail in Redux (remove from shop.productsList and quickview product object; keep slug/id only if needed).

### Example (conceptual)

- Product detail: `keyArgs: ['slug']` so `Product(slug)` is cached by slug.
- Product list: `keyArgs: ['options', 'filters']` or equivalent so pagination/filters don’t overwrite each other.

---

## C. Next.js Caching (Pages Router)

### Options

1. **HTTP cache headers** — Set on responses that Next.js or a proxy can cache.
2. **next.config.js `headers()`** — For same-origin API routes or rewrites.
3. **Backend/proxy** — Set `Cache-Control` on Car/TecDoc/Vendure responses.
4. **Lightweight proxy endpoint** — Only if needed: Next.js API route that calls backend and sets headers (avoid duplicating logic).

### Recommended headers by endpoint type

| Endpoint / Page | Cache-Control | Rationale |
|-----------------|---------------|-----------|
| Category tree (Car API) | `s-maxage=300, stale-while-revalidate=600` | 5m fresh, 10m revalidate. |
| Dropdowns (brands, years, models, engines) | `s-maxage=3600, stale-while-revalidate=86400` | 1h fresh, 24h revalidate. |
| Static-ish homepage blocks (fake API) | `s-maxage=60, stale-while-revalidate=300` | 1m fresh, 5m revalidate. |
| Product detail (Vendure) | Backend or CDN; e.g. `s-maxage=60, stale-while-revalidate=300` | Short TTL for correctness. |
| TecDoc product | `s-maxage=600, stale-while-revalidate=3600` | 10m fresh, 1h revalidate. |
| Vehicle-scoped product list | Prefer client cache (TanStack); if server cache, short: `s-maxage=120, stale-while-revalidate=300` | 2m fresh. |

### Where to apply (Pages Router)

- **Backend** (preferred): Configure Vendure and Car/TecDoc services to send these headers.
- **next.config.js:** If you have API routes that proxy to backend, set `headers()` in that route or in config for a path pattern (e.g. `/api/car/*`).
- **No getStaticProps for product/category lists** that are user/vehicle-specific; use client fetch + TanStack Query.

### Browser vs CDN vs server

- **Browser:** TanStack Query and Apollo control client cache; HTTP cache headers can further reduce refetches for same URL.
- **CDN:** If traffic goes through a CDN, `s-maxage` and `stale-while-revalidate` apply there; ensure private/user-specific data is not cached at CDN or use short s-maxage.
- **Server:** getServerSideProps runs per request; no long-lived server cache unless you add a custom cache (e.g. for category tree in API route). Prefer client-side caching for dynamic data.

---

## D. Stale Time + Cache Time Summary

| Domain | Stale (client) | Cache (client) | HTTP (if applied) |
|--------|----------------|----------------|-------------------|
| Category tree | 5m | 30m | s-maxage=300, stale-while-revalidate=600 |
| Vehicle categories | 5m | 30m | Same as above |
| Dropdowns | 1h | 24h | s-maxage=3600, stale-while-revalidate=86400 |
| Car lookup | 24h | 24h | — |
| Vehicle products | 2m | 10m | s-maxage=120, stale-while-revalidate=300 |
| TecDoc product | 10m | 1h | s-maxage=600, stale-while-revalidate=3600 |
| Homepage blocks (fake) | 1m | 5m | s-maxage=60, stale-while-revalidate=300 |

This document should be updated when new endpoints or pages are added.
