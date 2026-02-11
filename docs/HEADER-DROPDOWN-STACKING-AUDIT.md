# Header dropdown stacking – audit and fix summary

## Why dropdowns were hidden or clipped

### 1. **Low root stacking**
- **`.site__header`** had `z-index: 100`. Page content (hero blocks, carousels, etc.) can use `position` + `z-index` or `transform`, creating stacking contexts that painted above the header.
- **`.header`** had `z-index: 10` (classic and spaceship). Dropdowns lived inside this context, so their own z-index only competed inside the header, not with the rest of the page.

Result: Any block with a stacking context (e.g. hero with `position: relative` and `z-index: 1`) could appear above the header or its dropdowns depending on paint order and stacking.

### 2. **Ancestor overflow clipping**
- **`.header__navbar`** (spaceship and classic) had `overflow: hidden` for the sticky-compact scroll animation (collapsing topbar/navbar).
- The “Handla efter kategori” mega menu (departments dropdown) is inside `.header__navbar-departments` → `.header__navbar`. So when the menu opened, it was clipped by that `overflow: hidden`.

Result: The departments mega menu was cut off at the bottom of the navbar instead of overlaying the hero/content.

### 3. **Dropdown z-index too low**
- **Departments menu**: `.departments__menu` had `z-index: 1`.
- **Indicator dropdowns** (account, cart): `.indicator__content` had `z-index: 1` when open.
- **Main menu / megamenu**: `.main-menu__submenu` had `z-index: 1` (main-menu) or `z-index: 1000` (megamenu override).
- **Topbar menus**: `.topbar__menu-body` had `z-index: 1`.
- **Search**: `.search__dropdown` had no z-index (auto).

Result: Even with a higher header z-index, dropdowns could stack below other header UI or any sibling with a set z-index.

### 4. **No single z-index scale**
- z-index values were ad hoc (1, 10, 100, 1000). No shared scale for header vs dropdown vs modal vs toast made it easy for new components to break layering.

---

## Fixes applied (CSS/styling only)

### A) Z-index scale (single source of truth)
- **`_variables.scss`**: Added `$z-header: 2000`, `$z-dropdown: 3000`, `$z-modal: 4000`, `$z-toast: 5000`.
- **`_site.scss`**: `.site` now sets CSS custom properties `--z-header`, `--z-dropdown`, `--z-modal`, `--z-toast` for reuse (e.g. JS or other CSS).
- **`.site__header`**: `z-index` set to `$z-header` (2000) so the whole header (and its dropdowns) stays above body content.
- **`.header`** (classic and spaceship): `z-index` set to `$z-header` so the header bar is in the same high layer.

### B) Dropdown z-index
All header dropdown/overlay layers use `$z-dropdown` (3000) so they sit above the header bar and page:
- **Departments**: `.departments__menu` → `z-index: $z-dropdown`
- **Indicator content** (account menu, dropcart): `.indicator__content` when open → `z-index: $z-dropdown`
- **Main menu**: `.main-menu__submenu` (menu and megamenu) → `z-index: $z-dropdown`
- **Megamenu**: `.main-menu__submenu` (megamenu) → `z-index: $z-dropdown`
- **Topbar**: `.topbar__menu-body` → `z-index: $z-dropdown`
- **Search**: `.search__dropdown` → `z-index: $z-dropdown`

### C) Clipping (overflow)
- **`_header--sticky-compact.scss`**:  
  - **Classic**: `overflow: hidden` removed from `.header__navbar`; kept on `.header__topbar-classic-bg` and `.header__topbar-classic`.  
  - **Spaceship**: `overflow: hidden` on `.header__navbar` changed to `overflow: visible` so the departments (and any other navbar) dropdown is not clipped. Compact state still uses `max-height: 0`, `opacity: 0`, `visibility: hidden` so the row disappears without needing to clip.

No structural or DOM changes; no portals added. Dropdowns remain in place and are no longer clipped by the navbar.

### D) Dropdown height and scroll
Each dropdown (or its scrollable area) now has:
- `max-height: min(70vh, 600px)`
- `overflow-x: hidden`
- `overflow-y: auto` (where it makes sense)

Applied to:
- **Departments**: `.departments__body`, `.departments__list`, `.departments__megamenu`
- **Search**: `.search__dropdown`
- **Topbar**: `.topbar__menu-body`
- **Account menu**: `.account-menu`
- **Dropcart**: `.dropcart`
- **Megamenu**: `.main-menu__megamenu` (and kept overflow-y on inner columns where already present)

Long lists scroll inside the dropdown and stay within the viewport; no horizontal overflow.

---

## Validation checklist

- [x] Mega menu (“Handla efter kategori”) overlays hero and page content.
- [x] Account dropdown overlays hero/content.
- [x] Vehicle selector (in search) and search suggestions use same dropdown layer (search dropdown).
- [x] Cart (dropcart) overlays hero/content.
- [x] Topbar dropdowns (e.g. language/currency) use `$z-dropdown`.
- [x] No dropdown clipped by header or navbar (overflow: visible on navbar).
- [x] Long dropdowns scroll internally (max-height + overflow-y: auto).
- [x] Z-index scale defined and used consistently; CSS vars on `.site` for future use.

Routes, URLs, component names, and business logic are unchanged. Only CSS (z-index, overflow, max-height, transitions) was modified.
