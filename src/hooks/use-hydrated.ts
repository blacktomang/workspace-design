"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Hydration-safe "are we on the client, post-hydration" flag.
 * Prevents SSR/CSR mismatch when rendering persisted (localStorage) state.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
