# Phase 1 — Audit Summary

## Project Structure

- **Workspace root**: `aubook` (name does not match project; actual app is in `Autobutik-frontend`).
- **Single application**: `Autobutik-frontend` — Next.js frontend; no backend code in this repo.
- **Lock files**: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` present. Inconsistent package manager.
- **No root README**: No README at workspace root or in project until generated.

## Project Purpose

E-commerce storefront for automotive parts: vehicle-based part lookup (registration or manual), TecDoc category tree, product listing and detail, account, cart, wishlist. Targets Swedish market (primary locale `swe`, secondary `en`).

## Core Features Identified

- Vehicle lookup (registration number and brand/year/model/engine dropdowns).
- Garage (multiple vehicles, current vehicle for compatibility).
- TecDoc category tree and vehicle-specific catalog and search.
- Product pages with TecDoc specs, compatible vehicles, OE references.
- Customer account (Vendure): login, register, addresses, orders.
- Cart and wishlist (Redux + localStorage).
- Car search history (localStorage, last 50).
- SEO (meta, OG, Twitter, JSON-LD).
- i18n (swe, en).

## Tech Stack (Verified)

- Next.js 14.2, React 18.2, TypeScript 5.x.
- Redux 4.1, next-redux-wrapper, Redux Thunk.
- Apollo Client 3.x, GraphQL (Vendure Shop API).
- Bootstrap 4.6, Reactstrap 8.9, SASS.
- react-intl, next i18n.

## Architecture Style

- Monolith frontend; backend is external (Vendure + REST for car/TecDoc).
- Hybrid API: real GraphQL (account, products) and REST (car, TecDoc, vehicle catalog) plus fake in-memory APIs (shop, blog, vehicle) for homepage, some catalog fallback, demo pages, and checkout.
- SSR and client rendering; state in Redux and React contexts; persistence in localStorage.

## External Dependencies

- **Runtime**: All from npm (see package.json). No other package registries or private deps.
- **Backend**: Requires external service at `NEXT_PUBLIC_BACKEND_URL` / `BASE_PATH` exposing: Vendure at `/shop-api`, REST at `/car/*` and `/tecdoc/product/:id`.

## Environment Variables

- **Used in code**: `NEXT_PUBLIC_BACKEND_URL`, `BASE_PATH`, `NODE_ENV`. `NEXT_PUBLIC_API_URL` is set in next.config from `BACKEND_URL` (derived from env), not from a separate .env key.
- **.env present**: Contains `BASE_PATH` and `NEXT_PUBLIC_BACKEND_URL` (both set to localhost:3000 in repo). `.env` is in `.gitignore` (correct).

## Build and Run Process

- **Scripts**: `dev` (Next dev on 5173), `build` (next build), `start` (next start), `build-and-start`, `serve` (build + pm2 on 8000).
- **Build**: Next.js build; ESLint and TypeScript errors are ignored in config.
- **Deploy**: GitHub Actions on branch `prod`; SSH to EC2, npm install --force, build, pm2, nginx restart.

## API Integrations

- **Vendure Shop API** (GraphQL): account, products list/detail/search. Proxied at `/shop-api` in next.config.
- **REST (same backend)**: Car lookup, vehicle categories/products/search, TecDoc product. No proxy; called with base URL from env.
- **Fake APIs**: Implementations in `src/fake-server` and `src/api/fake-api`; used for shop (brands, categories, special offers, product list in legacy shop flow), blog, vehicle (demo). Real product data in main flows comes from GraphQL and Car API.

## Security Concerns

- Auth token in localStorage (`customerToken`); consider httpOnly cookies if backend supports.
- Build runs with `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`; reduces safety net.
- No secrets in frontend env; backend URL only.

## Missing Documentation

- No README before this audit.
- No CONTRIBUTING, LICENSE, or SECURITY policy.
- Doc folder describes APIs and features but dev setup and architecture were not summarized in one place.
- TecDoc doc mentions dev base URL localhost:3001; next.config and .env use 3000. Inconsistency.

## Dead or Unused Code

- **api/base**: Base interfaces and abstract API classes; used by fake-api and some components. Not dead.
- **fake-server and fake-api**: Actively used for homepage, catalog fallback, demo pages, checkout. Not dead but hybrid with real backend can cause confusion.
- **demo/** pages: Many demo shop/category layouts; likely for reference/templates. Not removed.
- Commented import in `src/api/index.ts`: `FakeAccountApi` and `FakeCountriesApi` commented; GraphQL used instead. Intentional.

## Code Quality Issues

- **process.browser**: Used in multiple files; deprecated in Next.js. Prefer `typeof window !== 'undefined'`.
- **Console.log in production**: e.g. `car.api.ts` has multiple `console.log` calls; should be removed or gated by env.
- **TypeScript/ESLint**: Build ignores TS and ESLint errors; technical debt and regressions can slip in.
- **Any types**: e.g. `(wheel as any)` in CarLookupForm; reduce where possible.

## Folder Structure Clarity

- Clear separation: pages, components, api, store, contexts, services, hooks, interfaces, data, scss, fake-server.
- Naming: `Autobutik-frontend` vs package name `autobutik` vs workspace `aubook` is inconsistent.
- `category images/`, `Payment link images/`, `trodo-images/` at repo root: asset folders; purpose could be documented.

## Inconsistencies

- **Backend URL**: Doc (tecdoc-product-details-api.md) says "Development: localhost:3001"; rest of project uses 3000. Unclear if TecDoc runs on different port in some setups.
- **API surface**: Some flows use Vendure GraphQL and Car API; others use FakeShopApi. Not documented in one place; README now clarifies.
- **Package managers**: Three lock files; recommend standardizing on one and removing others from version control or documenting which is canonical.

---

# Phase 2 — Project Overview

## Project Name

Autobutik (frontend package: autobutik; folder: Autobutik-frontend).

## Short Description

Autobutik is a Next.js e-commerce storefront for automotive parts. It provides vehicle-based part discovery (Swedish registration or manual selection), TecDoc-driven categories and product data, and full shop features (account, cart, wishlist) backed by Vendure and a custom car/TecDoc API.

## Problem It Solves

- Connects customers to the right parts by vehicle (registration or make/model/year/engine).
- Surfaces TecDoc technical data and compatibility on product pages.
- Offers a single storefront for browsing, account, and checkout against a Vendure backend and a vehicle/catalog API.

## Target Users

- End customers in Sweden (and optionally English) buying automotive parts.
- Internal or partner users using demo pages and catalog layouts as reference.

## Key Features

- Vehicle lookup by registration number or dropdown (brand → year → model → engine).
- Garage: save and switch between multiple vehicles for part compatibility.
- TecDoc category tree and vehicle-specific product listing and search.
- Product detail with TecDoc specs, compatible vehicles, and OE references.
- Customer account (login, registration, addresses, order history) via Vendure.
- Cart and wishlist with localStorage persistence.
- Car search history (last 50 searches) in localStorage.
- SEO (meta, Open Graph, Twitter Cards, JSON-LD).
- Swedish and English locales.

## Tech Stack

Next.js 14, React 18, TypeScript 5; Redux, Apollo Client, GraphQL (Vendure); Bootstrap/Reactstrap, SASS; react-intl; REST for car lookup and TecDoc.

## Architecture Summary

Next.js frontend with SSR and client rendering. Single backend base URL: Vendure Shop API (GraphQL) proxied at `/shop-api`; REST used for `/car/*` and `/tecdoc/product/:id`. Additional in-memory fake APIs serve homepage blocks, some catalog fallback, demo pages, and checkout. State: Redux (cart, wishlist, user, shop, etc.) and React contexts (Auth, Car, Garage, VehicleCatalog, CategoryTree); persistence in localStorage.

## System Flow (High-Level)

1. User lands on site; may set vehicle via registration or manual lookup; vehicle stored in context and garage.
2. Catalog and product search use category tree and product APIs (Car API and/or Vendure) depending on route.
3. Product detail loads from Vendure by slug; TecDoc data loaded by product ID from REST API.
4. Account actions (login, register, addresses, orders) go to Vendure Shop API.
5. Cart/wishlist and car search history are client-side (Redux + localStorage).

## Deployment Model

GitHub Actions on push to `prod` branch: SSH to EC2, pull, npm install, next build, pm2 restart (port 8000), nginx restart. Production URL: https://www.autobutik.se. Backend and env (BASE_PATH / NEXT_PUBLIC_BACKEND_URL) must be configured separately.

## Current Status

Production. Deployed via CI to EC2; frontend runs in production. Hybrid use of real and fake APIs and build ignoring lint/TS suggest ongoing evolution and some technical debt.
