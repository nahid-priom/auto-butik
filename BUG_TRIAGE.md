# Phase 1 — Bug Triage: MISSING_TRANSLATION

## Reported error

`[@formatjs/intl Error MISSING_TRANSLATION]` for locale `"swe"`.

## Reproduction steps

1. Set locale to Swedish (default): `next.config.js` has `defaultLocale: 'swe'`.
2. Load the homepage or any page that renders the main header (departments/megamenu).
3. Header menu is built from either:
   - **Fallback**: `src/data/headerDepartments.ts` (when category tree is not yet loaded or not used), which uses English strings as `title`: e.g. "Body Parts", "Door Handles", "Car Covers", "Tailgates", "Suspension", "Headlights & Lighting", "Brakes & Suspension", etc.
   - **From API**: `buildHeaderCategoryMenuFromTree()` in `src/data/buildHeaderCategoryMenuFromApiTree.ts` sets `title: node.name` for nested links (TecDoc category names from backend).
4. These titles are passed to `<FormattedMessage id={item.title} />` or `id={category.title}` in:
   - `src/components/header/Menu.tsx` (line 38)
   - `src/components/header/Megamenu.tsx` (lines 92, 134, 185)
   - `src/components/header/MainMenu.tsx` (lines 69, 79)
   - `src/components/header/MegamenuLinks.tsx` (line 40)
5. react-intl looks up the id in `public/i18n/swe.json`. For ids like "Body Parts" or "Door Handles" there are no keys (swe has keys like "HEADER_SHOP", "BUTTON_ADD_TO_CART", etc.). For TecDoc names like "Bromsar" it may or may not exist.
6. When the key is missing, @formatjs/intl throws/reports MISSING_TRANSLATION.

## Root cause (with file paths)

| Source | File(s) | What is used as message id |
|--------|---------|----------------------------|
| Static header departments | `src/data/headerDepartments.ts` | Raw English strings: "Body Parts", "Door Handles", "Car Covers", "Tailgates", "Suspension", "Headlights & Lighting", "Brakes & Suspension", "Steering", "Fuel Systems", "Transmission", "Air Filters", "Interior Parts", "Engine & Drivetrain", "Tools & Garage", etc. |
| Category tree (API) | `src/data/buildHeaderCategoryMenuFromApiTree.ts` | `node.name` (TecDoc category names from API, e.g. "Bildelar" children names). |
| Call sites | `src/components/header/Menu.tsx` (line 38), `Megamenu.tsx` (92, 134, 185), `MainMenu.tsx` (69, 79), `MegamenuLinks.tsx` (40) | `item.title` or `category.title` or `link.title` passed as `id` to `<FormattedMessage id={...} />` with no `defaultMessage`. |

So: **human-readable strings (and API category names) are used as translation ids**. The message files contain key-based ids (e.g. "HEADER_WISHLIST"), not these literal strings. Hence MISSING_TRANSLATION.

## Severity assessment

- **User impact**: Menu and category labels still render in many environments (fallback can show the id as text), but the console is spammed and in strict mode errors can surface.
- **Production**: Noisy logs; possible monitoring alerts; unprofessional. Not a functional break of critical flows if fallback behavior exists.
- **Severity**: **Medium** — fix by making missing translations safe and eliminating console spam without changing legacy data or routes.

## Recommended fix strategy

1. **Backwards-compatible display**  
   At every menu/link call site where `title` can be a raw string or API name, pass `defaultMessage={title}` so that when the id is missing, the displayed text is the string itself. No change to headerDepartments or API response structure.

2. **Suppress MISSING_TRANSLATION noise in production**  
   In `LanguageProvider` (or IntlProvider), set `onError` so that for `MISSING_TRANSLATION` we do not throw and do not log in production; in development optionally log once per key to a single aggregated warning.

3. **Optional: add common keys to swe.json**  
   For the static department titles from headerDepartments, we can add entries to swe.json (e.g. "Body Parts": "Karosseridelar") and optionally change headerDepartments to use those keys later. Not required for the immediate fix; the defaultMessage approach keeps legacy behavior and stops errors.

4. **Do not** change URLs, route structure, or fake APIs; do not remove or rewrite headerDepartments or buildHeaderCategoryMenuFromApiTree; only add fallbacks and error handling.
