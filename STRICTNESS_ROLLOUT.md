# Build Strictness Rollout

## Current state

- **Next.js build:** `next.config.js` has `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`. Production builds succeed even when there are lint or TypeScript errors.
- **CI:** A separate workflow (`.github/workflows/lint-typecheck.yml`) runs on pull requests and push to `prod`/`main`. It runs `npm run typecheck` and `npm run lint`. This job **fails** if there are TS or ESLint errors. It does **not** block the deploy workflow (deploy runs on push to `prod` and does not depend on this job).

## Scripts

| Script | Command | Purpose |
|--------|---------|--------|
| `npm run typecheck` | `tsc --noEmit` | Type-check the project without emitting files. |
| `npm run lint` | `eslint src --ext .ts,.tsx` | Lint `src` with the project’s ESLint config. |

## Rollout steps

1. **Current (done):** CI runs typecheck and lint; deploy remains unchanged; Next.js build still ignores errors.
2. **Next:** Fix reported TypeScript and ESLint errors (run `npm run typecheck` and `npm run lint` locally and fix until they pass).
3. **Then:** In `next.config.js`, set `eslint.ignoreDuringBuilds: false` and `typescript.ignoreBuildErrors: false` so production builds fail on errors.
4. **Optional:** Make the deploy workflow depend on the lint-typecheck job (e.g. required status check for `prod`) so deploys only run when lint and typecheck pass.

## Fixing common issues

- **Unsafe `any`:** Add proper types or use `unknown` and narrow.
- **Missing types for API payloads:** Define interfaces for responses and use them.
- **SSR-unsafe access:** Guard `window`/`document`/`localStorage` with `typeof window !== 'undefined'`.
- **Unused variables/imports:** Remove or prefix with underscore if intentionally unused.
