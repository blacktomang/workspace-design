"use client";

import { Expand, Minimize, MousePointerClick, Orbit } from "lucide-react";
import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
import { WorkspaceScene } from "@/components/builder/scene/workspace-scene";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";
import { FloatingPanel } from "./floating-panel";

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

  const isFullscreen = useWorkspaceStore((s) => s.isFullscreen);
  const setFullscreen = useWorkspaceStore((s) => s.setFullscreen);

  // ESC key exits fullscreen
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setFullscreen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen, setFullscreen]);

  if (!webglOk) {
    return <WorkspaceScene className={className} />;
  }

  return (
    <div
      className={cn(
        "group/canvas",
        isFullscreen
          ? "fixed inset-0 z-50 overflow-hidden rounded-none border-none bg-black"
          : "relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className={cn(isFullscreen ? "h-full w-full" : "aspect-900/620 w-full")}>
        <SceneErrorBoundary fallback={<WorkspaceScene className="border-0" />}>
          <CanvasInner />
        </SceneErrorBoundary>
      </div>

      {/* Fullscreen toggle — always visible */}
      <button
        type="button"
        onClick={() => setFullscreen(!isFullscreen)}
        className={cn(
          "absolute z-30 flex size-9 items-center justify-center rounded-xl border border-border bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition-all hover:bg-card hover:text-foreground",
          isFullscreen ? "right-4 top-4" : "right-3 top-3"
        )}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Minimize className="size-4" />
        ) : (
          <Expand className="size-4" />
        )}
      </button>

      {/* Orbit hint — always visible; pushed up in fullscreen to clear the mobile bottom sheet */}
      <div
        className={cn(
          "pointer-events-none absolute left-3 flex items-center gap-3 rounded-full border border-border bg-background/85 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur",
          isFullscreen
            ? "bottom-24 lg:bottom-4"
            : "bottom-3"
        )}
      >
        <span className="inline-flex items-center gap-1">
          <Orbit className="size-3.5" /> Drag to orbit
        </span>
        <span className="inline-flex items-center gap-1">
          <MousePointerClick className="size-3.5" /> Click items to swap
        </span>
      </div>

      {/* Floating panel — only visible in fullscreen */}
      {isFullscreen && <FloatingPanel />}
    </div>
  );
}
