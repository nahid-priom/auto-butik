import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect that is safe for SSR: runs useLayoutEffect on the client
 * and useEffect on the server to avoid the "useLayoutEffect does nothing on
 * the server" warning and hydration issues.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
