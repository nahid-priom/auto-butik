/**
 * Single source for API backend base URL.
 * - In the browser: returns '' so requests go to same-origin /car, /tecdoc and Next/Vite proxy handles CORS.
 * - On the server (SSR): returns full backend URL from env.
 * No trailing slash.
 */
function getBackendUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  const viteEnv =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>)
      : {};
  const nodeEnv =
    typeof process !== "undefined" && process.env ? process.env : {};
  const url =
    viteEnv.VITE_BACKEND_URL ??
    viteEnv.VITE_API_BASE_URL ??
    nodeEnv.NEXT_PUBLIC_BACKEND_URL ??
    nodeEnv.NEXT_PUBLIC_API_URL ??
    nodeEnv.BASE_PATH ??
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export { getBackendUrl };
