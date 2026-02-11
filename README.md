# Autobutik

## Overview

Autobutik is a Next.js storefront for an automotive parts e-commerce platform. It lets customers find parts by vehicle (registration number or manual selection), browse a TecDoc-based category tree, view product details with technical specs, and use account, cart, and wishlist features. The frontend talks to a Vendure-based shop API and a separate backend for car lookup, vehicle catalog, and TecDoc product data.

## Features

- Vehicle lookup by Swedish registration number or by brand/year/model/engine
- Garage: save multiple vehicles and switch active vehicle for part compatibility
- TecDoc category tree and vehicle-specific product listing and search
- Product detail pages with TecDoc specs, compatible vehicles, and OE references
- Account: login, registration, addresses, order history (Vendure Shop API)
- Cart and wishlist (state in Redux with localStorage persistence)
- Car search history in localStorage (last 50 searches)
- SEO: meta tags, Open Graph, Twitter Cards, JSON-LD (organization, website, product, breadcrumb, article, FAQ)
- i18n: Swedish (default) and English via next-i18next
- Responsive layout with multiple header variants (config in `src/config.ts`)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14.2 |
| Language | TypeScript 5.x |
| UI | React 18.2, Bootstrap 4.6, Reactstrap 8.9, SASS |
| State | Redux 4.1, Redux Thunk, next-redux-wrapper |
| API / Data | Apollo Client 3.x, GraphQL (Vendure Shop API), REST (car lookup, TecDoc, vehicle catalog) |
| i18n | react-intl 7.x, next i18n (locales: swe, en) |
| Other | react-hook-form, react-toastify, query-string, Photoswipe, Slick Carousel |

## Architecture

- **Next.js**: SSR and client-side rendering; `getServerSideProps` / `getStaticProps` where used; API proxy via `next.config.js` rewrites for `/shop-api` to backend.
- **Backend base URL**: Single base URL (`NEXT_PUBLIC_BACKEND_URL` / `BASE_PATH`) used for Shop API proxy, car lookup, vehicle catalog, and TecDoc product API. No separate TecDoc port in config (doc mentions port 3001; not found in config).
- **Data sources**:
  - **Vendure Shop API** (GraphQL): account (customerApi), products list/detail/search (`src/api/graphql/products.api.ts`). Proxied at `/shop-api`.
  - **REST on same backend**: car lookup (`/car/:regNr`, `/car/dropdown/*`), vehicle categories/products (`/car/categories/*`, `/car/products/*`, `/car/search`), TecDoc details (`/tecdoc/product/:id`). Called from client/server using `BASE_PATH` / `NEXT_PUBLIC_API_URL`.
  - **Fake APIs**: `shopApi`, `blogApi`, `vehicleApi` in `src/api/index.ts` point to Fake* implementations backed by `src/fake-server` (in-memory data). Used for homepage blocks (brands, special offers, top rated, popular), catalog fallback categories, demo shop pages, and checkout flow. Real product detail and product listing in catalog use GraphQL/Vendure and Car API, not FakeShopApi.
- **State**: Redux (cart, wishlist, compare, currency, garage, user, shop, options, quickview, mobile menu); React contexts (Auth, Car, Garage, VehicleCatalog, CategoryTree, CurrentVehicleGarage). Persistence: cart/wishlist/state in localStorage under key `autobutik`; auth token `customerToken`; car search history and garage/current car in separate keys.

## Installation

1. **Prerequisites**: Node.js 16+ (project uses types from `@types/node` 16). npm, or pnpm/yarn (lockfiles for all three exist; standardize on one).
2. **Clone and install**:
   ```bash
   cd Autobutik-frontend
   npm install
   ```
3. **Environment**: Copy or create `.env` in project root (see Environment Variables). `.env` is gitignored.
4. **Run**:
   - Dev: `npm run dev` (runs on port 5173).
   - Build: `npm run build`.
   - Start production: `npm run start` (default port 3000; use `-p` to override).
   - Optional: `npm run build-and-start` or `npm run serve` (build + pm2 on port 8000).

Backend (Vendure + car/TecDoc APIs) must be running and reachable at the URL set in env; otherwise account, products, car lookup, and TecDoc will fail.

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `BASE_PATH` | Backend base URL (server-side and next.config). Used for rewrites and server-side API calls. | Yes (for production) | `https://api.autobutik.se` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend base URL exposed to client. Must match backend serving Shop API, `/car/*`, and `/tecdoc/*`. | Yes (for production) | `https://api.autobutik.se` |

Optional: If both are unset, code falls back to `http://localhost:3000`. No other env vars are read in the codebase (e.g. no separate `NEXT_PUBLIC_API_URL` in .env; it is set from `BACKEND_URL` in `next.config.js`).

## Usage

- **Local development**: Set `BASE_PATH` and `NEXT_PUBLIC_BACKEND_URL` to your backend (e.g. `http://localhost:3000`). Run `npm run dev` and open `http://localhost:5173`.
- **Product pages**: `/products/[slug]` — slug from Vendure; data from GraphQL `product(slug)`.
- **Catalog**: `/catalog` — category tree from Car API; `/catalog/[slug]/products` — vehicle-scoped or general product list (GraphQL or Car API depending on route/component).
- **Vehicle flow**: Use header/car lookup to set current vehicle; garage and catalog use it for compatibility and filtering.

## API Endpoints

**Proxied by Next.js (same origin to avoid CORS):**

- `POST /shop-api` — Vendure Shop GraphQL (products, search, cart, account, etc.).

**Called directly to backend base URL (client and server):**

- `GET /car/:regNr` — Car by registration number.
- `GET /car/dropdown/brands` — Brands list.
- `POST /car/dropdown/years` — Years for brand (body: `{ merke }`).
- `POST /car/dropdown/models` — Models for brand/year (body: `{ merke, year }`).
- `POST /car/dropdown/types` — Engine/types for brand/year/model (body: `{ merke, year, modell }`).
- `POST /car/dropdown/wheel-id` — Wheel data by model id (body: `{ mid }`).
- `GET /car/categories/:modelId` — Categories for vehicle (optional `?parentId=`).
- `GET /car/categories/tree` — Full category tree (optional `?modelId=`).
- `GET /car/products/:modelId` — Products for vehicle (optional: skip, take, term, collectionId, collectionSlug, brand, position).
- `GET /car/search` — Product search (query: term, modelId, skip, take, collectionId, collectionSlug).
- `GET /tecdoc/product/:productId` — TecDoc product details (Vendure product ID).

See `doc/car-lookup-api.md`, `doc/tecdoc-product-details-api.md`, and `doc/storefront-products.md` for request/response details.

## Folder Structure

| Path | Purpose |
|------|---------|
| `src/pages` | Next.js routes; `_app.tsx`, `_document.tsx`, index, catalog, products, cart, account, blog, demo, etc. |
| `src/components` | Reusable UI: layout, blocks, shop, widgets, shared (e.g. CarLookupForm, SEO). |
| `src/api` | API layer: `graphql/` (account, products, countries, reviews), `car.api.ts`, `base/` (interfaces), `fake-api/` (Fake* wrappers), `index.ts` (exports shopApi, blogApi, vehicleApi as Fake*; accountApi as GraphQL). |
| `src/fake-server` | In-memory mock data and endpoints used by fake-api (categories, products, vehicles, orders, posts, etc.). |
| `src/contexts` | React contexts: Auth, Car, Garage, VehicleCatalog, CategoryTree. |
| `src/store` | Redux slices: cart, wishlist, compare, currency, garage, user, shop, options, quickview, mobile-menu, root. |
| `src/hooks` | useAuth, useCarSearchHistory, useProducts, useProductSearch, useTecdocProduct, useVehicleCatalog. |
| `src/services` | i18n, router, url, forms, validators, SEO structured data, car-search-history, Photoswipe, sidebar. |
| `src/interfaces` | TypeScript interfaces for domain models. |
| `src/data` | Static data (e.g. featured products list, catalog tree JSON). |
| `src/scss` | Global and component SASS. |
| `public` | Static assets and i18n JSON (swe, en). |
| `doc` | Internal API and feature docs (car lookup, TecDoc, storefront, SEO, blog, reviews, wishlist/cart). |

## Deployment

- **CI/CD**: GitHub Actions workflow in `.github/workflows/main.yml` runs on push to `prod`. Checks out repo, SSH to EC2, pull, `npm install --force`, `npm run build`, restart app via pm2 (name `autobutik-frontend`, port 8000), restart Nginx. Requires secrets: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`.
- **Production URL**: Referenced in workflow as `https://www.autobutik.se`. Frontend runs on port 8000 behind Nginx.

## Security Notes

- Auth token is stored in localStorage (`customerToken`). Prefer httpOnly cookies for production if the backend supports it.
- No API keys or secrets are read from env in the frontend; all backend access uses a single base URL.
- Cart/wishlist and car search history are client-only (localStorage); no sensitive PII beyond what the user enters.
- ESLint and TypeScript errors are ignored during build (`eslint.ignoreDuringBuilds: true`, `typescript.ignoreBuildErrors: true` in `next.config.js`). Re-enable for production quality.

## Contributing Guidelines

- Not documented in the repository. Recommended: use a single package manager; run lint and type-check in CI; document branching and PR process; keep `doc/` in sync with API changes.

## License

Not found in project.
