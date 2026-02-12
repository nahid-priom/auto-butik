/**
 * Safe React list keys: deterministic, unique among siblings, SSR-safe.
 * Use for any .map() that renders list items to avoid "Encountered two children
 * with the same key" and hydration issues. When backend sends duplicate IDs,
 * we still render all rows by appending __dupN only when collisions occur.
 *
 * Strategy: Prefer a composite base key (e.g. id|name|value). Use the `prefix`
 * option when the same list type is rendered in multiple sibling blocks (e.g.
 * "spec" for column 1 and "spec2" for column 2) so keys cannot collide across
 * those blocks. Never use Math.random() or Date.now(); index only as last resort.
 */

const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

/**
 * Deterministic JSON stringify: object keys are sorted so that the same
 * logical object always produces the same string (SSR vs client, re-renders).
 */
export function stableStringify(obj: unknown): string {
    if (obj === null) return "null";
    if (obj === undefined) return "undefined";
    if (typeof obj !== "object") return String(obj);
    if (Array.isArray(obj)) {
        return "[" + obj.map((v) => stableStringify(v)).join(",") + "]";
    }
    const keys = Object.keys(obj).sort();
    const pairs = keys.map((k) => stableStringify(k) + ":" + stableStringify((obj as Record<string, unknown>)[k]));
    return "{" + pairs.join(",") + "}";
}

/**
 * Build a stable base key from an item by reading preferred fields in order.
 * Uses the first field that exists; if multiple are given, builds a composite.
 * Prefer composite keys (e.g. id + name) when a single id can duplicate.
 */
export function buildBaseKey<T>(item: T, preferredFields: (keyof T)[]): string {
    const parts: string[] = [];
    for (const field of preferredFields) {
        const v = item[field];
        if (v !== undefined && v !== null && v !== "") {
            parts.push(typeof v === "object" ? stableStringify(v) : String(v));
        }
    }
    if (parts.length === 0) return "";
    return parts.join("|");
}

export type GetBaseKeyFn<T> = (item: T, index: number) => string;

/**
 * Returns an array of { item, key } with keys unique among siblings.
 * - Base key comes from getBaseKey(item, index).
 * - On duplicate base keys we append __dup1, __dup2, ... (deterministic, stable).
 * - Index is used only as last resort when base key is empty (e.g. indistinguishable items).
 * Dev-only: logs duplicate base keys to help catch API/design issues.
 */
export function makeUniqueKeys<T>(
    items: T[],
    getBaseKey: GetBaseKeyFn<T>,
    options?: { prefix?: string; reportLabel?: string }
): { item: T; key: string }[] {
    const prefix = options?.prefix ?? "";
    const reportLabel = options?.reportLabel ?? "List";
    const seen = new Map<string, number>();
    const result: { item: T; key: string }[] = [];
    const duplicateBases: string[] = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let base = getBaseKey(item, i);
        if (base === "") base = `__idx${i}`;
        const baseWithPrefix = prefix ? `${prefix}:${base}` : base;

        let count = seen.get(baseWithPrefix) ?? 0;
        seen.set(baseWithPrefix, count + 1);
        const key = count === 0 ? baseWithPrefix : `${baseWithPrefix}__dup${count}`;
        result.push({ item, key });

        if (count === 1 && isDev) {
            duplicateBases.push(baseWithPrefix);
        }
    }

    if (isDev && duplicateBases.length > 0) {
        const uniqueDupes = [...new Set(duplicateBases)];
        console.warn(`[keys] Duplicate base keys in ${reportLabel}`, {
            duplicates: uniqueDupes,
            sample: result.filter((r) => r.key.includes("__dup")).slice(0, 5).map((r) => r.key),
        });
    }

    return result;
}

/**
 * Dev-only assertion: run on sample data to ensure makeUniqueKeys produces
 * unique keys. No-op in production.
 */
export function assertUniqueKeysForSample<T>(
    items: T[],
    getBaseKey: GetBaseKeyFn<T>,
    label?: string
): void {
    if (!isDev || items.length === 0) return;
    const withKeys = makeUniqueKeys(items, getBaseKey, { reportLabel: label ?? "Sample" });
    const keys = withKeys.map((x) => x.key);
    const set = new Set(keys);
    if (set.size !== keys.length) {
        console.warn("[keys] assertUniqueKeysForSample: duplicate keys after makeUniqueKeys", { keys, label });
    }
}
