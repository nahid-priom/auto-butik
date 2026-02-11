# PERF_CHECKLIST.md — Next.js Performance + UX (Safe, No Behavior Change)

Improvements that do not change business logic. Metrics to track before/after.

---

## 1. Prefetch Product Detail on Hover / Viewport

- **What:** Prefetch product data (Vendure + optional TecDoc) when user hovers over a product card or when card enters viewport (IntersectionObserver).
- **How:** Use Next.js `router.prefetch('/products/[slug]')` for the route; and/or trigger Apollo query or TanStack Query prefetch for that slug/productId so when user clicks, data is already in cache.
- **Validation:** No change to visible behavior; faster TTI on product page after click.

---

## 2. Virtualize Product Lists When > 100 Items

- **What:** For vehicle product list and search results, use a virtual list (e.g. react-window, TanStack Virtual) when the list has more than ~100 items so only visible rows are rendered.
- **Where:** VehicleProductsView, SearchProductsView, any page that renders long product grids.
- **Validation:** Same scroll height and item count; no layout shift; keyboard/a11y preserved.

---

## 3. Avoid SSR of Deep-Filter Pages Unless Cached

- **What:** Category/product list pages that depend on many filters or vehicle context: prefer client-side fetch (TanStack Query) instead of getServerSideProps so server isn’t doing heavy work per request. Use getServerSideProps only when response can be cached (e.g. static category tree for a given modelId with short TTL) or when SEO requires it.
- **Current:** getShopPageData runs on server for catalog [slug]/products (FakeShopApi). Vehicle-scoped lists are already client-side (useVehicleCatalog).
- **Action:** Document which pages are SSR vs client; for new vehicle-scoped lists, keep client-side; for legacy slug route, consider moving to client + Query cache to reduce server load.

---

## 4. Reduce Hydration Work

- **Keep Redux small:** After REDUX_CLEANUP_PLAN (no large server datasets in Redux), initial state and rehydration are smaller → less JSON parse and less React tree to hydrate.
- **Remove massive persisted payloads:** Whitelist persistence so shop.productsList, compare/wishlist full objects (if large), and quickview product are not in localStorage → smaller load() and fewer re-renders on restore.
- **Metrics:** Measure JS heap after load (e.g. performance.memory if available), and time to interactive (TTI) before/after.

---

## 5. Consistent Loading States

- **Apollo + TanStack Query:** Use same loading/skeleton pattern for:
  - Product detail (Vendure)
  - TecDoc block
  - Vehicle product list
  - Category tree
- **Validation:** No flash of empty content; loading state shown until data is ready.

---

## 6. Measurable Metrics

| Metric | How to measure | Target |
|--------|----------------|--------|
| **localStorage size** | `JSON.stringify(localStorage).length` or measure `autobutik` key size | Reduced after persist whitelist (no shop, no full quickview). |
| **JS heap after load** | Chrome DevTools Memory, or performance.memory.usedJSHeapSize | Lower after removing large Redux payloads and persisted shop. |
| **Rerenders on category browse** | React DevTools Profiler or count of component renders when changing category | Fewer rerenders when list comes from Query cache (stable references). |
| **TTFB / TTI** | Lighthouse or Web Vitals (LCP, FID, CLS) | Improve TTI by prefetch and smaller hydration; TTFB can improve if fewer heavy SSR requests. |
| **Product page TTI** | Time from navigation to product page until interactive | Improved with prefetch on hover/viewport. |

---

## 7. Checklist Summary

- [ ] Prefetch product route + data on card hover/viewport.
- [ ] Virtualize long product lists (> 100 items).
- [ ] Prefer client fetch for vehicle-scoped lists; avoid heavy SSR unless cached.
- [ ] Reduce hydration: small Redux, whitelist persist, no large payloads in localStorage.
- [ ] Consistent loading states for Apollo and TanStack Query.
- [ ] Measure: localStorage size, heap, rerenders, TTFB/TTI before and after changes.
