# Header Category Dropdown (“Handla efter kategori”) – Audit & Modernization

## Audit Summary

### Components Responsible

| Role | Component / File | Notes |
|------|------------------|--------|
| **Trigger** | `Departments.tsx` – button with `label` (BUTTON_DEPARTMENTS_LONG) | Renders "Handla efter kategori" in classic layout. |
| **Menu container** | `Departments.tsx` – `.departments__menu`, `.departments__body` | Wraps L1 list + megamenu container. |
| **L1 list** | `Departments.tsx` – `ul.departments__list` + `dataHeaderDepartments` | Left column: top-level categories. |
| **L2/L3 column layout** | `Megamenu.tsx` inside `.departments__menu-container` | L2 = `.main-menu__megamenu-left` (.mm-cat), L3 = `.main-menu__megamenu-right` (.mm-blocks-grid). |
| **Category item rendering** | `Megamenu.tsx` – mm-cat (L2), mm-item (L3), `AppImage` / `AppLink` | Icons/images from `customFields.image` or fallback. |

### Data Source

- **Current:** Static `dataHeaderDepartments` from `~/data/headerDepartments.ts` (IDepartmentsLink[]).
- **Not used here:** CategoryTreeContext / `buildHeaderCategoryMenuFromApiTree` are used by **MainMenu** (navbar links) and mobile menu, not by the Departments dropdown.
- **Per rules:** Data source and API contracts were not changed; only layout, styling, and behavior were updated.

### Event Handling (Before → After)

| Behavior | Before | After |
|----------|--------|--------|
| Open/close | Click button; outside click (useGlobalMousedown) | Same + **ESC closes** (keydown listener). |
| Hover | L1 hover sets `currentItem`; body mouse leave clears | Unchanged; no delayed hover added. |
| Focus | Default outline on button | **aria-expanded, aria-haspopup, aria-controls** on button; **role="menu"** on panel; **role="menuitem"** on L1 links; **focus-visible** ring (theme accent) on button and L1 links. |
| Keyboard | Tab into button/links | Tab order unchanged; **ESC** closes. |

### What Was Wrong / Improved

1. **Container:** No max-width/max-height; could feel oversized.  
   → **Fixed:** max-width 1200px (1100px on xl), max-height 70vh, padding 12–16px, border-radius 12px, subtle border and shadow.

2. **L1 list:** Generic padding and no hierarchy.  
   → **Fixed:** Compact row height (~40–44px), truncation with ellipsis, `title` for full name on hover, left **accent bar** (theme red) on hover/active.

3. **Megamenu (L2/L3):** Same styles as main-menu megamenu; not tuned for dropdown.  
   → **Fixed:** In `.departments .departments__megamenu`: fixed L2 width 240px, scrollable columns, compact L3 grid (6 cols), 72px thumb, 2-line labels, dividers, hover/active with theme accent.

4. **Accessibility:** No ESC, minimal ARIA.  
   → **Fixed:** ESC closes; button and menu have ARIA; focus-visible ring on button and L1 links.

5. **Performance:** Handlers recreated each render; images always eager.  
   → **Fixed:** Departments handlers wrapped in `useCallback`; Megamenu `handleLeftCategoryClick` in `useCallback`; **loading="lazy"** on megamenu images.

---

## Patch List (Files Touched)

| File | Changes |
|------|---------|
| `src/components/header/Departments.tsx` | ESC key close; `aria-expanded`, `aria-haspopup`, `aria-controls`, `id` on menu; `role="menu"` / `role="menuitem"`; `title` on L1 links; all handlers `useCallback`. |
| `src/scss/header/_departments.scss` | Body: max-width 1200/1100, max-height 70vh, border, border-radius 12px, padding. L1: min-height 42px, truncation, 3px left accent bar on hover/active, focus-visible ring. Button: focus-visible ring. Layout mixin: list-width 240/220, tighter gutters and padding. |
| `src/scss/header/_megamenu.scss` | New block `.departments .departments__megamenu`: compact inner (padding, max-height, scroll), L2 240px + scroll + accent bar on active, L3 grid 6 cols, 72px thumbs, 2-line labels, borders/hover; tablet (md) stack columns, 4-col grid. |
| `src/components/header/Megamenu.tsx` | `useCallback(handleLeftCategoryClick)`; `loading="lazy"` on all `AppImage`; `title` on single/double `AppLink` for tooltip; `onItemClick?.(...)`. |

---

## Before/After Notes

- **Compactness:** Dropdown is capped at 1200px width and 70vh height with internal scroll; L1 list 240/220px; megamenu padding 12–16px; row heights ~40–44px; no large empty zones.
- **Scanability:** L1 = clear rows and truncation; L2 = active row with left accent bar; L3 = small cards with image + 2-line label; vertical dividers between L1 | L2 | L3.
- **States:** Hover = neutral background + L1/L2 accent bar; active L2 = same + persistent bar; focus = theme-colored focus ring (no default outline).
- **Responsiveness:** Desktop = full mega menu; tablet (md) = departments megamenu stacks (L2 above L3), 4-col grid; mobile header behavior unchanged.
- **Stability:** No routes/URLs/category IDs/data flow/API/component renames changed; no menu items or features removed.

---

## Accessibility Checklist

- [x] ESC closes dropdown.
- [x] Outside click closes dropdown (existing).
- [x] Tab order and focus visible (focus-visible ring).
- [x] Button: aria-expanded, aria-haspopup, aria-controls; menu: id, role="menu"; L1 links: role="menuitem".
- [x] Keyboard: Enter/Space on L2 category (existing in Megamenu).

---

## Optional Follow-ups (Not Done)

- Delayed hover (e.g. 150–200 ms) before switching L2 to reduce accidental switches.
- Full focus trap when menu is open (Tab cycles only inside menu until close).
- Arrow-key navigation between L1 items or L2 categories.
