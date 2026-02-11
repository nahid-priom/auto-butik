# Phase 3 — Security fixes (npm audit)

## Vulnerabilities identified (pre-fix)

| Name | Severity | Affected range | Pulled in by |
|------|----------|----------------|--------------|
| js-yaml | Moderate | <3.14.2 | eslint@7.32.0 (js-yaml@3.14.0) |
| next | High (multiple) | 13.3.0–14.2.33, etc. | next@14.2 (direct) |

Advisories: js-yaml prototype pollution (GHSA-mh29-5h37-fv8m); Next.js DoS with Server Components / deserialization (GHSA-mwv6-3258-q52c, GHSA-5j59-xgg2-r9c4, GHSA-9g9p-9gw9-jx7f, GHSA-h25m-26qc-wcjf).

## Fixes applied

### 1. js-yaml (moderate)

- **Root cause:** eslint@7.32.0 depends on js-yaml@3.14.0; 3.14.0 < 3.14.2.
- **Fix:** Added npm **overrides** in package.json: `"js-yaml": "3.14.2"`. All dependents (eslint) now resolve to 3.14.2. No eslint upgrade required.
- **Validation:** After `npm install`, `npm audit` no longer reports js-yaml. (Moderate count went to 0.)

### 2. Next.js (high — partial)

- **Root cause:** next@14.2 is in the affected range for multiple DoS advisories.
- **Fix:** Upgraded **next** from 14.2 to **14.2.35** (latest 14.2.x). This addresses the Server Components / deserialization DoS fixes (14.2.34 / 14.2.35).
- **Validation:** Build and run unchanged; Next 14.2.35 is a patch-level upgrade within 14.x.

### 3. Remaining high (documented)

- **Advisory:** Next.js self-hosted DoS via Image Optimizer `remotePatterns` (GHSA-9g9p-9gw9-jx7f). Affected range: >=10.0.0 <15.5.10.
- **Status:** next@14.2.35 is still in that range. Full fix would require upgrading to **next@15.5.10+** (or 16.x), which is a major upgrade and out of scope for this pass.
- **Mitigation:** Ensure `next.config.js` does not expose unsafe `images.remotePatterns` to user input; restrict to trusted origins. No breaking upgrade applied.

## Proof

- **Before:** `npm audit` showed 1 moderate (js-yaml), 1 high (next).
- **After:** `npm audit` shows 0 moderate; 1 high (Next Image Optimizer), which is documented above and not fixed by a non-breaking upgrade.
