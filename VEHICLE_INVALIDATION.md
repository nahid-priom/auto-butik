# VEHICLE_INVALIDATION.md — Vehicle-Dependent Cache Invalidation

**Critical:** When the current vehicle changes, all vehicle-scoped data must be invalidated; non-vehicle caches (e.g. dropdowns, global category tree) can remain.

---

## 1. Single Vehicle Signature

Use a **stable vehicle key** everywhere vehicle-scoped data is cached:

```ts
// vehicleKey: unique per vehicle; use for query keys and invalidation
vehicleKey = vehicleId ?? `${brandId}-${yearId}-${modelId}-${engineId}`;
```

- **vehicleId** — When using garage item id (e.g. from GarageContext), use that id as vehicleKey when it’s the only identifier.
- **From CarContext / lookup:** Build from `modell_id` or from brand/year/model/engine when available so the same logical vehicle always yields the same key.
- **modelId** — For Car API, `modell_id` (or equivalent) is the primary scope for category tree and vehicle products. Use `modelId` in keys where the API is model-scoped (e.g. `categoryTree:{modelId}`, `carProducts:{modelId}:...`).

Implementation note: export a small helper, e.g. `getVehicleKey(activeCar): string`, and use it when building TanStack Query keys and when invalidating.

---

## 2. When to Invalidate

**Trigger: “Vehicle changed”**

- User selects a different car from garage (e.g. CarIndicator, VehiclePickerModal).
- User completes a new lookup (registration or manual) and that becomes the current active car (CarContext or equivalent).
- User clears the current car.

**Action:** Invalidate all queries that depend on the **previous** vehicle (and optionally prefetch for the new one).

---

## 3. Query Keys to Invalidate on Vehicle Change

Include in invalidation (by predicate or by key prefix):

- `categoryTree:*` — or only `categoryTree:{locale}:{oldModelId}` if key includes modelId.
- `vehicleCategories:{oldModelId}:*`
- `carProducts:{oldVehicleKey}:*` (or `carProducts:{oldModelId}:*` if key uses modelId).
- `carSearch:{oldVehicleKey}:*`

**Do NOT invalidate:**

- `carLookup:{regNr}` — lookup result is keyed by reg, not vehicle.
- `carDropdown:*` — brands, years, models, engines are not vehicle-specific.
- `tecdocProduct:{productId}` — product detail is by product id; vehicle change doesn’t change TecDoc data for that product.
- `categoryTree:{locale}:''` or global tree if you have one.

---

## 4. Implementation Notes

### TanStack Query

- On “vehicle change” (in CarContext setter or when garage current changes and is used as active car):
  - Call `queryClient.removeQueries({ predicate: (query) => isVehicleScoped(query.queryKey) })` or
  - `queryClient.invalidateQueries({ queryKey: ['carProducts'] })` (and similar for categoryTree, vehicleCategories, carSearch) so refetch happens when those queries are next used.
- Prefer **invalidateQueries** over removeQueries if you want background refetch when user navigates back to a list; use **removeQueries** if you want to force a loading state on next visit.

### Central place

- One place (e.g. CarContext or a custom hook `useVehicleChange()`) should call invalidation when `currentActiveCar` or garage current changes. That way all vehicle-scoped keys are cleared in one spot.

### Example predicate

```ts
function isVehicleScopedQueryKey(key: unknown[]): boolean {
  const k = key[0];
  if (k === 'categoryTree' && typeof key[2] === 'string') return true;
  if (k === 'vehicleCategories') return true;
  if (k === 'carProducts') return true;
  if (k === 'carSearch') return true;
  return false;
}
```

Adjust to your actual key shapes (e.g. `['categoryTree', locale, modelId]`).

---

## 5. Summary

- **Single vehicle signature:** `vehicleKey` or `modelId` in every vehicle-scoped query key.
- **On vehicle change:** Invalidate category tree, vehicle categories, car products, car search for the old vehicle; leave dropdowns and TecDoc product detail untouched.
- **One central invalidation** when active car or garage current changes.
