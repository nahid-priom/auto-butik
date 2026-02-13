# Position Filter – Audit Report

**Scope:** Position (Placering) filter on catalog product pages.  
**Routes in codebase:** `/catalog/[slug]/products` and `/catalog/products` (equivalent to “/category/[id]/products” and “/category/products”).  
**Audit date:** 2025-02-13.  
**Status:** Audit only – no refactor performed, no legacy behavior changed.

---

## 1) Component Location & Identification

### Routes and page files

| Route | Page file | Main content | Sidebar |
|-------|-----------|--------------|---------|
| `/catalog/[slug]/products` (e.g. category by id/slug) | `src/pages/catalog/[slug]/products.tsx` | `VehicleProductsView` (with `useCatalogLayout=true`) | `CatalogFiltersSidebar` (desktop) / `ShopSidebar` with `contentOverride={<CatalogFiltersDrawerContent />}` (mobile drawer) |
| `/catalog/products` (no slug) | `src/pages/catalog/products.tsx` | `VehicleProductsView` or `GraphQLProductsView` or `SearchProductsView` (when `useCatalogLayout=true`) | Same: `CatalogFiltersSidebar` + drawer override |

### Two distinct Position filter UIs

1. **Sidebar Position filter (checkbox list)**  
   - **Component:** `WidgetPositionFilter`  
   - **File:** `src/components/widgets/WidgetPositionFilter.tsx`  
   - **Rendered on both target pages** inside:
     - **Desktop:** `CatalogFiltersSidebar` → `src/components/catalog/CatalogFiltersSidebar.tsx` (includes `WidgetPositionFilter`).
     - **Mobile:** Same filters inside `ShopSidebar` via `contentOverride={<CatalogFiltersDrawerContent title={...} />}` (which renders `CatalogFiltersSidebar` embedded).  
   - **Parent chain:**  
     `Page` → `PageContent` → `pageStyles.layout` → `sidebarCol` → `CatalogFiltersSidebar` → `body` → `WidgetPositionFilter`.

2. **Main-content Position buttons (card-style grid)**  
   - **Component:** Inline block in `VehicleProductsView` (no separate component).  
   - **File:** `src/components/shop/VehicleProductsView.tsx` (lines 356–404).  
   - **DOM:** `.products-view__positions` → `.products-view__positions-list` with `.products-view__position-button` items (car image + label; ~6–8 options: VL, VR, HL, HR, VD, HD, VG, HG).  
   - **Visibility:** Rendered only when `positionButtons.length > 0 && !useCatalogLayout`.  
   - **On the two audited routes:** `useCatalogLayout` is always `true`, so **this card grid is not shown** on `/catalog/[slug]/products` or `/catalog/products`. It **does** show on `/catalog/products/[carModelID]` (VehicleProductsView without `useCatalogLayout`).

**Summary for “Position filter on /category/[id]/products and /category/products”:**

- The **only** Position filter on those two pages is **WidgetPositionFilter** in the sidebar (checkbox list with search).  
- The **card-style grid** of position buttons lives in **VehicleProductsView** and is **hidden** on those two pages; it appears on `/catalog/products/[carModelID]`.

| Component | File | Shows on `/catalog/[slug]/products` | Shows on `/catalog/products` | Card-style grid? |
|-----------|------|-------------------------------------|------------------------------|------------------|
| WidgetPositionFilter | `src/components/widgets/WidgetPositionFilter.tsx` | Yes (sidebar) | Yes (sidebar) | No (list) |
| VehicleProductsView position buttons | `src/components/shop/VehicleProductsView.tsx` | No (`useCatalogLayout`) | No | Yes (when visible) |

---

## 2) Data Flow (No Changes)

### Source of Position items

- **WidgetPositionFilter:**  
  - Uses `facets?.positions ?? []` from `useVehicleCatalogContext()`.  
  - `facets` is set in `VehicleProductsView` (and any consumer of `useVehicleCatalog`) from the **products API response** when that response was fetched **without** brand or position filters (`lastFetchBrand === undefined && lastFetchPosition === undefined`).  
  - So position options come from **server response facets** (`productsResponse.facets.positions`), not URL, not static config.  
- **VehicleProductsView position buttons:**  
  - Same `facets?.positions` from context, then **filtered and mapped** by a fixed allowlist `POSITION_BUTTONS` (VL, VR, HL, HR, VD, HD, VG, HG) in `VehicleProductsView.tsx`. Order follows facet order, but only these codes are shown; labels can be overridden with Swedish from `POSITION_BUTTONS`.

**Input data shape (facets):**

- From `~/api/car.api`: `IVehicleProductsFacets.positions` → `IVehicleProductFacetPosition[]`: `{ value: string; label: string; count: number }`.

### Selection behavior

- **Single select.**  
  - WidgetPositionFilter: `handlePositionChange(value, checked)` → `setSelectedPosition(checked ? value : null)`. One position at a time; checking another effectively replaces (checkbox is single-select in practice).  
  - VehicleProductsView buttons: `setSelectedPosition(isActive ? null : pos.code)` – toggle on/off, single value.  
- **Clear/reset:**  
  - “Rensa” in sidebar: `ShopSidebar` `handleRensa` calls `setSelectedPosition(null)` and `setSelectedBrand(null)`.  
  - Category change: `VehicleProductsView` effect on `[collectionId, collectionSlug, ...]` calls `setSelectedPosition(null)` and `setSelectedBrand(null)`.  
- **Default:** `selectedPosition` initial state in `VehicleCatalogContext` is `null` (no default selection).

### Where selection state lives

- **VehicleCatalogContext** (React state): `selectedPosition`, `setSelectedPosition`.  
- **Not in URL:** Position is not synced to query params.  
- **Not in Redux/router state** for position.  
- Provider: `VehicleCatalogProvider` in `_app.tsx` wraps the app, so position filter state is app-wide and shared by sidebar widget and main content when both are present.

### Output events / state changes

- **WidgetPositionFilter:** Calls `setSelectedPosition(value | null)` from context.  
- **VehicleProductsView:** Same.  
- **useVehicleCatalog** (used by VehicleProductsView) reads `position: selectedPosition ?? undefined` and passes it to `carApi.getProductsForVehicle(..., { ..., position })`. So changing position triggers a new products fetch; no URL updates.

### URL sync

- **None.** Position (and brand) are context-only; they are not read from or written to the URL. Collection/category is URL-driven (`collectionId` / `collectionSlug` from `router.query`).

---

## 3) UI + Layout Issues (Visual + DOM)

### WidgetPositionFilter (sidebar – the one on the audited pages)

**Screens / viewport:**

- **Desktop:** Rendered in left sidebar column (e.g. `CatalogFiltersSidebar`), width 280px–300px. List is vertical; no grid.  
- **Tablet/Mobile:** Same widget inside offcanvas drawer; list scrolls inside `.widget-position-filter__list` (max-height 280px).  
- **Embedded (drawer):** `CatalogFiltersSidebar.module.scss` increases tap targets (e.g. min-height 44px for title row and items in `embedded`).

**Issues identified:**

| Issue | Severity | Notes |
|-------|----------|--------|
| Checkbox is single-select but uses `type="checkbox"` | Minor | Semantically “one of many”; could be `type="radio"` or `role="radio"` for clarity. No change recommended until post-audit refactor. |
| Focus on custom checkmark | Minor | Focus goes to the (visually hidden) native checkbox; `:focus + .widget-position-filter__checkmark` shows ring. Ensure keyboard users can reach all options (no trap observed). |
| “Placering” hardcoded | Minor | Title is hardcoded; other widgets use FormattedMessage. |
| Search “Sök” / “Inga platser hittades” hardcoded | Minor | Not wrapped in i18n. |
| Collapsed state not persisted | Minor | `collapsed` is local useState; refreshes/resize don’t persist. |
| Scrollbar in list | Minor | Custom webkit scrollbar; fine. Max-height 280px can clip many positions on small viewports. |
| Duplicate filter guard (dev) | Info | `CatalogFiltersSidebar` runs a dev-only duplicate filter group check; no production impact. |

**DOM/CSS suspects:**

- Classnames: `widget-position-filter`, `widget-position-filter__list`, `widget-position-filter__item`, etc. (BEM).  
- Layout: `.widget-position-filter__list` is flex column (implicit); items are flex row (icon + label).  
- Overflow: `.widget-position-filter__list` has `overflow-y: auto`, `overflow-x: hidden`, `max-height: 280px`.  
- Card styling: root uses `@include card` in `_widget-position-filter.scss`; in catalog sidebar, `.root :global(.widget-position-filter)` resets margin/padding/border/box-shadow so it doesn’t look like a separate card.

### VehicleProductsView position buttons (card-style grid – not visible on audited routes)

**Screens / viewport:**

- Only when `!useCatalogLayout` (e.g. `/catalog/products/[carModelID]`).  
- `.products-view__positions-list`: `display: flex; flex-wrap: wrap; gap: 8px`.  
- Each button: `width: 320px`, so effectively a small grid of wide cards.  
- **Responsive:** No media query in `_products-view.scss` that changes positions layout; fixed 320px can overflow on small screens.

**Issues identified:**

| Issue | Severity | Notes |
|-------|----------|--------|
| Fixed button width 320px | Major | On narrow viewports (e.g. mobile), horizontal space may be insufficient; risk of overflow or awkward wrap. |
| No breakpoint-specific rules for positions | Major | `.products-view__positions` has no `@include media-breakpoint-down(...)`; pagination does. |
| Whole button is clickable | OK | `<button>` wraps icon + label; no “only text clickable” issue. |
| Hover/active | OK | `.products-view__position-button:hover` and `--active` with theme border/shadow. |
| Keyboard | OK | Native `<button>` elements; focusable. |
| Focus visible | Minor | No explicit `:focus-visible` style; relies on default outline. |
| Car image path | Info | `/images/car-filter.jpg`; ensure asset exists in build. |

**DOM/CSS suspects:**

- `.products-view__positions`, `.products-view__positions-list`, `.products-view__position-button` (BEM in `_products-view.scss`).  
- `.block-split--catalog .products-view .products-view__positions` only adjusts margin/padding/border-radius; this block is not visible when positions are shown (catalog layout hides the block).  
- Marker positions: inline `style={{ left: `${m.x*100}%`, top: `${m.y*100}%` }}` for dots on car image.

---

## 4) Interaction & Filtering Consistency

### Same pipeline as other filters

- **Yes.** Position uses the same flow as brand:
  - Stored in `VehicleCatalogContext` (`selectedPosition` / `setSelectedPosition`).
  - Passed into `useVehicleCatalog({ ..., position: selectedPosition ?? undefined })` → `carApi.getProductsForVehicle(..., { position })`.
  - Facets are updated only from responses that were fetched without brand/position so the sidebar reflects “all” options for the current collection.

### Loading / skeleton

- When position (or brand) changes, `useVehicleCatalog` refetches; `productsLoading` becomes true.  
- **Catalog layout:** VehicleProductsView shows `CatalogProductRowCardSkeleton` (12 items) while `isLoading`. So the position filter does trigger the same loading UX as other filters.

### Pagination and position change

- **Issue:** In `VehicleProductsView`, `page` is local state and is **not** reset when `selectedPosition` or `selectedBrand` changes. So if the user is on page 3 and then selects a position that has only 2 pages of results, the request is still `skip=(3-1)*12`, which can return an empty or misleading page.  
- **Severity:** Major for consistency (other flows often reset to page 1 on filter change).  
- **Recommendation (post-audit):** Consider resetting `setPage(1)` when `selectedPosition` or `selectedBrand` changes (e.g. in a `useEffect` or inside the handlers that call `setSelectedPosition` / `setSelectedBrand`). Not implemented in this audit.

### Conflicts with other filters

- **No double state:** Single source of truth is `VehicleCatalogContext`; sidebar and main content both read/write the same state.  
- **No duplicate query keys:** Position is not in the URL; no risk of query key clash with collectionId/collectionSlug.  
- **Stale selection:** When collection changes, the effect in VehicleProductsView clears `selectedPosition` (and `selectedBrand`), so no stale position across categories.  
- **Top bar:** CatalogTopControls receives `filterCount={(selectedBrand ? 1 : 0) + (selectedPosition ? 1 : 0)}` and shows a badge; consistent with sidebar state.  
- **Sorting:** Sort is “popularity” and not stored in context; no interaction conflict with position.

---

## 5) Deliverables Summary

### Component location

- **Position filter on `/catalog/[slug]/products` and `/catalog/products`:**
  - **WidgetPositionFilter** in **CatalogFiltersSidebar** (and in mobile drawer via ShopSidebar contentOverride).  
  - File: `src/components/widgets/WidgetPositionFilter.tsx`.  
- **Card-style position grid:** Implemented inside **VehicleProductsView** (`src/components/shop/VehicleProductsView.tsx`), but **not rendered** on the two audited routes because `useCatalogLayout === true` there. It is visible on `/catalog/products/[carModelID]`.

### Data flow

- **Input:** `facets.positions` from VehicleCatalogContext, populated from products API response (when that response is unfiltered by brand/position).  
- **Output:** `setSelectedPosition(value | null)`; `useVehicleCatalog` passes `position` to the API and refetches.  
- **State:** React context only; no URL sync.  
- **Order:** As returned by API for sidebar; for the (hidden) card grid, order from API but filtered by POSITION_BUTTONS allowlist.

### UI/UX issues (priority)

1. **Major:** Pagination not reset when position (or brand) changes in VehicleProductsView – can show empty or wrong page.  
2. **Major (non-audited routes):** VehicleProductsView position buttons use fixed width 320px and have no responsive rules – risk on small viewports where that block is shown.  
3. **Minor:** Sidebar – hardcoded strings, checkbox vs single-select semantics, focus-visible, collapsed state not persisted.  
4. **Minor:** Card grid – no explicit `:focus-visible` for buttons.

### Suggested UI-only refactor plan (optional; do not implement yet)

- **WidgetPositionFilter:**  
  - Add i18n for “Placering”, “Sök”, “Inga platser hittades”.  
  - Consider radio semantics or aria for single-select.  
  - Optionally persist collapse state (e.g. localStorage) and improve focus-visible styles.  
- **VehicleProductsView position block (when visible):**  
  - Add responsive rules (e.g. full width or reduced width on small breakpoints).  
  - Add `:focus-visible` for keyboard users.  
- **VehicleProductsView (behavior, post-audit):**  
  - Reset `page` to 1 when `selectedPosition` or `selectedBrand` changes so pagination stays consistent with filter state.

---

## Acceptance Criteria Check

- The audit identifies the Position filter component(s) and their dependencies: **Yes** (WidgetPositionFilter + VehicleProductsView position block; context, useVehicleCatalog, carApi).  
- No refactor performed before audit output: **Yes** (audit only).  
- No legacy filter logic altered: **Yes** (no code changes).  
- Audit covers both behavior and UI for both pages: **Yes** (data flow, state, URL, UI issues, and consistency with other filters and pagination).
