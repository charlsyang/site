import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

const isRenderingOnServer = typeof window === "undefined";

/**
 * Returns true if the user prefers reduced motion.
 *
 * - On server: returns true (safe default - no autoplay)
 * - On client: synchronously checks media query on initial render
 * - Responds to changes (including DevTools emulation)
 */
function getInitialState() {
  // For SSR, assume reduced motion (safe default).
  // This will be corrected on client hydration.
  if (isRenderingOnServer) return true;

  // On client, check immediately (no null/undefined state)
  return !window.matchMedia(QUERY).matches;
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(getInitialState);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);

    const listener = (event) => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion;
