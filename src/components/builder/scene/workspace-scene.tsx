"use client";

import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";
import { Chair } from "./chairs";
import { Desk } from "./desks";
import { DeskLamp, KeyboardSet, Monitors, Plant } from "./extras";
import { Room } from "./room";

/**
 * Live workspace preview — a layered SVG illustration that re-renders
 * (with pop animations) as the user changes their setup.
 */
export function WorkspaceScene({ className }: { className?: string }) {
  const deskId = useWorkspaceStore((s) => s.deskId);
  const chairId = useWorkspaceStore((s) => s.chairId);
  const accessories = useWorkspaceStore((s) => s.accessories);

  const monitorCount = Math.min(accessories["acc-monitor"] ?? 0, 3);
  const hasLamp = (accessories["acc-lamp"] ?? 0) > 0;
  const hasPlant = (accessories["acc-plant"] ?? 0) > 0;
  const hasKeyboard = (accessories["acc-keyboard"] ?? 0) > 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <svg
        viewBox="0 0 900 620"
        className="h-auto w-full"
        role="img"
        aria-label="Live preview of your workspace setup"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8dbe8" />
            <stop offset="100%" stopColor="#e8f6f3" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#123f3a" />
            <stop offset="100%" stopColor="#2e8b6a" />
          </linearGradient>
        </defs>

        <Room />

        <g key={deskId} className="scene-pop">
          <Desk id={deskId} />
        </g>

        {monitorCount > 0 && <Monitors count={monitorCount} />}
        {hasLamp && <DeskLamp />}
        {hasKeyboard && <KeyboardSet />}

        <g key={chairId} className="scene-pop">
          <Chair id={chairId} />
        </g>

        {hasPlant && <Plant />}
      </svg>
    </div>
  );
}
