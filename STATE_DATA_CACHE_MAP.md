# STATE_DATA_CACHE_MAP.md — Phase 0 Audit (No Code Changes)

**Purpose:** Map all Redux slices, data-fetching/caching paths, and duplication hotspots to define a single source of truth and caching strategy.

---

## 1. Redux Slices Map

| Slice | What It Stores | Persisted to localStorage? | Subscribers (high-level) | Holds Server Data? |
|-------|----------------|---------------------------|--------------------------|---------------------|
| **version** | Schema version number (for persist invalidation) | Yes (entire state) | None directly | No |
| **cart** | `lastItemId`, `quantity`, `items` (ICartItem[] with product snapshot), `subtotal`, `totals`, `total` | Yes (entire state) | Cart page, checkout, Dropcart, Header, MobileMenuIndicators, ProductCard, Quickview, CheckoutCart, forms (sign-up product add) | No (cart is app state; product snapshots are minimal) |
| **compare** | `items` (IProduct[] — full product objects) | Yes (entire state) | Compare page, ProductCard, Quickview, ShopPageProduct, Topbar | **Yes — full product objects** |
| **currency** | `current` (currency code) | Yes (entire state) | CurrencyFormat, DropdownCurrency, MobileMenuSettings | No |
| **garage** | `items` (IVehicle[] — id, year, make, model, engine), `current` (IVehicle \| null) | Yes (entire state) | CurrentVehicleGarageProvider, MobileHeader (useGarageSetCurrent), _app (loadUserVehicles) | No — but **legacy**: from FakeVehicleApi, not real garage |
| **mobile-menu** | Open/close state | Yes (entire state) | MobileMenu, MobileHeader, MobileMenuPanelController, MobileMenuIndicators | No |
| **options** | `desktopHeaderLayout`, `desktopHeaderScheme`, `mobileHeaderVariant` | Yes (entire state) | MainMenu, Header, AuthLayout | No |
| **quickview** | `product` (IProduct \| null), open state | Yes (entire state) | Quickview, ProductCard | **Yes — product detail** |
| **shop** | `init`, `categorySlug`, `categoryIsLoading`, `category` (ICategory), `productsListIsLoading`, `productsList` (IProductsList), `options`, `filters`, `activeFilters`, `removedFilters`, `currentFilters` | Yes (entire state) | ProductsView, ShopPageShop, WidgetFilters, Filter, ShopSidebar | **Yes — category + products list (FakeShopApi)** |
| **user** | `current` (IUser \| null) | Yes (entire state); also `customerToken` in separate key | AuthContext, account pages, Header AccountMenu, CheckoutForm, withAuth, ReviewsView | No (user snapshot from Vendure) |
| **wishlist** | `items` (IProduct[]) | Yes (entire state) | Wishlist page, ProductCard, Quickview, ShopPageProduct, MobileMenuIndicators, Header | **Yes — full product objects** |

**Persistence mechanism:**  
- `store/store.ts`: `save(state)` writes **entire** `store.getState()` to `localStorage['autobutik']` on every dispatch (subscribed in `_app.tsx`).  
- `load()` reads and applies client state on mount; version check invalidates old payloads.  
- **No whitelist:** everything is persisted (including shop category, productsList, compare items, wishlist items, quickview product).

---

## 2. Data-Fetching and Caching Paths

### Apollo Client (Vendure GraphQL)

- **Config:** `src/api/graphql/account.api.ts` — `ApolloClient` with `InMemoryCache()`, `fetchPolicy: 'no-cache'` for watchQuery and query.
- **Usage:**
  - **Account:** login, register, me, activeCustomer, addresses, orders (graphqlClient.query in account.api).
  - **Products:** fetchProductDetail, product list, search (products.api.ts — graphqlClient.query).
  - **Countries:** availableCountries (countries.api.ts).
  - **Reviews:** product reviews and stats (reviews.api.ts).
- **Blog:** `useQuery` in `pages/blog/index.tsx` and `pages/blog/[slug].tsx` (separate GET_BLOGS / GET_BLOG).
- **Caching:** Default InMemoryCache; no custom typePolicies or keyArgs. With `no-cache`, Apollo does not serve cached data for same query; every request hits network. **No normalized caching strategy for Product/Variant.**

### REST (Car API)

- **File:** `src/api/car.api.ts` — class `CarApi`, singleton `carApi`.
- **Endpoints (no client-side cache):**
  - `getCarByRegistration(regNr)` — GET `/car/:regNr`
  - `getBrands()` — GET `/car/dropdown/brands`
  - `getYears(brand)` — POST `/car/dropdown/years`
  - `getModels(brand, year)` — POST `/car/dropdown/models`
  - `getEngines(brand, year, model)` — POST `/car/dropdown/types`
  - `getWheelDataByModelId(modelId)` — POST `/car/dropdown/wheel-id`
  - `getCategoriesForVehicle(modelId, parentId?)` — GET `/car/categories/:modelId`
  - `getCategoryTree(modelId?)` — GET `/car/categories/tree`
  - `getProductsForVehicle(modelId, options)` — GET `/car/products/:modelId`
  - `searchProducts(params)` — GET `/car/search`
- **Consumers:** CarContext (reg lookup), VehicleCatalogContext (categories), CategoryTreeContext (tree), useVehicleCatalog (products), components (dropdowns, search). **No caching:** each call is a fresh fetch.

### REST (TecDoc)

- **Hook:** `src/hooks/useTecdocProduct.ts` — `useTecdocProduct(productId)` fetches `GET /tecdoc/product/:productId`.
- **No cache:** useState + useEffect; refetch on productId change. Used in ShopPageProduct, ProductInformation, OriginalPartNumber, CompatibleVehiclies.

### Fake APIs

- **Exports:** `src/api/index.ts` — `shopApi` (FakeShopApi), `blogApi` (FakeBlogApi), `vehicleApi` (FakeVehicleApi).
- **Routes/pages that depend on them:**
  - **FakeShopApi:** Homepage (brands, special offers, top/popular products), catalog index fallback (getCategories), catalog [slug] products via shop reducer (getCategoryBySlug, getProductsList), cart checkout (checkout), ShopPageCategory (brands), ProductSidebar (categories, latest products), AnalogsTable, BlockZone (featured/popular/top), demo/shop/* (categories, product by slug, getProductsList).
  - **FakeBlogApi:** Homepage blog block, BlogSidebar (categories), demo/blog/*.
  - **FakeVehicleApi:** Redux garage (getUserVehicles, addUserVehicle, removeUserVehicle) — used by _app loadUserVehicles and garage actions.
- **Fake server:** `src/fake-server` — in-memory data; no HTTP cache.

---

## 3. Duplication Hotspots

### Same “thing” in multiple places

| Thing | Location 1 | Location 2 | Location 3 | Notes |
|-------|------------|------------|------------|--------|
| **Current vehicle** | **CarContext** — `currentActiveCar` (ICurrentActiveCar, localStorage `currentActiveCar`) | **GarageContext** — `vehicles`, `currentCarId` (localStorage `garageVehicles`, `currentCarId`) | **Redux garage** — `items` (IVehicle[]), `current` (IVehicle \| null by id) | CarContext = lookup result for catalog/tree. GarageContext = user’s saved vehicles (real). Redux garage = legacy FakeVehicleApi (different shape). |
| **Category tree** | **CategoryTreeContext** — `tree` (ICategoryTreeNode[]) in React state | **Redux shop** — `category` (ICategory) for legacy catalog slug flow | **Catalog index** — SSR `shopApi.getCategories()` as fallback | Tree: Car API (modelId-scoped). Shop category: FakeShopApi by slug. |
| **Product list (category)** | **Redux shop** — `productsList` (IProductsList) for `/catalog/[slug]/products` legacy path | **VehicleCatalogContext** — none (products via useVehicleCatalog hook) | **useVehicleCatalog** — fetches carApi.getProductsForVehicle, holds in local state | Legacy slug flow uses shop reducer; vehicle flow uses hook + Car API. |
| **Product detail** | **Apollo** — fetched in getServerSideProps (products.api fetchProductDetail) | **Redux quickview** — `product` (IProduct) | **TecDoc** — useTecdocProduct(productId) in component | Vendure product by slug; quickview stores full product; TecDoc separate REST. |
| **Product shape (card/list)** | **Vendure** — Product/Variant (products.api types) mapped to IProduct | **FakeShopApi** — IProduct from fake-server | **Car API** — vehicle products (different shape) in useVehicleCatalog | Multiple representations; no single DTO. |
| **Garage list** | **Redux garage** — IVehicle[] (id, year, make, model, engine) from FakeVehicleApi | **GarageContext** — IGarageVehicle[] (id, data: ICarData|IWheelData, addedAt) | — | Two parallel systems: legacy (Redux) vs real (Context). |

### Overlapping “current vehicle” sources

- **CarContext** — Used for: CategoryTreeContext (modelId), VehicleCatalogContext (modelId), catalog pages (breadcrumb, hero). **Source of truth for “which car we’re browsing with”.**
- **GarageContext** — Used for: account/garage, VehiclePickerModal, CarIndicator, MobileHeader, BlockVehicleSearchHero, ShopPageProduct (vehicles, currentCarId). **Source of truth for “saved vehicles and selected one”.**
- **Redux garage** — Used for: CurrentVehicleGarageProvider (useGarageCurrent, useGarageSetCurrent), loadUserVehicles in _app, MobileHeader (garageSetCurrent). **Legacy; syncs with FakeVehicleApi.**

Current flow: GarageContext is the real garage. CarContext is the “active car” for catalog (can be set from lookup or from garage). Redux garage is separate (fake) and not the same as GarageContext.

### Product shape duplication

- **Vendure (GraphQL):** Product (id string, name, slug, variants, etc.) → mapped to IProduct (id number, name, slug, partNumber, etc.) in products.api.
- **TecDoc (REST):** TecdocProductData (technicalSpecs, compatibleVehicles, oeReferences) — used alongside Vendure on product page.
- **Fake shop:** IProduct from fake-server (same interface, different source).
- **Car API products:** Vehicle product list has its own item shape (e.g. productId, slug, price) — not IProduct.
- **UI:** Components expect IProduct for cart/wishlist/compare; vehicle product lists may use a different card representation.

---

## 4. State Ownership Matrix (Pre-SSOT)

| Domain | Redux | Apollo | REST (Car/TecDoc) | Context | localStorage |
|--------|-------|--------|-------------------|--------|--------------|
| Cart | ✓ (cart) | — | — | — | ✓ (autobutik) |
| Wishlist | ✓ (wishlist) | — | — | — | ✓ (autobutik) |
| Compare | ✓ (compare) | — | — | — | ✓ (autobutik) |
| Currency | ✓ (currency) | — | — | — | ✓ (autobutik) |
| Auth / User | ✓ (user) | Queries (me, etc.) | — | AuthContext (orchestration) | ✓ (autobutik + customerToken) |
| Garage (real) | — | — | — | GarageContext | garageVehicles, currentCarId |
| Current active car (catalog) | — | — | — | CarContext | currentActiveCar |
| Garage (legacy) | ✓ (garage) | — | FakeVehicleApi | — | ✓ (autobutik) |
| Category tree | — | — | Car API | CategoryTreeContext (state) | — |
| Vehicle categories | — | — | Car API | VehicleCatalogContext (state) | — |
| Shop category + list (legacy) | ✓ (shop) | — | — | — | ✓ (autobutik) |
| Product detail (Vendure) | quickview (copy) | Queries | — | — | ✓ (autobutik) |
| TecDoc product | — | — | useTecdocProduct (state) | — | — |
| Dropdowns (brands/years/models/engines) | — | — | Car API | — | — |
| Options / UI (header, mobile menu, quickview) | ✓ (options, mobile-menu, quickview) | — | — | — | ✓ (autobutik) |
| Car search history | — | — | — | — | autobutik_car_search_history |

---

## 5. Single Source of Truth Decision (Per Domain)

| Domain | Recommended SSOT Owner | Persisted? | Cache Policy | Notes |
|--------|-------------------------|------------|--------------|--------|
| Cart | Redux | Yes (whitelist) | N/A | Keep; persist only cart slice. |
| Wishlist | Redux | Yes (whitelist) | N/A | Keep; consider storing only product ids + minimal fields later. |
| Compare | Redux | Yes (whitelist) | N/A | Same as wishlist. |
| Currency | Redux | Yes (whitelist) | N/A | Keep. |
| Auth / User | Redux (snapshot) + Apollo (source) | Token only in localStorage | Apollo cache for server state | Redux holds current user snapshot; Apollo for queries. |
| Garage (saved vehicles) | **GarageContext** (or Redux with same shape) | Yes (existing keys) | N/A | Unify: one garage only; prefer Context or migrate Context → Redux (ids + minimal fields). |
| Current active car (catalog) | **CarContext** or derived from GarageContext | Yes (currentActiveCar key) | N/A | Keep CarContext as “active for catalog” or derive from garage current. |
| Category tree | **Query cache (TanStack)** + CategoryTreeContext as consumer | No | Stale-while-revalidate, key: categoryTree:{modelId\|''} | Remove from Context state; Context reads from cache. |
| Vehicle categories | **Query cache** + VehicleCatalogContext as consumer | No | key: vehicleCategories:{modelId} | Same as above. |
| Shop category + list (legacy) | **FakeShopApi + Query cache or keep Redux for legacy route only** | No | Do not persist; cache in memory or query cache for /catalog/[slug]/products when using fake API | Stop persisting shop slice. |
| Product detail (Vendure) | **Apollo** | No | Normalized cache; do not store in Redux quickview as full object | Quickview: store slug or id; resolve from Apollo. |
| TecDoc product | **Query cache (TanStack)** | No | key: tecdocProduct:{productId} | useTecdocProduct → useQuery. |
| Dropdowns | **Query cache** | No | keys: carDropdown:brands, carDropdown:years:{brand}, etc. | Cache REST responses. |
| Vehicle-scoped product lists | **Query cache** | No | key: carProducts:{vehicleKey}:{categoryId}:{page}:{filtersHash} | Replace useVehicleCatalog local state. |
| UI (options, mobile menu, quickview) | Redux | options + mobile-menu: yes; quickview: no (or only product id) | N/A | Persist options and mobile preference; quickview not persisted or only id. |
| Car search history | **localStorage** (existing service) | Yes | N/A | Keep. |

This document is the basis for SSOT_CONTRACT.md, CACHING_STRATEGY.md, and REDUX_CLEANUP_PLAN.md.
