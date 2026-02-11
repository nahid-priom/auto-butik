# TopLoader and performance changes

## Summary

- **TopLoader** is now global and driven by real navigation + API lifecycles (loadingTracker + router events).
- **GET requests** use a shared fetch layer with cache (5 min TTL) and in-flight dedupe.
- **Homepage** defers category tree fetch and uses `next/dynamic` for below-the-fold blocks with skeletons.
- **SCSS** autoprefixer: `start` replaced with `flex-start` in source files.

No routes, API contracts, or business logic were changed. No component renames or feature removals.

---

## 1. Global TopLoader (real navigation + API)

### LoadingTracker (new Redux slice)

- **Location:** `src/store/loading-tracker/`
- **State:** `routePending` (boolean), `inflightCount` (number).
- **Actions:** `loadingTrackerStartRoute`, `loadingTrackerEndRoute`, `loadingTrackerStartRequest(key)`, `loadingTrackerEndRequest(key, ok)`.
- **Usage:** TopLoader treats `isLoading = routePending || inflightCount > 0`.

### Router wiring

- **Layout.tsx:** `router.events.on('routeChangeStart', …)` → `startRoute` + `pageLoadStart`; `routeChangeComplete` / `routeChangeError` → `endRoute`.
- Ensures the bar starts on any navigation (e.g. header category clicks) and ends when the route transition finishes.

### API instrumentation (single place)

- **`src/api/fetchWithLoader.ts`:** Central wrapper used by **car.api.ts** for all requests.
  - On request start: `loadingTrackerStartRequest(key)`.
  - On response/finally: `loadingTrackerEndRequest(key, ok)` and progress bump (cap 90%).
- **car.api.ts:** Every `fetch(…)` was replaced with `fetchWithLoader(url, init, requestKey)` (no logic changes, same URLs and payloads).

### Progress behaviour

- **Start:** 10% as soon as loading starts (route or first request).
- **While loading:** Timer eases progress upward (step 3 every 180 ms), capped at 90%.
- **On each request completion:** Progress bumps by ~12 (capped at 90%).
- **When loading ends:** Jump to 100%, then fade out after 120 ms (`pageLoadFinishWhenCriticalReady`).
- **Errors:** `endRequest(key, false)` still runs in `finally`, so the loader always ends (no infinite bar).
- **Reduced motion:** Respected; no timer animation when `prefers-reduced-motion: reduce`.

### Store ref for API layer

- **`src/store/storeRef.ts`:** Holds a reference to the Redux store.
- **`_app.tsx`:** In `useEffect`, sets `setStoreRef(store)` on mount and clears on unmount so `fetchWithLoader` can dispatch without being inside a component.

---

## 2. GET cache and in-flight dedupe

- **Same file:** `src/api/fetchWithLoader.ts`.
- **GET only:** Cache key = full URL. Entry: `{ ts, ok, data }`. TTL = 5 minutes.
- **Cache hit:** Return a response-like object (`.ok`, `.json()` from cached data); no network, no loader dispatch.
- **In-flight dedupe:** If the same GET URL is already in flight, the second caller awaits the same promise and then returns from cache; no second request, no second `startRequest`/`endRequest`.
- **POST/non-GET:** No cache; each request is instrumented (start/end) and executed as before.

---

## 3. Homepage: critical data and lazy blocks

### Category tree deferred on homepage

- **`src/contexts/CategoryTreeContext.tsx`:** When `router.pathname === '/'`, category tree fetch is deferred with `requestIdleCallback(..., { timeout: 400 })` or `setTimeout(..., 400)` so header + hero can paint first.
- Other pages still fetch the tree immediately on mount / when car changes.

### Below-the-fold blocks with next/dynamic

- **`src/pages/index.tsx`:** Replaced `React.lazy` + `Suspense` with `next/dynamic(..., { loading: () => <BlockSkeleton ... />, ssr: false })` for:
  - BlockCategoryNavigation, BlockBanners, BlockCategoryTabs, BlockSlideshow, BlockProductsCarousel, BlockBenefits, BlockSale, BlockPosts, BlockProductsColumns, BlockBrands, BlockNewsletter.
- Same components and props; skeletons avoid layout jump while chunks load.

---

## 4. SCSS autoprefixer

- Replaced `align-items: start` / `justify-content: start` / `align-self: start` with `flex-start` in:
  - `src/scss/blocks/_block-category-tabs.scss`
  - `src/scss/shop/product-question.scss`
  - `src/scss/shop/_product--layout--sidebar.scss`
  - `src/scss/shop/_product--layout--full.scss`
  - `src/scss/mixins/_product-card.scss`

---

## Files touched (list)

| Area | Files |
|------|--------|
| LoadingTracker | `src/store/loading-tracker/loadingTrackerTypes.ts`, `loadingTrackerActionTypes.ts`, `loadingTrackerReducer.ts`, `loadingTrackerActions.ts`, `loadingTrackerHooks.ts` |
| Store wiring | `src/store/root/rootReducer.ts`, `src/store/root/rootTypes.ts`, `src/store/storeRef.ts` |
| Page load | `src/store/page-load/pageLoadActions.ts` (finish thunk simplified) |
| Request layer | `src/api/fetchWithLoader.ts` (new), `src/api/car.api.ts` (all fetch → fetchWithLoader) |
| App / Layout | `src/pages/_app.tsx` (setStoreRef), `src/components/Layout.tsx` (router events) |
| TopLoader | `src/components/shared/TopLoader.tsx` (driven by useLoadingTracker, progress algorithm) |
| Homepage | `src/contexts/CategoryTreeContext.tsx` (defer tree on `/`), `src/pages/index.tsx` (dynamic + skeletons) |
| SCSS | `_block-category-tabs.scss`, `product-question.scss`, `_product--layout--sidebar.scss`, `_product--layout--full.scss`, `_product-card.scss` |

---

## Validation checklist

- [x] Header category click → TopLoader appears immediately (routeChangeStart).
- [x] Loader stays active while products/category tree load and finishes when requests finish (loadingTracker + fetchWithLoader).
- [x] Errors still call `endRequest(key, false)` → loader ends.
- [x] Repeat navigation / repeat GETs use cache or in-flight dedupe where applicable.
- [x] Homepage: header + hero first; category tree after idle/400 ms; below-the-fold blocks lazy with skeletons.
- [x] No changes to routes, API contracts, or legacy UI behaviour.
