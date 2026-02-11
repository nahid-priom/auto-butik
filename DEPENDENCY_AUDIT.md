# Phase 0 — Dependency Audit

## Environment

| Item | Value |
|------|--------|
| Node | v20.19.5 |
| npm | 11.6.1 |
| Lockfile in use | package-lock.json (pnpm-lock.yaml and yarn.lock also present; CI uses npm) |

## package.json (relevant)

- **next**: 14.2
- **react**: 18.2.0
- **react-dom**: 18.2.0
- **reactstrap**: 8.9.0
- **bootstrap**: 4.6.0
- **eslint**: 7.32.0 (dev)

## Dependency tree (peer conflict chain)

```
autobutik@1.2.0
+-- @types/reactstrap@8.7.2
|   `-- reactstrap@8.9.0 (deduped)
`-- reactstrap@8.9.0
    `-- react-popper@1.3.7
        `-- create-react-context@0.3.0
```

- **reactstrap@8.9.0** depends on **react-popper@^1.3.6** (resolved to 1.3.7).
- **react-popper@1.3.7** depends on **create-react-context@0.3.0**.
- react-popper v1 and create-react-context declare peer dependencies for React 16 only; the app uses React 18, so npm reports ERESOLVE peer dependency conflicts and may override when using `npm install --force` or legacy peer deps.

## Where Reactstrap is used in the codebase

| File | Component(s) | Usage |
|------|--------------|--------|
| `src/components/shop/ProductForm.tsx` | UncontrolledTooltip | Tooltip for product form (critical: product page) |
| `src/components/shared/VehiclePickerModal.tsx` | Modal | Vehicle picker dialog (critical: header, filters) |
| `src/components/shared/StatusBadge.tsx` | UncontrolledTooltip | Status tooltip (shared) |
| `src/components/shared/Quickview.tsx` | Modal | Quickview product modal (critical: catalog/shop) |

All four are **critical or shared** (no demo-only usage). Modal is used in VehiclePickerModal and Quickview; UncontrolledTooltip in ProductForm and StatusBadge.

## Risk assessment if changed

- **Upgrading reactstrap 8 → 9**: Reactstrap 9 uses react-popper v2 and @popperjs/core; peer deps are `react >= 16.8.0`, so React 18 is supported. Reactstrap 9 targets **Bootstrap 5**; the app currently uses **Bootstrap 4**. Moving to Reactstrap 9 without upgrading Bootstrap can cause styling/class mismatches (e.g. data attributes, utility renames). **Risk**: Medium if only Reactstrap is upgraded; **mitigation**: Upgrade Bootstrap to 5.x with Reactstrap 9 and run visual/smoke tests.
- **Replacing only Popper-dependent components**: UncontrolledTooltip could be replaced with a custom tooltip using @popperjs/core; Modal could stay on reactstrap or be replaced. That would still leave reactstrap in the tree pulling react-popper v1 unless reactstrap is removed entirely. **Risk**: Low for the replacement components; removing reactstrap entirely is a larger change.
- **Using npm overrides to force react-popper@2** while keeping reactstrap 8.9: reactstrap 8.x is built against react-popper v1 API; v2 has different exports/API. **Risk**: High (runtime breakage); **not recommended**.

## npm audit (pre-fix)

- **1 moderate**: js-yaml (prototype pollution, range <3.14.2). Pulled in by **eslint@7.32.0** (js-yaml@3.14.0).
- **1 high** (multiple advisories): next (DoS with Server Components / deserialization / image optimizer). **next@14.2** is in affected range; fixed in 14.2.34 / 14.2.35+.

## Summary

- Warnings occur because **reactstrap@8.9 → react-popper@1 → create-react-context** expect React 16 peers while the app uses React 18.
- Safest fix that removes the chain without keeping --force: **upgrade to reactstrap 9** (which uses react-popper v2 and @popperjs/core) and **upgrade Bootstrap to 5.x** for compatibility with Reactstrap 9.
- Security: **upgrade Next.js** to 14.2.35; **fix js-yaml** via override or eslint upgrade.
