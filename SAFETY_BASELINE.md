# Phase 0 — Safety Baseline

## Project map

| Item | Value |
|------|--------|
| Framework | Next.js 14.2 |
| Main entry | `src/pages/_app.tsx` (App + getInitialProps), `src/pages/_document.tsx` |
| Routing | Pages Router only (`src/pages/**`). No App Router. |
| SSR usage | getServerSideProps / getInitialProps where used; client-side state and effects elsewhere. |
| State management | Redux (cart, wishlist, compare, currency, garage, user, shop, options, quickview, mobile menu). React contexts: AuthContext, CarContext, GarageContext, VehicleCatalogContext, CategoryTreeContext. |
| Persistence | localStorage: key `autobutik` (Redux state), `customerToken` (auth), `autobutik_car_search_history`, garage keys (see GarageContext/CarContext). |
| Vendure | GraphQL Shop API; proxied at `/shop-api` via next.config rewrites to `NEXT_PUBLIC_BACKEND_URL`. |
| Car API | REST on same backend: `/car/:regNr`, `/car/dropdown/*`, `/car/categories/*`, `/car/products/*`, `/car/search`. |
| TecDoc API | REST: `GET /tecdoc/product/:productId` on same backend. |
| Fake APIs | `src/api/index.ts` exports FakeShopApi, FakeBlogApi, FakeVehicleApi; data from `src/fake-server`. Used for homepage blocks, catalog fallback, demo pages, checkout. |

## Production risk sources

1. **Ignored TS/ESLint builds** — `next.config.js`: `eslint.ignoreDuringBuilds: true`, `typescript.ignoreBuildErrors: true`. Errors can ship to production.
2. **Lockfile collisions** — `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` all present. CI uses `npm install --force`. Risk of inconsistent installs.
3. **Env mismatch** — Doc (tecdoc-product-details-api.md) mentions dev port 3001; code and .env use 3000. Single backend URL used for shop-api, car, tecdoc.
4. **Console logging** — Many `console.log`/`console.error` in car.api.ts, account.api.ts, contexts, hooks. Production noise and possible info leakage.
5. **Deprecated APIs** — `process.browser` used in 7 files (Next.js deprecated; use `typeof window !== 'undefined'`).
6. **Missing translations** — Menu and category labels use raw strings (e.g. "Body Parts", "Door Handles") or TecDoc names as react-intl message ids; keys often missing in swe.json, causing @formatjs/intl MISSING_TRANSLATION errors.

## Behavior preservation contract

### Critical routes and flows (must not change)

- `/` — Homepage (blocks, vehicle hero, category tabs, featured products, blog, brands).
- `/catalog` — Catalog index (category tree from API or fallback from shopApi.getCategories).
- `/catalog/[slug]/products` — Category products (vehicle-scoped or general).
- `/catalog/products/[carModelID]` — Vehicle-specific product list.
- `/products/[slug]` — Product detail (Vendure by slug + TecDoc by product id).
- `/cart`, `/cart/checkout` — Cart and checkout (FakeShopApi checkout flow).
- `/wishlist`, `/compare` — Wishlist and compare.
- `/account/*` — Login, register, dashboard, addresses, orders, password (Vendure GraphQL).
- Vehicle lookup (registration + manual), garage, car search history.
- All demo pages under `/demo/*` (shop, site, home-one, car-search-history, etc.).

### Legacy / demos that must keep working

- Fake APIs: FakeShopApi, FakeBlogApi, FakeVehicleApi and `src/fake-server` endpoints.
- Demo pages: `src/pages/demo/**` (all layouts and demos).
- Header departments: `src/data/headerDepartments.ts` — static menu when category tree is not used; titles are English strings (Body Parts, Door Handles, etc.).
- Fallback when category tree fails or is empty: catalog and menu fall back to shopApi/fake data or static departments.
- BlockCategoryTabs: expects header menu items with title `MENU_CAR_PARTS`, `MENU_WIPER_BLADES`, etc., when built from API; also supports legacy group.title used as id with defaultMessage.
