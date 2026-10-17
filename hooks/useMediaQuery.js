import { useState, useEffect } from "react";

const isRenderingOnServer = typeof window === "undefined";

/**
 * Subscribe to a CSS media query.
 * SSR default is false (desktop-first) so layout/controls don't flash phone UI.
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
