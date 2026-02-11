# MIGRATION_AND_VALIDATION.md — Incremental Plan, Duplication Removal, Caching, Legacy Checklist

This document ties together the SSOT table, step-by-step migration, duplication removal, Next.js caching, and validation. See STATE_DATA_CACHE_MAP.md, SSOT_CONTRACT.md, CACHING_STRATEGY.md, REDUX_CLEANUP_PLAN.md, VEHICLE_INVALIDATION.md, PERF_CHECKLIST.md for detail.

---

## 1. Single Source of Truth Table

| Domain | Owner | Persisted? | Cache policy | Invalidation triggers |
|--------|--------|------------|--------------|------------------------|
| Cart | Redux | Yes (whitelist) | N/A | User actions |
| Wishlist | Redux | Yes (whitelist) | N/A | User actions |
| Compare | Redux | Yes (whitelist) | N/A | User actions |
| Currency | Redux | Yes (whitelist) | N/A | User change |
| Auth | Redux (snapshot) + Apollo | Token + user in whitelist | Apollo default | Login / logout |
| Garage (saved vehicles) | GarageContext or Redux (single owner) | Yes (existing keys or whitelist) | N/A | Add/remove/set current |
| Current active car | CarContext | Yes (currentActiveCar, 24h) | N/A | Lookup or garage select |
| Category tree | TanStack Query | No | categoryTree:{locale}:{modelId}, stale 5m | Vehicle/locale change |
| Vehicle categories | TanStack Query | No | vehicleCategories:{modelId}:*, stale 5m | Vehicle change |
| Legacy shop list | TanStack Query or Redux (no persist) | No | Optional query keys | Route change |
| Product detail (Vendure) | Apollo | No | Normalized cache | Mutation/evict |
| TecDoc product | TanStack Query | No | tecdocProduct:{productId}, stale 10m | productId |
| Car lookup | TanStack Query | No | carLookup:{regNr}, stale 24h | Clear/re-lookup |
| Dropdowns | TanStack Query | No | carDropdown:*, stale 1h | Rarely |
| Vehicle product list | TanStack Query | No | carProducts:{vehicleKey}:..., stale 2m | **Vehicle change** |
| UI (options, mobile menu, quickview) | Redux | options + mobile-menu yes; quickview no/slug only | N/A | — |
| Car search history | localStorage (service) | Yes | N/A | Trim on add |

---

## 2. Step-by-Step Migration Plan (Incremental)

Each step must keep the app working. Validation: run `npm run build` and smoke tests after each step.

### Step 1: Persist whitelist (no data move)

- **Goal:** Stop persisting shop, full quickview product; persist only whitelisted slices.
- **Files:** `src/store/store.ts` (save/load to use whitelist), optionally `src/store/root/rootReducer.ts` (no change).
- **Actions:** In `save()`, serialize only `version`, `cart`, `wishlist`, `compare`, `currency`, `options`, `mobile-menu`, `garage`, `user`. In `load()`, merge only those keys into state (ignore `shop`, full `quickview` from old payloads).
- **Validation:** `npm run build`, `npm run dev`, add to cart → refresh → cart still there; compare/wishlist still there; shop category page may refetch (expected).

### Step 2: Add TanStack Query and Car API hooks (parallel to existing)

- **Goal:** Introduce QueryClientProvider and hooks that wrap Car API (lookup, dropdowns, category tree, vehicle products) with useQuery. Do not remove existing Context/fetch logic yet.
- **Files:** New: `src/lib/queryClient.ts`, hooks under `src/hooks/useCarQueries.ts` (or similar). `_app.tsx`: wrap with QueryClientProvider.
- **Actions:** Implement query keys per CACHING_STRATEGY.md; use same keys in hooks. Contexts can keep calling carApi until Step 4.
- **Validation:** `npm run build`, `npm run dev`; vehicle flow still works (existing path).

### Step 3: TecDoc via TanStack Query

- **Goal:** Replace useTecdocProduct (useState/useEffect) with useQuery(tecdocProduct:{productId}). Keep same API (data, isLoading, isError, error).
- **Files:** `src/hooks/useTecdocProduct.ts` (refactor to useQuery or new hook that uses useQuery), components that use it.
- **Validation:** Product page with TecDoc block still shows specs/vehicles/OE refs; loading/error states unchanged.

### Step 4: Category tree and vehicle categories from Query cache

- **Goal:** CategoryTreeContext and VehicleCatalogContext read from TanStack Query (useQuery) instead of local state + carApi. Invalidate on vehicle change per VEHICLE_INVALIDATION.md.
- **Files:** `src/contexts/CategoryTreeContext.tsx`, `src/contexts/VehicleCatalogContext.tsx`, one central place to call queryClient.invalidateQueries when currentActiveCar or garage current changes.
- **Validation:** Select vehicle → see tree; change vehicle → tree/categories update; catalog index and [slug]/products still work.

### Step 5: Quickview stores slug only; resolve product from Apollo

- **Goal:** Redux quickview holds productSlug (or id) only; Quickview component fetches product via Apollo (or selector from Apollo cache) when open.
- **Files:** `src/store/quickview/quickviewReducer.ts`, `src/store/quickview/quickviewActions.ts`, `src/store/quickview/quickviewTypes.ts`, `src/components/shared/Quickview.tsx`, quickviewHooks.
- **Actions:** Change state to { isOpen, productSlug }; open(slug); component uses slug in useQuery(GET_PRODUCT_DETAIL, { slug }) or Apollo cache read.
- **Validation:** Open quickview from product card → same product shown; no full product in localStorage.

### Step 6: Legacy shop route (optional) — move list to Query or stop persisting

- **Goal:** Either migrate `/catalog/[slug]/products` (when using FakeShopApi) to TanStack Query and remove productsList from Redux, or keep Redux but never persist shop slice (already done in Step 1).
- **Files:** `src/store/shop/shopReducer.ts`, `src/store/shop/shopActions.ts`, `src/pages/catalog/[slug]/products.tsx`, getShopPageData / shopHelpers.
- **Validation:** Legacy catalog slug products page still loads and paginates; no shop in persisted state.

### Step 7: Apollo cache policy and fetchPolicy

- **Goal:** Enable Apollo cache for product detail/list; set keyArgs for pagination/search; remove fetchPolicy 'no-cache' where appropriate.
- **Files:** `src/api/graphql/account.api.ts` (ApolloClient cache and defaultOptions), `src/api/graphql/products.api.ts`.
- **Validation:** Second visit to same product page uses cache (no duplicate network for same slug).

### Step 8: Vehicle invalidation central

- **Goal:** Single place that invalidates vehicle-scoped queries when CarContext or garage current changes.
- **Files:** CarContext or a hook used where setCurrentActiveCar / setCurrentCar is called; call queryClient.invalidateQueries with predicate or key prefixes from VEHICLE_INVALIDATION.md.
- **Validation:** Change vehicle → category tree and vehicle product list refetch for new vehicle; dropdowns and TecDoc product unchanged.

### Step 9: DTOs and mappers (minimal integration)

- **Goal:** New code and one refactor path use ProductCardDTO/ProductDetailsDTO/TecDocDetailsDTO; map Vendure and TecDoc in mappers. Existing components can keep IProduct until migrated.
- **Files:** Already added: `src/services/mappers/*`. Optionally: one product card or product detail component that consumes DTOs to validate the pipeline.
- **Validation:** No behavior change; new components can use DTOs.

### Step 10: Reselect selectors for cart/wishlist/compare

- **Goal:** Memoized selectors for cart totals, wishlist count, compare count; no new array/object allocation on every render.
- **Files:** New or under `src/store/cart/`, `src/store/wishlist/`, `src/store/compare/` (e.g. selectors.ts using createSelector).
- **Validation:** Same UI; fewer unnecessary rerenders (optional: measure with Profiler).

---

## 3. Duplication Removal Plan

| Duplicate | Current locations | How to eliminate | Compatibility |
|-----------|-------------------|-------------------|----------------|
| **Current vehicle** | CarContext, GarageContext, Redux garage | Keep CarContext as “active for catalog”; garage = GarageContext only. Redux garage: keep for legacy FakeVehicleApi or deprecate and have one adapter (useGarageFromReduxOrContext) that reads Context first. | Adapter returns same shape (e.g. IVehicle or active car data) until all consumers use Context. |
| **Category tree** | CategoryTreeContext (state), Redux shop.category (legacy) | Tree: only in TanStack Query; Context reads from Query. Legacy shop: do not persist; optional migration of slug route to Query. | Context API unchanged; data source switches to cache. |
| **Product list (category)** | Redux shop.productsList, useVehicleCatalog state | Vehicle list: only in TanStack Query; useVehicleCatalog uses useQuery. Legacy slug list: Query or keep in Redux without persist. | useShopProductsList() can proxy to Query cache during migration. |
| **Product detail** | Apollo, Redux quickview (full product) | Quickview: store slug only; resolve from Apollo. Product page: Apollo only. | useQuickview() + useQuickviewProduct(slug) from Apollo. |
| **Product shape** | Vendure, FakeShop, Car API, IProduct | DTOs (ProductCardDTO, ProductDetailsDTO, TecDocDetailsDTO); mappers; UI consumes DTOs. | Existing IProduct consumers unchanged until migrated. |
| **Garage list** | Redux garage (IVehicle[]), GarageContext (IGarageVehicle[]) | Single owner: GarageContext. Redux garage: either remove and migrate CurrentVehicleGarageProvider to Context, or keep only for FakeVehicleApi and sync with Context via adapter. | useGarageCurrent() adapter can return Context-derived vehicle in IVehicle shape. |

If a duplication cannot be removed without risk: keep it, add an adapter/compat layer, document the removal path (e.g. in REDUX_CLEANUP_PLAN.md).

---

## 4. Next.js Caching Plan (Pages Router)

- **Where:** Backend (preferred) or next.config.js `headers()` for proxy routes, or lightweight Next.js API proxy only if needed.
- **Endpoints and headers:**

| Endpoint / type | Cache-Control | Rationale |
|-----------------|---------------|-----------|
| Category tree (Car API) | s-maxage=300, stale-while-revalidate=600 | 5m fresh |
| Dropdowns (Car API) | s-maxage=3600, stale-while-revalidate=86400 | 1h fresh |
| Homepage blocks (fake) | s-maxage=60, stale-while-revalidate=300 | 1m fresh |
| Product detail (Vendure) | Backend: s-maxage=60, stale-while-revalidate=300 | Short TTL |
| TecDoc product | s-maxage=600, stale-while-revalidate=3600 | 10m fresh |
| Vehicle product list | Prefer client cache; if server: s-maxage=120, stale-while-revalidate=300 | 2m |

- **How to apply:** Backend sets headers on Car/TecDoc/Vendure responses. For Next.js: use `headers()` in next.config.js for paths that point to API routes, or in API route handlers that proxy to backend. Do not change route structure or slugs.

---

## 5. Do Not Break Legacy Checklist

Before each release, confirm:

- [ ] **Critical routes:** `/`, `/catalog`, `/catalog/[slug]/products`, `/catalog/products/[carModelID]`, `/products/[slug]`, `/cart`, `/cart/checkout`, `/wishlist`, `/compare`, `/account/*` work.
- [ ] **Vehicle lookup:** Registration and manual (brand/year/model/engine) set current car; garage can add/remove/set current.
- [ ] **Category browse:** Tree from API or fallback from shopApi.getCategories; catalog index and category products load.
- [ ] **Product detail:** Vendure by slug + TecDoc by product id; specs, vehicles, OE refs show when available.
- [ ] **Account:** Login, register, dashboard, addresses, orders (Vendure GraphQL).
- [ ] **Cart/checkout:** Fake checkout flow completes; cart and wishlist persist across refresh (after whitelist).
- [ ] **Demo pages:** All under `/demo/*` (shop, site, home-one, car-search-history, etc.) load and behave as before.
- [ ] **Fake APIs:** FakeShopApi, FakeBlogApi, FakeVehicleApi and fake-server endpoints still used where expected; no removal of demo or fallback flows.

---

## 6. Validation Commands and Smoke Tests

### Commands

- **Dev:** `npm run dev` — app runs (e.g. port 5173 per AUDIT).
- **Prod build:** `npm run build` — completes without errors (note: project has typescript.ignoreBuildErrors; fix TS where possible).
- **Start:** `npm run start` — production server runs.

### Smoke Test List (business flows)

1. **Vehicle lookup:** Enter reg or select brand/year/model/engine → current car set; catalog/tree reflect vehicle.
2. **Category browse:** Open catalog → see tree or fallback categories; open category → see products (vehicle-scoped or legacy slug).
3. **Product detail:** Open product by slug → Vendure data and TecDoc block (if productId has TecDoc) load; no console errors.
4. **Account:** Login → dashboard; addresses and orders load (Vendure).
5. **Cart/checkout:** Add to cart → go to checkout → submit (fake checkout); cart persists after refresh.
6. **Wishlist/compare:** Add to wishlist/compare → refresh → items still there (persist whitelist).
7. **Demo pages:** Visit `/demo/shop/category-right-sidebar`, `/demo/home-one`, `/demo/car-search-history` → no 404 or runtime errors.

### Expected results

- `npm run dev` → dev server starts.
- `npm run build` → build succeeds (zero exit code).
- `npm run start` → server listens.
- All smoke tests above pass without regression.

---

## 7. Rollback Safety

- Persist format is versioned (version in state); old clients can ignore unknown keys.
- Each migration step in a separate PR; feature flags optional for “read from Query vs Redux” where needed.
- No removal of legacy fake APIs or demo routes; no breaking API or route changes.
