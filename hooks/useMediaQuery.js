import { useState, useEffect } from "react";

const isRenderingOnServer = typeof window === "undefined";

/**
 * Subscribe to a CSS media query.
 *
 * Lazy init reads `matchMedia` on the client (SSR returns false). Prefer
 * consumers that defer matched UI until after mount — e.g. MasonryGrid
 * returns null until mounted — so hydration stays aligned.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (isRenderingOnServer) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default useMediaQuery;
