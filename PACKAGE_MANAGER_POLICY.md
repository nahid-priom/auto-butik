# Package manager policy

## Canonical manager and lockfile

- **Canonical package manager:** npm.
- **Canonical lockfile:** `package-lock.json` only. Commit it; use it for reproducible installs.

## Non-canonical lockfiles

- **pnpm-lock.yaml** and **yarn.lock** have been removed from the repo so that only npm is used. If you previously used pnpm or yarn locally, run `npm install` (or `npm ci` after a clean clone) instead.

## CI install command

- Use **`npm ci`** for CI (and any automated or clean install). It installs from `package-lock.json` and does not require `--force` or `--legacy-peer-deps` once peer conflicts are resolved.
- Deploy workflow (`.github/workflows/main.yml`) has been updated from `npm install --force` to `npm ci`.

## Local development

```bash
npm ci          # clean install (e.g. after clone or when lockfile changed)
# or
npm install     # when adding/updating deps (updates package-lock.json)
```

## Do not

- Commit pnpm-lock.yaml or yarn.lock.
- Use `npm install --force` or `--legacy-peer-deps` as the standard install.
