# Phase 4 — Validation checklist and rollback plan

## Validation checklist (must pass)

### Clean install

- Remove `node_modules`. Run `npm ci`. No `--force` or `--legacy-peer-deps`. Install must complete without ERESOLVE override for react-popper/create-react-context.

### Build and run

- `npm run build` — must complete successfully.
- `npm run dev` — dev server starts (e.g. port 5173).
- `npm run start` — production server starts after build.

### Warnings

- No npm peer dependency override messages for react-popper or create-react-context.
- `npm ls create-react-context` — must show `(empty)`.

### Audit

- `npm audit` — 0 moderate (js-yaml fixed). 1 high (Next Image Optimizer) is acceptable and documented in SECURITY_FIXES.md.

### Smoke test (manual)

- Homepage renders.
- Header/menu works; dropdowns if any.
- Catalog routes (e.g. /catalog, /catalog/[slug]/products) load.
- Product detail page loads.
- Account pages (login, dashboard) render.
- Cart, wishlist, compare pages render.
- Modals: Vehicle picker modal opens and closes; Quickview modal opens and closes.
- Tooltips: Product form option tooltips and status badge tooltips show (UncontrolledTooltip).
- Demo pages (e.g. /demo/shop/product-full, /demo/car-search-history) render.

## Expected outputs

| Command | Expected |
|---------|----------|
| `npm ci` | Clean install; no ERESOLVE override for react-popper/create-react-context. |
| `npm ls create-react-context` | `(empty)`. |
| `npm run build` | Next.js 14.2.35 build succeeds. |
| `npm audit` | 0 moderate, 1 high (next Image Optimizer; documented). |

## Rollback plan

If regressions appear (e.g. Modal/Tooltip styling or behavior, Next.js runtime issues):

1. **Revert package.json**
   - Restore: `"next": "14.2"`, `"reactstrap": "8.9.0"`, restore `"@types/reactstrap": "8.7.2"` in devDependencies, remove the `overrides` block.

2. **Restore lockfiles**
   - Restore `package-lock.json` from git (before the dependency changes).
   - If pnpm/yarn were used, restore `pnpm-lock.yaml` or `yarn.lock` from git if desired.

3. **Restore CI**
   - In `.github/workflows/main.yml`, change `npm ci` back to `npm install --force` if reverting to the old deps (so installs succeed with peer overrides).

4. **Reinstall**
   - `rm -rf node_modules && npm install` (or `npm ci` after reverting lockfile).

5. **Verify**
   - `npm run build` and smoke-test again.

No application code (React components, routes, or fake API) was changed; only dependencies, lockfile, and CI were modified, so rollback is limited to package.json, package-lock.json, and workflow file.
