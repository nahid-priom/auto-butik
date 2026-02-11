# Phase 3 — Cleanup Notes (Deprecations and Runtime Hazards)

## 1. Replaced deprecated `process.browser`

**Next.js:** `process.browser` is deprecated. Use `typeof window !== 'undefined'` for client-only checks.

**Files changed:**

| File | Change |
|------|--------|
| `src/store/store.ts` | `!process.browser` → `typeof window === 'undefined'` in `load()`. Added guard in `save()` so we never touch localStorage on server. |
| `src/store/hooks.ts` | `!process.browser` → `typeof window === 'undefined'` in `useMedia()`. |
| `src/store/shop/shopActions.ts` | `canceled && process.browser` → `canceled && typeof window !== 'undefined'` (two thunks). |
| `src/pages/_app.tsx` | `process.browser` → `typeof window !== 'undefined'` for Redux subscribe and auth init. |
| `src/services/i18n/utils.ts` | `process.browser` → `typeof window !== 'undefined'` in `loadTranslation()`. |
| `src/services/i18n/provider.tsx` | `process.browser` → `typeof window !== 'undefined'` in `getLanguageInitialProps()`. |
| `src/components/shared/AppSlick.tsx` | `process.browser && responsive` → `typeof window !== 'undefined' && responsive`. |

**Behavior:** Same as before: code that depends on `window` or `localStorage` runs only on the client. SSR-safe guards remain.

---

## 2. Console logging: logger util and gating

**Added:** `src/utils/logger.ts`

- `logger.debug`, `logger.log`, `logger.info`: only run when `NODE_ENV === 'development'`.
- `logger.warn`, `logger.error`: always run (for real errors/warnings in production).

**Files updated to use logger:**

| File | Change |
|------|--------|
| `src/api/car.api.ts` | All `console.log` → `logger.debug`; all `console.error` → `logger.error`. Removes request/response spam in production. |
| `src/api/graphql/account.api.ts` | Registration debug `console.log` → `logger.debug`; error paths → `logger.error`. |
| `src/contexts/CategoryTreeContext.tsx` | Category tree debug `console.log` → `logger.debug`; load error → `logger.error`. |
| `src/store/store.ts` | `console.error` in save/load → `logger.error`. |

**Behavior:** Production builds no longer emit debug logs. Real errors still appear in logs. Legacy `console.error` in other files (e.g. _app, contexts, hooks) left as-is; can be migrated to `logger.error` later for consistency.

---

## 3. localStorage access (SSR-safe and centralized)

**Existing behavior kept:**

- `load()` in `src/store/store.ts` returns `undefined` when `typeof window === 'undefined'`.
- `save()` now returns early on server (no localStorage access).
- All other localStorage use (CarContext, GarageContext, car-search-history, auth token) is already inside client-only code (useEffect, event handlers, or after `typeof window` checks).

**Centralization:** Redux state persistence remains in `store.ts` with try/catch and version check (`state.version !== version`). No new storage abstraction added; existing pattern documented here.

**Recommendation:** For new features, read/write localStorage only after a `typeof window !== 'undefined'` check or inside useEffect, and wrap in try/catch to handle private mode / quota errors.
