# Homepage – Category Sections Audit

Audit of where and how the homepage shows content **by category**: the top tabs (Bildelar, Torkarblad, etc.) and the grid of category cards below.

---

## 1. Sections that show content by category

| Section | Component | Position on homepage | Purpose |
|--------|-----------|----------------------|--------|
| **Quick category links** | `BlockCategoryNavigation` | Directly under hero | 5 tiles: Bildelar, Torkarblad, Oljor och bilvård, Biltillbehör, Verktyg → link to catalog/category |
| **Tabs + category grid** | `BlockCategoryTabs` | After BlockBanners | Tabs (Bildelar, Torkarblad, …) and a grid of category cards (e.g. Avgassystem, Bromssystem, …) |

**Order on homepage (index.tsx):**

1. BlockVehicleSearchHero  
2. **BlockCategoryNavigation**  
3. BlockBanners  
4. **BlockCategoryTabs**  
5. BlockSlideshow  
6. … (products, benefits, sale, posts, etc.)

---

## 2. BlockCategoryNavigation (tiles under hero)

**File:** `src/components/blocks/BlockCategoryNavigation.tsx`

**Data source:** **Static.** Hardcoded array of 5 items:

- Bildelar → `/catalog`
- Torkarblad → `/catalog/9603`
- Oljor och bilvård → `/catalog/9604`
- Biltillbehör → `/catalog/9605`
- Verktyg → `/catalog/9606`

**Rendering:** One link per item: image + name. No API, no loading state.

**Styling:** `src/scss/blocks/_block-category-navigation.scss` (uses design tokens after redesign).

**Findings:**

- Not driven by category tree or API; if IDs or structure change, this list can get out of sync with the rest of the site.
- Same five categories as the tabs in BlockCategoryTabs, but duplicated and hardcoded.
- No i18n: labels are Swedish strings in code.

---

## 3. BlockCategoryTabs (tabs + grid of category cards)

**File:** `src/components/blocks/BlockCategoryTabs.tsx`

**Data source:** **Dynamic.** Uses `useCategoryTreeSafe()` → `headerMenu` from **CategoryTreeContext**.

- **CategoryTreeContext** loads the tree via `carApi.getCategoryTree(modelId?)` (optional vehicle).
- **headerMenu** is built by `buildHeaderCategoryMenuFromTree(tree)` in `src/data/buildHeaderCategoryMenuFromApiTree.ts`.
- Structure:
  - **Bildelar (MENU_CAR_PARTS):** root categories except the four standalone (Torkarblad, Oljor, Biltillbehör, Verktyg). Each root (e.g. Avgassystem, Bromssystem) has `title`, `url`, `customFields.image`, and nested `links` (children).
  - **Torkarblad, Oljor, Biltillbehör, Verktyg:** one tab each; each tab’s cards = direct children of that root (flat list: title, url, image).

**Rendering:**

- **Tabs:** One tab per menu item (Bildelar, Torkarblad, …). Active tab state is local (`useState('bildelar')`).
- **Grid:** For the active tab, `tab.groups` are rendered as cards. Each card = one category: image (`group.image`), name (`group.title`), link (`group.url`).
- Card label: `intl.formatMessage({ id: group.title, defaultMessage: group.title })`. For API-sourced names, `group.title` is the raw name (e.g. `"Avgassystem"`), so the id is not an i18n key and `defaultMessage` is always used.

**Images:**

- From API: `node.image` on each category in the tree (`ICategoryTreeNode.image`).
- Fallback in builder: `FALLBACK_IMAGE = "/images/avatars/product.jpg"` when `node.image` is null/empty.

**Findings:**

- Content is fully driven by the category tree API; tabs and cards stay in sync with backend.
- **No loading state:** When `headerMenu` is still null (tree loading), `tabsData` can be empty; the block still renders (empty or only default tab).
- **No error state:** If the tree fails to load, `headerMenu` stays null and the section is effectively empty with no message.
- **Empty tabs:** If a menu item has no `columns[0].links`, that tab is not pushed to `tabsData`, so the tab list can be shorter than the five expected tabs.
- Category names are not i18n keys; they are whatever the API returns (e.g. Swedish). Fine for single locale; for multiple locales you’d need a mapping or API per locale.

---

## 4. Data flow summary

```
carApi.getCategoryTree(modelId?)
  → CategoryTreeContext (tree, headerMenu = buildHeaderCategoryMenuFromTree(tree))
       → BlockCategoryTabs: headerMenu → tabsData (one tab per menu, groups = columns[0].links)
            → Tabs: Bildelar | Torkarblad | Oljor | Biltillbehör | Verktyg
            → Grid: cards from active tab’s groups (title, url, image)

BlockCategoryNavigation: no API; static list of 5 categories.
```

**Category tree builder:** `buildHeaderCategoryMenuFromApiTree.ts`

- **Bildelar:** Root categories whose name is not in `["Vindrutetorkar system", "Oljor och bilvård", "Biltillbehör", "Verktyg"]`. Each becomes a link with nested children; image from `node.image` or fallback.
- **Standalone tabs:** For each of the four names above, finds that root in the tree and builds a flat list of its children (each with image, title, url).

---

## 5. Styling (BlockCategoryTabs)

**File:** `src/scss/blocks/_block-category-tabs.scss`

- **Block:** padding, title (e.g. 28px bold), “Populära kategorier”.
- **Tabs:** Flex row, gray inactive / theme red active + underline.
- **Grid:** 6 columns desktop, 4 → 3 → 2 on smaller breakpoints; gap 16px (12px on small).
- **Cards:** White, border, 10px radius, fixed height (220px → 200 → 190 → 180), image 120px → 100 → 90 → 80, label 14px (clamp 2 lines).

**Alignment with redesign:**

- BlockCategoryNavigation was updated to use design tokens (border, shadow, radius, hover).
- BlockCategoryTabs still uses its own values (e.g. `#dfe3e8`, `10px`, fixed heights). Applying the same design tokens would align spacing, hover elevation, and label treatment with the rest of the homepage.

---

## 6. Recommendations

| Area | Recommendation |
|------|-----------------|
| **BlockCategoryNavigation** | Optionally derive the five links from `headerMenu` (or a small “homepage categories” API) so the list stays in sync with the category tree and BlockCategoryTabs. |
| **BlockCategoryTabs loading/error** | Show a loading skeleton or spinner while `headerMenu === null` and an error message if the tree fails to load (e.g. from `useCategoryTreeSafe().error`). |
| **Empty tabs** | If the tree returns no links for a tab, you can still show the tab with an “Inga kategorier” message instead of hiding the tab. |
| **Design consistency** | Apply the same design tokens used in BlockCategoryNavigation and REDESIGN_SPEC to BlockCategoryTabs (border, radius, shadow, hover, label size/alignment). |
| **i18n** | If you add more locales, decide whether category names come from the API per locale or from a front-end key map; currently they are API names with `defaultMessage` only. |

---

## 7. Quick reference

| What | Where |
|------|--------|
| Tabs + category grid (by category) | `BlockCategoryTabs` ← `headerMenu` ← CategoryTreeContext ← `carApi.getCategoryTree()` |
| Top 5 category tiles under hero | `BlockCategoryNavigation` ← static array |
| Menu builder from tree | `buildHeaderCategoryMenuFromApiTree.ts` |
| Category tree API | `car.api.ts` → `getCategoryTree(modelId?)` |
| BlockCategoryTabs styles | `_block-category-tabs.scss` |
| BlockCategoryNavigation styles | `_block-category-navigation.scss` |

This audit covers all homepage sections that show content **according to categories**: the category tiles under the hero and the tabbed category grid.
