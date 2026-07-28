"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";

function easeOutBack(t: number) {
  const c = 1.70158;
  const u = t - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
}

const DURATION = 0.45;

/**
 * Pop-in animation that replays whenever `depKey` changes: the group grows
 * from half scale with a spring-like ease-out-back. Origin should be at the
 * object's base so it grows upward from the surface it sits on.
 */
export function usePopIn<T extends Group = Group>(
  depKey: string | number,
  delay = 0
) {
  const ref = useRef<T>(null);
  const progress = useRef(1);
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current) return;
    progress.current = delay > 0 ? -delay / DURATION : 0;
  }, [depKey, delay]);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g || progress.current >= 1) return;
    progress.current = Math.min(progress.current + delta / DURATION, 1);
    const t = Math.max(progress.current, 0);
    g.scale.setScalar(0.5 + 0.5 * easeOutBack(t));
  });

  return ref;
}
