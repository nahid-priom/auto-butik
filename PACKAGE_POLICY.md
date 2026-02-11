# Package Manager and Dependency Policy

## Canonical package manager

**npm** is the canonical package manager for this project.

- CI/CD (`.github/workflows/main.yml`) runs `npm install --force` and `npm run build`. Do not change the workflow to a different package manager without updating this doc and the deploy script.
- Use **package-lock.json** as the single source of truth for installs. Commit it.

## Node version

- **Engines:** Not pinned in `package.json`. Types use `@types/node@16`.
- **Recommendation:** Use Node.js 18 LTS or 20 LTS for local and CI. Set in CI via `actions/setup-node` if you want a guaranteed version.

## Install commands

| Environment | Command |
|-------------|--------|
| Local development | `npm install` |
| CI (deploy) | `npm install --force` (current); consider removing `--force` once peer dependency warnings are resolved. |
| Production build | `npm run build` |

## Lockfiles

- **Keep:** `package-lock.json`.
- **Optional:** The repo currently has `pnpm-lock.yaml` and `yarn.lock`. These are not used by CI. To avoid confusion and drift:
  - Prefer deleting `pnpm-lock.yaml` and `yarn.lock` from the repo so only npm is used, **or**
  - Keep them only if part of the team relies on pnpm/yarn locally; in that case do not use them in CI and document that npm is canonical for CI and releases.

## Upgrades and conflicts

- Prefer resolving peer dependency warnings by version alignment rather than `npm install --force` long-term.
- Avoid broad upgrades (e.g. "upgrade all deps"); upgrade in small steps and run `npm run build` and manual smoke tests.
- Pin versions where behavior must stay stable (e.g. Next.js, React); use exact or caret as appropriate.
