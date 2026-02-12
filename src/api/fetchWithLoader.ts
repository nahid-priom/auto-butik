/**
 * Central fetch layer: instruments all requests for the global TopLoader,
 * and adds GET cache + in-flight dedupe. Use this for all car API (and other) HTTP calls.
 */
import { loadingTrackerEndRequest, loadingTrackerStartRequest } from '~/store/loading-tracker/loadingTrackerActions';
import { pageLoadProgress } from '~/store/page-load/pageLoadActions';
import { getStoreRef } from '~/store/storeRef';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
    ts: number;
    ok: boolean;
    data: unknown;
}

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<Response>>();

function isGet(init?: RequestInit): boolean {
    const method = (init?.method ?? 'GET').toUpperCase();
    return method === 'GET';
}

/** Response-like object for cache hits so callers can use .ok and .json() */
function cachedResponse(entry: CacheEntry): Response {
    return {
        ok: entry.ok,
        json: () => Promise.resolve(entry.data),
        text: () => Promise.resolve(JSON.stringify(entry.data)),
        clone: () => cachedResponse(entry),
        headers: new Headers(),
        status: entry.ok ? 200 : 500,
        statusText: entry.ok ? 'OK' : 'Internal Server Error',
        url: '',
        redirected: false,
        type: 'basic',
        body: null,
        bodyUsed: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
    } as Response;
}

/**
 * Fetch with loading tracker and optional GET cache/dedupe.
 * @param url - Request URL
 * @param init - Fetch init (method, headers, body)
 * @param requestKey - Key for loader and cache (e.g. 'car/brands', 'car/categoryTree')
 */
export async function fetchWithLoader(
    url: string,
    init?: RequestInit,
    requestKey?: string
): Promise<Response> {
    const key = requestKey ?? url;
    const dispatch = getStoreRef()?.dispatch;
    const getReq = isGet(init);

    if (getReq) {
        const cached = cache.get(url);
        if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
            return cachedResponse(cached);
        }
        const existing = inFlight.get(url);
        if (existing) {
            await existing;
            const entry = cache.get(url);
            if (entry) return cachedResponse(entry);
        }
    }

    if (dispatch) {
        dispatch(loadingTrackerStartRequest(key));
    }

    const doFetch = async (): Promise<Response> => {
        const res = await fetch(url, {
            ...init,
            headers: { 'Content-Type': 'application/json', ...init?.headers },
        });
        if (getReq) {
            try {
                const data = await res.json().catch(() => null);
                cache.set(url, { ts: Date.now(), ok: res.ok, data });
            } catch {
                // leave cache untouched
            }
        }
        return res;
    };

    let promise: Promise<Response>;
    try {
        if (getReq) {
            promise = doFetch();
            inFlight.set(url, promise);
        } else {
            promise = doFetch();
        }
        const res = await promise;
        if (getReq && inFlight.get(url) === promise) {
            inFlight.delete(url);
        }
        if (dispatch) {
            dispatch(loadingTrackerEndRequest(key, res.ok));
            const state = getStoreRef()?.getState();
            const progress = (state as any)?.pageLoad?.progressPercent ?? 0;
            dispatch(pageLoadProgress(Math.min(90, progress + 12)));
        }
        if (getReq && cache.has(url)) {
            return cachedResponse(cache.get(url)!);
        }
        return res;
    } catch (err) {
        if (getReq && inFlight.has(url)) {
            inFlight.delete(url);
        }
        if (dispatch) {
            dispatch(loadingTrackerEndRequest(key, false));
        }
        throw err;
    }
}
