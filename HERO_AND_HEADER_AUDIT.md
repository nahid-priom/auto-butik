# Hero Sections, Header Components & Routes Audit

Exact component names and the routes where they are used.

---

## 1. Hero components (blocks)

| Component (exact name) | File path | Purpose |
|------------------------|-----------|--------|
| **BlockVehicleSearchHero** | `src/components/blocks/BlockVehicleSearchHero.tsx` | Homepage hero with vehicle lookup / car search form |
| **BlockVehicleHero** | `src/components/blocks/BlockVehicleHero.tsx` | Simple hero with title "Bildelar online..." and subtitle "Välj ditt fordon" (no form) |
| **BlockCatalogHero** | `src/components/blocks/BlockCatalogHero.tsx` | Catalog/category hero with `title`, optional `subtitle`, shows current vehicle |

---

## 2. Hero usage by route

| Route | Hero component(s) |
|-------|--------------------|
| `/` (home) | **BlockVehicleSearchHero** |
| `/catalog` | **BlockCatalogHero** |
| `/catalog/[slug]` | **BlockCatalogHero** |
| `/catalog/[slug]/products` | **BlockCatalogHero** |
| `/catalog/products` | **BlockVehicleHero** |
| `/catalog/products/[carModelID]` | **BlockVehicleHero** |

---

## 3. Page header block (breadcrumb / title)

| Component (exact name) | File path | Purpose |
|------------------------|-----------|--------|
| **BlockHeader** | `src/components/blocks/BlockHeader.tsx` | Page title + breadcrumb; props: `pageTitle`, `breadcrumb`, `afterHeader` |

---

## 4. BlockHeader usage by route

| Route | Uses BlockHeader |
|-------|------------------|
| `/wishlist` | ✓ |
| `/compare` | ✓ |
| `/cart` | ✓ |
| `/cart/checkout` | ✓ |
| `/blog` | ✓ |
| `/catalog` | ✓ (with BlockCatalogHero) |
| `/catalog/[slug]` | ✓ (with breadcrumb) |
| `/catalog/[slug]/products` | ✓ |
| `/catalog/products` | ✓ (with BlockVehicleHero) |
| `/catalog/products/[carModelID]` | ✓ |
| `/demo/site/contact-us-v1` | ✓ |
| `/demo/site/contact-us-v2` | ✓ |
| `/demo/site/components` | ✓ |
| `/demo/car-search-history` | ✓ |

Also used inside: `ShopPageShop`, `ShopPageProduct`, `ShopPageCategory`, `BlogPageCategory` (layout-dependent).

---

## 5. Site-wide header (layout)

| Component (exact name) | File path | Purpose |
|------------------------|-----------|--------|
| **Header** | `src/components/header/Header.tsx` | Desktop site header (logo, nav, search, cart, account) |
| **MobileHeader** | `src/components/mobile/MobileHeader.tsx` | Mobile site header |

Both are rendered in **Layout** (`src/components/Layout.tsx`):

- `site__mobile-header` → `<MobileHeader />`
- `site__header` → `<Header />`

Layout is used app-wide via `_app.tsx`, so these headers appear on every page.

---

## 6. Header subcomponents (desktop)

All under `src/components/header/`:

| Component | File | Role |
|-----------|------|------|
| **Header** | `Header.tsx` | Main desktop header container |
| **MainMenu** | `MainMenu.tsx` | Top-level nav (uses `desktopHeaderLayout`) |
| **Megamenu** | `Megamenu.tsx` | Mega menu content |
| **MegamenuLinks** | `MegamenuLinks.tsx` | Mega menu links |
| **Departments** | `Departments.tsx` | Departments dropdown (uses `dataHeaderDepartments`) |
| **Topbar** | `Topbar.tsx` | Top bar |
| **Logo** | `Logo.tsx` | Site logo |
| **Search** | `Search.tsx` | Header search (vehicle/product) |
| **AccountMenu** | `AccountMenu.tsx` | Account dropdown |
| **CarIndicator** | `CarIndicator.tsx` | Current vehicle in header |
| **Dropcart** | `Dropcart.tsx` | Cart dropdown |
| **Dropdown** | `Dropdown.tsx` | Generic dropdown |
| **DropdownCurrency** | `DropdownCurrency.tsx` | Currency selector |
| **DropdownLanguage** | `DropdownLanguage.tsx` | Language selector |
| **Indicator** | `Indicator.tsx` | Icon + label indicator |
| **Menu** | `Menu.tsx` | Menu UI |

---

## 7. Section header (in-page blocks)

| Component (exact name) | File path | Purpose |
|------------------------|-----------|--------|
| **SectionHeader** | `src/components/shared/SectionHeader.tsx` | Section title + optional tabs/arrows (e.g. carousels); not a page header |

Used by: `BlockProductsCarousel`, `BlockPosts`, etc.

---

## 8. Header variants (options)

From `src/store/options/optionsTypes.ts` and `config.ts`:

- **desktopHeaderVariant**: `'classic/one'` | `'classic/two'` | … | `'classic/five'` | `'spaceship/one'` | `'spaceship/two'` | `'spaceship/three'`
- **desktopHeaderLayout**: `'classic'` | `'spaceship'`
- **desktopHeaderScheme**: `'one'` … `'five'`
- **mobileHeaderVariant**: `'one'` | `'two'`

Demo routes for header variants:

- `/demo/header-classic-variant-one` … `header-classic-variant-five`
- `/demo/header-spaceship-variant-one` … `header-spaceship-variant-three`
- `/demo/mobile-header-variant-one`, `/demo/mobile-header-variant-two`

---

## 9. Summary table: routes → hero & page header

| Route | Hero | Page header (BlockHeader) |
|-------|------|---------------------------|
| `/` | BlockVehicleSearchHero | — |
| `/catalog` | BlockCatalogHero | BlockHeader |
| `/catalog/[slug]` | BlockCatalogHero | BlockHeader |
| `/catalog/[slug]/products` | BlockCatalogHero | BlockHeader |
| `/catalog/products` | BlockVehicleHero | BlockHeader |
| `/catalog/products/[carModelID]` | BlockVehicleHero | BlockHeader |
| `/cart`, `/cart/checkout`, `/wishlist`, `/compare`, `/blog` | — | BlockHeader |

All pages use the same **Header** and **MobileHeader** from Layout unless the page uses a different layout (e.g. account).
