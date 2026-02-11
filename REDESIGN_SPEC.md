# AutoButik – Navbar & Hero Redesign Spec

Visual modernization only. No layout logic, routes, component structure, or functionality changed.

---

## 1. Design tokens (global)

Defined in `src/scss/_variables.scss` under “design tokens”:

| Token | Value | Use |
|-------|--------|-----|
| `$dt-border-color` | `#e5e7eb` | Default borders |
| `$dt-border-color-subtle` | `#f0f1f3` | Dividers, sticky header edge |
| `$dt-shadow-soft` | `0 1px 3px rgba(0,0,0,.06)` | Cards, badges |
| `$dt-shadow-elevation` | `0 4px 12px rgba(0,0,0,.08)` | Hover, hero panel |
| `$dt-radius-card` | `12px` | Hero panel, category tiles |
| `$dt-radius-input` | `10px` | Inputs, search |
| `$dt-radius-button` | `8px` | Buttons, contact CTA |
| `$dt-radius-pill` | `999px` | Cart counter badge |
| `$dt-focus-ring` | theme + 2px ring | Focus states |
| `$dt-spacing-unit` | `8px` | Spacing scale base |

**Tailwind-style equivalents (if you migrate):**
- Border: `border-gray-200` / `border-gray-100`
- Shadow: `shadow-sm`, `shadow-md`
- Radius: `rounded-xl` (12px), `rounded-lg` (10px), `rounded-md` (8px)
- Focus: `focus:ring-2 focus:ring-primary focus:ring-offset-2`

---

## 2. Header

### Top utility bar
- **Height:** 28px (was 34px) via `$topbar-classic-row-height`.
- **Contrast:** Muted text (`#6b7280` / `#9ca3af`) so it reads as secondary.
- **Typography:** 13px, slightly tighter padding.

### Main header row
- **Search:** Height 46px, border `$dt-border-color`, focus ring `$dt-focus-ring`, radius `$dt-radius-input`.
- **Indicators:** 12px gap between account / vehicle / cart.
- **Cart badge:** Softer style: smaller (10px, 3px 5px padding), pill radius, `$dt-shadow-soft`; color still from `$indicator-counter-scheme`.

### Category row
- **Height:** 48px (was 52px).
- **Menu links:** 14px, padding 6px 14px, radius 6px.
- **Contact CTA:** Integrated with left border separator; 13px, `$dt-radius-button`, outline style.

### Sticky
- `.site__header`: `position: sticky; top: 0; z-index: 100;` and subtle bottom edge `box-shadow: 0 1px 0 0 $dt-border-color-subtle`.

---

## 3. Hero (BlockVehicleSearchHero)

### Background overlay
- **Before:** Solid `rgba(0,0,0,0.7)`.
- **After:** Gradient `linear-gradient(180deg, rgba(15,23,42,.5) 0%, rgba(15,23,42,.45) 40%, rgba(15,23,42,.55) 100%)` for depth and controlled contrast.

### Headline / subheading
- Tighter line-height (1.2 headline, 1.4 subheading), smaller margins (8–10px under title, 28–32px under subtitle).
- Slightly smaller sizes (28→42px responsive) and lighter text-shadow.

### Vehicle selector panel
- **Before:** Dark glassy panel, heavy shadow.
- **After:** White card: `background: #fff`, `border: 1px solid $dt-border-color`, `border-radius: $dt-radius-card`, `box-shadow: $dt-shadow-elevation`, padding 28px 32px, max-width 1200px.

### Plate input
- **Before:** Large blue “S” block on the left.
- **After:** No blue block; subtle EU-style badge inside the field via `background-image` (small blue rectangle + “S”), padding-left 44px, same behavior.

### Dropdowns (brand/model/engine)
- **Default:** White background, 44px height, `$dt-radius-input`, neutral border.
- **Disabled:** `background: #f5f5f5`, `border-color: $dt-border-color-subtle`, `color: #9ca3af`.

### Primary button
- 44px height, `$dt-radius-button`, `$dt-shadow-soft`.

---

## 4. Category tiles (BlockCategoryNavigation)

- **Spacing:** Padding 16px 0 32px 0; gap 16px; item padding 20px 14px.
- **Card:** `$dt-border-color`, `$dt-shadow-soft`, `$dt-radius-card`.
- **Hover:** Slightly darker border, `$dt-shadow-elevation`, `translateY(-2px)`.
- **Image:** max 120px, margin-bottom 12px.
- **Label:** 14px, line-height 1.4, centered.

---

## 5. Before / after (reasoning)

| Area | Before | After |
|------|--------|--------|
| **Topbar** | Tall, high contrast | Shorter, muted; reads as secondary |
| **Search** | 38px, flat | 46px, clear border and focus ring |
| **Cart badge** | Large red blob | Small pill, soft shadow |
| **Navbar** | 52px, tight | 48px, more padding; contact integrated |
| **Hero overlay** | Very dark | Gradient, keeps depth, less heavy |
| **Hero panel** | Dark glass | White card, Scandinavian feel |
| **Plate input** | Dominant blue “S” | Subtle EU badge inside field |
| **Disabled selects** | Dark/flat | Light gray, clearly disabled |
| **Category tiles** | Strong hover lift | Softer elevation, less empty space |

---

## 6. Files touched (CSS/SCSS only)

- `src/scss/_variables.scss` – design tokens, topbar row height, topbar classic muted colors
- `src/scss/common/_site.scss` – sticky header + subtle border
- `src/scss/header/_header--classic.scss` – grid row height, navbar height/padding, indicator spacing
- `src/scss/header/_header-redesign.scss` – topbar font size, contact CTA integration
- `src/scss/header/_search--header--classic.scss` – search height, border, focus ring
- `src/scss/header/_indicator.scss` – counter badge (pill, soft shadow)
- `src/scss/header/_main-menu.scss` – link size and padding
- `src/scss/blocks/_block-vehicle-search-hero.scss` – overlay, title/subtitle, form panel, plate badge, dropdowns
- `src/scss/blocks/_block-category-navigation.scss` – spacing, hover, labels

No component renames, no prop/route/logic changes.
