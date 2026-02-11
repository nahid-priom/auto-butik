# Production Readiness Checklist

Use this checklist before releasing. Verify each item; document any exceptions.

## Build and static checks

- [ ] `npm run typecheck` passes (no TypeScript errors).
- [ ] `npm run lint` passes (no ESLint errors).
- [ ] `next build` passes. (Note: Currently TS/ESLint are ignored during build; see STRICTNESS_ROLLOUT.md.)
- [ ] No production console spam: debug/log only in development (use `~/utils/logger`).
- [ ] No missing translation spam: menu/category labels use `defaultMessage`; IntlProvider `onError` suppresses MISSING_TRANSLATION (see doc/i18n/README.md).

## Runtime and SSR

- [ ] SSR pages render without runtime warnings (check browser console and server logs).
- [ ] No use of deprecated `process.browser` (replaced with `typeof window !== 'undefined'`).

## Key flows (manual smoke test)

- [ ] **Vehicle lookup (registration):** Enter a Swedish reg number; result loads; can add to garage.
- [ ] **Vehicle lookup (manual):** Brand → year → model → engine; result loads; can add to garage.
- [ ] **Garage:** Switch active vehicle; catalog reflects it.
- [ ] **Category browsing:** TecDoc tree loads; category pages and product list load.
- [ ] **Product page:** Vendure product by slug loads; TecDoc details load when available.
- [ ] **Login / register / address / order history:** Account flows work (Vendure Shop API).
- [ ] **Cart + wishlist:** Add/remove; persistence across refresh (localStorage).
- [ ] **Demo pages:** e.g. `/demo/shop/`, `/demo/car-search-history` load without errors.

## Environment and config

- [ ] Env vars documented (README.md): `BASE_PATH`, `NEXT_PUBLIC_BACKEND_URL`.
- [ ] Production backend URL set correctly for deploy target.
- [ ] No secrets or API keys in frontend code or client-bundled env.

## CI/CD

- [ ] Lint/typecheck workflow runs on PRs (`.github/workflows/lint-typecheck.yml`).
- [ ] Deploy workflow runs on push to `prod` (`.github/workflows/main.yml`).
- [ ] Package policy followed (PACKAGE_POLICY.md): npm, package-lock.json.

## Security and quality

- [ ] Auth token handling documented (localStorage; consider httpOnly cookies if backend supports).
- [ ] ESLint/TypeScript ignore flags in next.config.js: plan to remove once errors are fixed (STRICTNESS_ROLLOUT.md).

---

## Release notes (recent changes)

**Production readiness pass (phases 0–6):**

- **Safety baseline:** SAFETY_BASELINE.md documents project map, risks, and behavior preservation contract.
- **i18n:** MISSING_TRANSLATION fixed by adding `defaultMessage` for menu/category labels (Menu, Megamenu, MainMenu, MegamenuLinks) and IntlProvider `onError` to suppress console spam. Translation rules in doc/i18n/README.md.
- **Deprecations:** All `process.browser` replaced with `typeof window !== 'undefined'` (store, hooks, _app, i18n, AppSlick, shopActions).
- **Logging:** `src/utils/logger.ts` added; Car API, account registration, CategoryTreeContext, and store use it. Debug logs only in development; errors in production only when needed.
- **localStorage:** Redux save/load guarded for SSR; save no-op on server. Existing try/catch and versioning kept (CLEANUP_NOTES.md).
- **Package policy:** PACKAGE_POLICY.md defines npm as canonical; install and lockfile guidance.
- **CI:** Lint and typecheck workflow added (non-blocking to deploy). Scripts: `npm run lint`, `npm run typecheck`. STRICTNESS_ROLLOUT.md describes enabling strict Next.js build later.
- **Docs:** BUG_TRIAGE.md (MISSING_TRANSLATION root cause), CLEANUP_NOTES.md, PACKAGE_POLICY.md, STRICTNESS_ROLLOUT.md.

**No intentional changes to:** Routes, API contracts, fake APIs, demo pages, or user-facing behavior. Legacy flows preserved.
