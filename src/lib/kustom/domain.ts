/**
 * Domain helpers for Kustom merchant_urls (e.g. detect Vercel/preview to show client warning).
 */

/** True if URL host is a Vercel deployment (*.vercel.app or preview-style host). */
export function isVercelDomain(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    try {
        const u = new URL(url.startsWith('http') ? url : `https://${url}`);
        const host = u.hostname.toLowerCase();
        if (host.endsWith('.vercel.app')) return true;
        if (host.includes('vercel.app')) return true;
        if (host.endsWith('-') && host.includes('vercel')) return true;
        return false;
    } catch {
        return false;
    }
}
