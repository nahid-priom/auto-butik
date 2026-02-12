# i18n Translation Rules

## Message files

- **Location**: `public/i18n/<locale>.json` (e.g. `swe.json`, `en.json`).
- **Locale**: Next.js i18n uses `swe` (default) and `en`; `localeDetection: false`.

## Translation ID rules

1. **Use key-based ids in code**  
   Prefer message keys that are identifiers, not human sentences, e.g. `HEADER_WISHLIST`, `BUTTON_ADD_TO_CART`. Add the same key to both `swe.json` and `en.json` with the translated string.

2. **When the "id" is dynamic (menu/category labels)**  
   Menu and category titles can come from:
   - **Static data** (`src/data/headerDepartments.ts`): English strings like "Body Parts", "Door Handles". These are **not** keys in the message files.
   - **API** (TecDoc category tree): `node.name` from the backend (e.g. Swedish category names).  
   In both cases the UI passes that string as `id` to `<FormattedMessage id={...} />`. To avoid `MISSING_TRANSLATION` and console spam, **always pass `defaultMessage`** when the id might not exist in the message file:
   - Example: `<FormattedMessage id={item.title} defaultMessage={item.title} />`  
   So if the key is missing, the displayed text is the string itself (backwards-compatible).

3. **Do not use raw user-facing strings as translation ids** unless you add that exact string as a key in both locale files. Prefer a stable key (e.g. `CATEGORY_BODY_PARTS`) and put the translated text in the JSON.

## Missing translation handling (single place)

- **Where**: `src/services/i18n/provider.tsx`.  
- **Behavior**: `IntlProvider` is given an `onError` handler that:
  - For `MISSING_TRANSLATION`: does **not** throw, so the app does not crash and the console is not spammed. The message is rendered via `defaultMessage` when provided.
  - For other errors: in development the error is rethrown; in production it is not rethrown to avoid breaking the UI.

## Adding or changing translations

1. Add or edit the key in `public/i18n/swe.json` and `public/i18n/en.json`.
2. Use the key in code: `intl.formatMessage({ id: 'YOUR_KEY' })` or `<FormattedMessage id="YOUR_KEY" />`.
3. For optional keys (e.g. menu labels that may be data), pass `defaultMessage` so missing keys do not cause errors.

## TecDoc / category names

Category names from the API (e.g. TecDoc tree) are **data**, not message keys. They are passed through with `defaultMessage={title}` so they render as-is. To translate them, you would need a mapping layer (e.g. category id or slug to message key) and is out of scope of this doc.
