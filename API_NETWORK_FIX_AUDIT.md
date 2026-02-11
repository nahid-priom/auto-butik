# API network fix – audit and changes

## Why `http://localhost:3000` was used

1. **Env not available in the client**
   - **If the app runs with Vite** (e.g. dev on 5173): Vite only exposes variables prefixed with `VITE_` to the client. The code used `process.env.BASE_PATH` and `process.env.NEXT_PUBLIC_API_URL`, which Vite does **not** inject. So both were `undefined` and the code fell back to `"http://localhost:3000"`.
   - **If the app runs with Next.js** (`next dev -p 5173`): Next loads `.env.local` and `next.config.js` injects `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_BACKEND_URL` from `BACKEND_URL`. So if you still saw localhost:3000, likely causes are: `.env.local` not in the project root, or the dev server was started from another cwd, or a different dev server (e.g. Vite) was used.

2. **Where the fallback lived**
   - `src/api/car.api.ts`: `getApiUrl()` used `process.env.BASE_PATH` (server) and `process.env.NEXT_PUBLIC_API_URL` (client), with fallback `"http://localhost:3000"`. Used by `getBrands`, `getCategoryTree`, and all other car/vehicle endpoints.
   - `src/api/graphql/account.api.ts`: server-side base URL used `process.env.NEXT_PUBLIC_API_URL || process.env.BASE_PATH || 'http://localhost:3000'`.
   - `src/hooks/useTecdocProduct.ts`: `TECDOC_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'`.
   - No other axios/fetch wrappers or `BASE_URL` constants were found; all API base URL usage went through the above.

3. **No `VITE_` usage**
   - The codebase had no `import.meta.env` usage. Everything used `process.env`, which is correct for Next but wrong for Vite client bundles.

---

## Minimal code changes (files + what changed)

| File | Change |
|------|--------|
| **`src/config/backendUrl.ts`** | **New.** Single helper `getBackendUrl()`: reads `VITE_BACKEND_URL` / `VITE_API_BASE_URL` (Vite), then `NEXT_PUBLIC_BACKEND_URL` / `NEXT_PUBLIC_API_URL` / `BASE_PATH` (Next), then fallback `http://localhost:3000`. Strips trailing slash. |
| **`src/api/car.api.ts`** | Replaced local `getApiUrl()` with `getBackendUrl()` from `~/config/backendUrl`. All `getApiUrl()` usages → `getBackendUrl()`. `normalizeNetworkError` now includes the resolved base URL in the message: `Configured base: ${baseUrl}`. |
| **`src/api/graphql/account.api.ts`** | Import `getBackendUrl`; server-side API URL is now `${getBackendUrl()}/shop-api` (client still uses `/shop-api`). |
| **`src/hooks/useTecdocProduct.ts`** | Import `getBackendUrl`; removed `TECDOC_API_URL`; fetch URL is `${getBackendUrl()}/tecdoc/product/${productId}`. |
| **`.env.local`** | Added `VITE_BACKEND_URL=https://api.autobutik.se` (kept existing `NEXT_PUBLIC_BACKEND_URL` and `BASE_PATH`). |
| **`.env.example`** | **New.** Documents `NEXT_PUBLIC_BACKEND_URL`, `BASE_PATH`, and optional `VITE_BACKEND_URL`. |
| **`vite.config.ts`** | **New.** Dev server port 5173; `~` alias; proxy `/car`, `/tecdoc`, `/shop-api` → `https://api.autobutik.se` (for CORS mitigation when using Vite and `VITE_BACKEND_URL=` empty). |

No changes to UI, routes, component structure, or business logic. No renames of existing exports/components.

---

## Final working config

- **Dev (frontend on 5173)**  
  - **Next.js:** Set `NEXT_PUBLIC_BACKEND_URL` and `BASE_PATH` in `.env.local` (e.g. `https://api.autobutik.se`). Run `next dev -p 5173`. Next injects these into the client; car/categories and TecDoc calls go to `https://api.autobutik.se/car/...` and `https://api.autobutik.se/tecdoc/...`.  
  - **Vite:** Set `VITE_BACKEND_URL=https://api.autobutik.se` in `.env.local`. Run Vite on 5173. Same URLs. If the backend blocks localhost origins (CORS), set `VITE_BACKEND_URL=` (empty) so the app uses relative `/car` and `/tecdoc`; `vite.config.ts` proxy will forward to `https://api.autobutik.se`.

- **Production**  
  - Same env: `NEXT_PUBLIC_BACKEND_URL` / `BASE_PATH` (and, if you build with Vite, `VITE_BACKEND_URL`). No proxy in production; all requests use the configured base URL.

- **URL shape**  
  - Car endpoints: `{baseUrl}/car/dropdown/brands`, `{baseUrl}/car/categories/tree`, etc. No double slashes; `getBackendUrl()` trims a trailing slash. `BASE_PATH` is used as full origin (e.g. `https://api.autobutik.se`), not only pathname.

---

## After changes – how to verify

1. **Next.js dev**  
   - Ensure `.env.local` has `NEXT_PUBLIC_BACKEND_URL=https://api.autobutik.se` and `BASE_PATH=https://api.autobutik.se`.  
   - Restart: `npm run dev`.  
   - Open the app, trigger `getBrands` and `getCategoryTree` (e.g. car dropdown and category tree).  
   - In DevTools Network tab, requests should be to `https://api.autobutik.se/car/dropdown/brands` and `https://api.autobutik.se/car/categories/tree`. If you still see `localhost:3000`, check that `.env.local` is in the project root and that you’re running `next dev` from that root.

2. **Vite dev**  
   - Add `VITE_BACKEND_URL=https://api.autobutik.se` to `.env.local`.  
   - Run Vite (e.g. `npx vite` or your script).  
   - Same checks: `getBrands` and `getCategoryTree` should hit `https://api.autobutik.se/...`.  
   - If CORS errors appear, set `VITE_BACKEND_URL=` (empty), restart Vite, and confirm requests go to same-origin `/car/...` and are proxied (no CORS).

3. **If the backend blocks requests**  
   - Rely on the Vite proxy (empty `VITE_BACKEND_URL`) when on Vite, or ensure the backend allows your dev origin (e.g. `http://localhost:5173`) in CORS headers. No UI or flow changes are required for this.
