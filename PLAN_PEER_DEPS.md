# Phase 1 — Peer dependency resolution plan

## Goal

Eliminate the chain **reactstrap@8.9 → react-popper@1.3.7 → create-react-context@0.3.0** so that:

- No package declares React 16–only peers.
- `npm ls create-react-context` is empty.
- Installs do not require `--force` or `--legacy-peer-deps`.

## Chosen approach: Upgrade Reactstrap to 9.x (keep Bootstrap 4)

**Option A (chosen):** Upgrade **reactstrap** from 8.9.0 to **9.2.3**.

- Reactstrap 9 uses **react-popper@^2.2.4** and **@popperjs/core@^2.6.0** (no create-react-context).
- Peer deps are `react >= 16.8.0`, `react-dom >= 16.8.0`, so React 18 is satisfied.
- **Bootstrap is left at 4.6.0.** Reactstrap 9 is documented for Bootstrap 5, but Modal and Tooltip use core class names (e.g. `modal`, `modal-dialog`, `tooltip-inner`) that exist in both Bootstrap 4 and 5. Risk: minor styling differences; mitigated by smoke-testing modals and tooltips. If issues appear, a follow-up Bootstrap 5 migration can be done.

**Why not upgrade Bootstrap to 5 now:** The app imports Bootstrap 4 SCSS (custom-forms, jumbotron, media, etc.). Bootstrap 5 removes/renames these; migration would touch many files. Keeping Bootstrap 4 is the minimal change.

**Alternatives considered:**

- **Override react-popper to v2 while keeping reactstrap 8.9:** Reactstrap 8.x is built for react-popper v1 API; v2 has different exports. Would cause runtime errors. **Rejected.**
- **Replace Modal/UncontrolledTooltip with custom components:** Would require removing reactstrap and implementing modals/tooltips (e.g. with @popperjs/core). Larger code change and testing surface. **Deferred** in favor of the upgrade.
- **Use --legacy-peer-deps permanently:** User requirement is to not rely on `--force` or legacy peer deps as the final solution. **Rejected.**

## Code impact

- **ProductForm.tsx:** Uses `UncontrolledTooltip`; API is compatible (target, children). No code change expected.
- **StatusBadge.tsx:** Same.
- **VehiclePickerModal.tsx, Quickview.tsx:** Use `Modal` with `isOpen`, `toggle`, `centered`, `className`. Reactstrap 9 Modal supports these; no change expected.
- **@types/reactstrap:** Removed from package.json; reactstrap 9 ships its own types.

## Validation

After upgrade:

- `npm ls create-react-context` → empty.
- `npm install` (no --force) → no ERESOLVE override for react-popper/create-react-context.
- Build passes; smoke-test Modal and Tooltip on critical pages.
