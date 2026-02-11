# REDUX_CLEANUP_PLAN.md — Redux Refactor (Keep Logic, Remove Duplicates)

**Hard rule:** Redux must NOT store large server datasets.

---

## 1. Reduce Redux to Allowed State

**Keep in Redux:**

- **cart** — items, totals, quantity (product snapshots in items are minimal for display; consider slimming later).
- **wishlist** — items (consider storing only ids + minimal fields in a later phase to avoid large payloads).
- **compare** — items (same as wishlist).
- **currency** — current.
- **UI state** — mobile menu (open/close), quickview (open/close + product **slug or id only**, not full product).
- **options** — desktop/mobile header variants.
- **garage** — either:
  - **Option A:** Keep Redux garage for legacy FakeVehicleApi only; store `items` (IVehicle[]), `current` (id). Do not persist full payload; persist only garage slice with ids. Or
  - **Option B:** Deprecate Redux garage; single garage = GarageContext; migrate all useGarageCurrent/useGarageSetCurrent to Context and remove Redux garage slice (see compatibility below).
- **user** — current (IUser snapshot); auth token stays in localStorage only.

**Remove from Redux (move to Apollo / Query cache / no storage):**

- **shop:** `category`, `productsList` — server data. Options/filters can stay as UI state for legacy slug route, but do not persist.
- **quickview:** full `product` object — replace with `productSlug: string | null` (or productId); resolve product from Apollo when quickview opens.
- **compare/wishlist:** if keeping in Redux, do not persist full product objects long-term; consider ids + minimal fields and resolve from cache when needed (later phase).

---

## 2. Slice-by-Slice Changes

### cart

- **Change:** None to structure. Optional: persist only whitelisted slice in new persist layer (see Persistence below).
- **Subscribers:** No change; keep using useCart, etc.

### wishlist / compare

- **Change:** Keep items in Redux. Persist only whitelisted. Optional later: store `{ id, slug, name, image? }[]` and resolve full product from Apollo/Query when needed.
- **Subscribers:** No change initially.

### currency

- **Change:** None. Whitelist persist.

### garage

- **Change:** 
  - If **Option A:** Keep slice; change persistence to whitelist only (garage in persist); ensure loadUserVehicles still runs from FakeVehicleApi for legacy.
  - If **Option B:** Add compatibility layer: selectors/hooks that read from GarageContext when available; eventually remove Redux garage and use only GarageContext. Document dependency: account/garage, CarIndicator, etc. already use GarageContext; only CurrentVehicleGarageProvider and MobileHeader use Redux garage. So: provide a single “current vehicle” source (e.g. GarageContext.currentCarId + vehicles) and have CurrentVehicleGarageProvider read from Context; then remove Redux garage or keep it only for FakeVehicleApi sync (minimal).
- **Compatibility:** useGarageCurrent() could return vehicle derived from GarageContext (current car data) mapped to IVehicle shape for legacy components until they are updated.

### mobile-menu

- **Change:** None. Whitelist persist.

### options

- **Change:** None. Whitelist persist.

### quickview

- **Change:** 
  - State: replace `product: IProduct | null` with `productSlug: string | null` (or `productId`).
  - When opening quickview: dispatch open(slug); component uses slug to fetch product from Apollo (useQuery by slug) or from a selector that reads Apollo cache.
  - Reducer: quickviewOpen(slug), quickviewClose(). No full product in state.
- **Compatibility:** useQuickview() returns { productSlug, isOpen }; consumers that need product get it from a hook that uses slug → Apollo/cache.

### shop

- **Change:** 
  - **Do not persist** shop slice.
  - **Option 1:** Keep category + productsList in Redux for legacy route `/catalog/[slug]/products` that uses getShopPageData (FakeShopApi). Do not persist; on load, state is empty; page fetches again.
  - **Option 2:** Migrate that route to TanStack Query (key e.g. `shopProductsList:{slug}:{optionsHash}`); remove category and productsList from Redux; keep only options, filters, activeFilters, currentFilters in Redux for that page’s UI. Then shop reducer holds only UI state (options, filters), and list data lives in Query cache.
- **Compatibility:** useShopProductsList() → first return from Query cache if key exists; else from Redux during migration. Or keep reading from Redux until route is fully migrated to Query, then remove.

### user

- **Change:** Keep; persist only whitelist. Token stays in localStorage; user snapshot in Redux (whitelist).

---

## 3. Persistence: Replace “Persist All” with Whitelist

**Current:** `save(store.getState())` in _app.tsx persists entire state to `localStorage['autobutik']`.

**Target:**

- **Whitelist:** Persist only: `cart`, `wishlist`, `compare`, `currency`, `options`, `mobile-menu`, `garage` (if Option A), `user`.
- **Never persist:** `shop` (category, productsList), `quickview` (or only slug), any future server-state slice.

**Implementation:**

- Option A: In `save()`, serialize only whitelisted keys:  
  `const toSave = { version, cart: state.cart, wishlist: state.wishlist, ... }; localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));`
- Option B: Use redux-persist with whitelist (e.g. `persistReducer` with whitelist: `['cart','wishlist','compare','currency','options','mobileMenu','garage','user']`). Then _app no longer calls save(store.getState()); persist layer handles load/save.

**Migration:** On first load after deploy, `load()` should merge persisted whitelist into state; ignore non-whitelisted keys from old payloads so old persisted shop/quickview are dropped.

---

## 4. Standardize Selectors (reselect)

- **Cart:** Add memoized selectors for cart totals, item count (e.g. `selectCartQuantity`, `selectCartTotal`, `selectCartItems`). Ensure they do not allocate new arrays/objects on every call (use reselect createSelector).
- **Wishlist:** `selectWishlistCount`, `selectWishlistItems`.
- **Compare:** `selectCompareCount`, `selectCompareItems`.
- **Shop:** If slice keeps only options/filters, selectors for activeFilters, currentFilters; no selector that returns large productsList (or deprecate once data is in Query cache).

---

## 5. What Moves Out of Redux

| Data | Current Location | Target | Compatibility |
|------|------------------|--------|---------------|
| Shop category | shop.category | TanStack Query or in-memory for legacy route | useShopCategory() → from cache or Redux during migration. |
| Shop productsList | shop.productsList | TanStack Query for legacy route | useShopProductsList() → from Query cache or Redux. |
| Quickview product | quickview.product | Apollo (resolve by slug when open) | useQuickview() returns slug; useQuickviewProduct(slug) from Apollo. |
| (Optional) Compare/wishlist full objects | compare/wishlist.items | Keep in Redux but persist minimal; or resolve from Apollo | Keep current API; optionally later switch to ids + resolver. |

---

## 6. Compatibility Plan for Old Code Paths

- **Legacy catalog slug route** (getShopPageData, shopInitThunk): Keep dispatching to Redux until route is migrated to data from TanStack Query. Then either remove shop category/productsList from Redux or keep Redux for options/filters only and feed list from useQuery in the page.
- **Quickview:** All call sites of useQuickview() that expect `product`: introduce useQuickviewProduct() that returns product from Apollo by slug; Quickview component uses slug from Redux + product from Apollo.
- **Garage:** If unifying on GarageContext, provide adapter: useGarageFromReduxOrContext() that reads Context first, falls back to Redux for legacy, so both paths work until Redux garage is removed.

---

## 7. Rollback Safety

- Each slice change in a separate PR.
- Feature flag or env to toggle “read from Query cache” vs “read from Redux” for shop products list if needed.
- Keep persist format versioned; on rollback, old client can still parse whitelist and ignore unknown keys.
