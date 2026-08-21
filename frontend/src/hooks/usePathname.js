import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks the current window pathname and
 * re-renders consumers whenever navigation occurs.
 */
export function usePathname() {
  const [pathname, setPathname] = useState(() => {
    const raw = window.location.pathname || '/';
    return raw !== '/' && raw.endsWith('/') ? raw.slice(0, -1) : raw;
  });

  useEffect(() => {
    const onPopState = () => {
      const raw = window.location.pathname || '/';
      setPathname(raw !== '/' && raw.endsWith('/') ? raw.slice(0, -1) : raw);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return pathname;
}

/**
 * Imperative navigation helper. Not a hook — can be imported anywhere.
 */
export function navigate(path) {
  const currentFull = window.location.pathname + window.location.search + window.location.hash;
  if (currentFull !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

