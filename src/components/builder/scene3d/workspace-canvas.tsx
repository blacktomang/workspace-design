"use client";

import { MousePointerClick, Orbit } from "lucide-react";
import dynamic from "next/dynamic";
import { Component, type ReactNode, useState } from "react";
import { WorkspaceScene } from "@/components/builder/scene/workspace-scene";
import { cn } from "@/lib/utils";

/**
 * 3D workspace preview with graceful degradation:
 * the heavy three.js bundle is code-split and client-only; if WebGL is
 * unavailable or the canvas crashes, we fall back to the 2D SVG scene.
 */
const CanvasInner = dynamic(() => import("./canvas-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Orbit className="size-6 animate-spin" style={{ animationDuration: "2.5s" }} />
        <p className="text-sm">Building your room…</p>
      </div>
    </div>
  ),
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function WorkspaceCanvas({ className }: { className?: string }) {
  const [webglOk] = useState(
    () => typeof window !== "undefined" && supportsWebGL()
  );

  if (!webglOk) {
    return <WorkspaceScene className={className} />;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="aspect-900/620 w-full">
        <SceneErrorBoundary fallback={<WorkspaceScene className="border-0" />}>
          <CanvasInner />
        </SceneErrorBoundary>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-3 rounded-full border border-border bg-background/85 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
        <span className="inline-flex items-center gap-1">
          <Orbit className="size-3.5" /> Drag to orbit
        </span>
        <span className="inline-flex items-center gap-1">
          <MousePointerClick className="size-3.5" /> Click items to swap
        </span>
      </div>
    </div>
  );
}
