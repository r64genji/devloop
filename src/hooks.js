import { useEffect, useState } from "react";

// Like useState, but survives reloads. Storage can be blocked (private mode),
// so every read and write is guarded.
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(`devloop:${key}`);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(`devloop:${key}`, JSON.stringify(value));
    } catch {
      /* storage unavailable: keep the in-memory value */
    }
  }, [key, value]);
  return [value, setValue];
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// Smooth scrolling, unless the user asked for less motion
export const scrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

// Wraps a handler so it runs after a popover or menu closes
export const closeThen = (close, fn) => () => {
  close();
  fn();
};
