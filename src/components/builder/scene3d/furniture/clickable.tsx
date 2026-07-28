"use client";

import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useState, type ReactNode } from "react";

/**
 * Wraps a furniture group: pointer cursor on hover, click triggers `onSwap`.
 * Tooltip text is surfaced through the DOM hint in the canvas wrapper.
 */
export function Clickable({
  onSwap,
  children,
  label,
}: {
  onSwap: () => void;
  children: ReactNode;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer", "auto");

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSwap();
  };

  return (
    <group
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      // accessibility label kept for future Html tooltips
      userData={{ label }}
    >
      {children}
    </group>
  );
}
