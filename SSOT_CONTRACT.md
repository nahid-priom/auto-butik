# SSOT_CONTRACT.md — Single Source of Truth Contract

**Purpose:** Formal contract for state ownership, persistence, cache policy, and invalidation. All new code and refactors must follow this.

---

## Principles

- **Redux** = App state only: small, persistent, cross-cutting (cart, wishlist, compare, currency, UI flags, garage selection ids, auth snapshot).
- **Apollo** = Vendure GraphQL server state: normalized cache; no duplication in Redux.
- **REST Query Cache (TanStack Query)** = Car API + TecDoc server state: keys include vehicle signature where applicable.
- **Contexts** = Orchestration only: compose SSOT (e.g. expose cache + actions); do not store large datasets.
- **localStorage** = Persistence of **whitelisted** app state only (cart, wishlist, compare, currency, garage, options, mobile menu, auth token). Never persist server state (categories, product lists, TecDoc payloads, search results).

---

## Domain → Owner → Persistence → Cache Policy → Invalidation

| Domain | Owner | Persisted? | Cache Policy | Invalidation Rules |
|--------|--------|------------|--------------|---------------------|
| **Cart** | Redux (`cart`) | Yes (whitelist) | N/A | User actions only. |
| **Wishlist** | Redux (`wishlist`) | Yes (whitelist) | N/A | User actions only. |
| **Compare** | Redux (`compare`) | Yes (whitelist) | N/A | User actions only. |
| **Currency** | Redux (`currency`) | Yes (whitelist) | N/A | User change. |
| **Auth** | Redux (`user`) + Apollo (me, activeCustomer) | Token: localStorage `customerToken`; user snapshot in Redux (whitelist) | Apollo: default | Logout: clear token + Redux user. Login: set token, refetch me. |
| **Garage (saved vehicles)** | Redux or Context (single owner TBD) | Yes — `garageVehicles`, `currentCarId` or Redux whitelist | N/A | Add/remove/set current. |
| **Current active car (catalog)** | CarContext (or derived from garage) | Yes — `currentActiveCar` (24h TTL) | N/A | On lookup or garage “use this car”. |
| **Category tree** | TanStack Query | No | `categoryTree:{locale}:{modelId\|''}`, stale 5m, cache 30m | Invalidate on locale change; when vehicle changes, invalidate `categoryTree:*:oldModelId` and fetch for new modelId. |
| **Vehicle categories** | TanStack Query | No | `vehicleCategories:{modelId}:{parentId\|''}`, stale 5m | Invalidate when vehicle (modelId) changes. |
| **Legacy shop category + list** | TanStack Query or in-memory (no Redux) | No | Optional: `shopCategory:{slug}`, `shopProductsList:{slug}:{optionsHash}` | Only for routes using FakeShopApi; do not persist. |
| **Product detail (Vendure)** | Apollo | No | Normalized by id/slug; keyArgs as needed | Mutation/evict when needed. |
| **TecDoc product** | TanStack Query | No | `tecdocProduct:{productId}`, stale 10m | Invalidate by productId if backend says so (e.g. admin update). |
| **Car lookup by reg** | TanStack Query | No | `carLookup:{regNr}` (normalized reg), stale 24h | Invalidate when user clears or re-lookups. |
| **Dropdowns (brands, years, models, engines)** | TanStack Query | No | `carDropdown:brands`, `carDropdown:years:{brand}`, `carDropdown:models:{brand}:{year}`, `carDropdown:engines:{brand}:{year}:{model}`, stale 1h | Rarely change; invalidate on app version if needed. |
| **Vehicle-scoped product list** | TanStack Query | No | See example keys below | **Invalidate all vehicle-scoped keys when vehicle changes.** |
| **Vehicle-scoped search** | TanStack Query | No | `carSearch:{vehicleKey}:{term}:{page}:{filtersHash}` | Invalidate when vehicle changes. |
| **UI (options, mobile menu, quickview)** | Redux | options + mobile-menu: yes; quickview: no (or slug only) | N/A | No invalidation. |
| **Car search history** | localStorage (service) | Yes | N/A | Trim on add. |

---

## Example Query Keys (with vehicle signature)

- `tecdocProduct:{productId}`
- `carLookup:{regNr}` (normalize reg: trim, uppercase)
- `carDropdown:brands`
- `carDropdown:years:{brand}`
- `carDropdown:models:{brand}:{year}`
- `carDropdown:engines:{brand}:{year}:{model}`
- `carDropdown:wheel:{modelId}`
- `categoryTree:{locale}:{modelId|'global'}`
- `vehicleCategories:{modelId}:{parentId|''}`
- `carProducts:{vehicleKey}:{categoryId}:{page}:{sort}:{filtersHash}` — vehicle-scoped product list
- `carSearch:{vehicleKey}:{term}:{page}` — vehicle-scoped search

**Vehicle signature (vehicleKey):**

- `vehicleKey = vehicleId || \`${brandId}-${yearId}-${modelId}-${engineId}\`` (or equivalent stable string from current active car / garage).
- Use same format everywhere so one “vehicle change” event can invalidate all keys containing that vehicleKey (and modelId).

---

## Enforcement

- New features must store data in the owner indicated above.
- When adding new REST endpoints, add a TanStack Query key and document in this contract.
- Redux selectors must not return large server datasets; use compatibility selectors that proxy to Apollo/Query cache when migrating.
