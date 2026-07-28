"use client";

import { Palmtree } from "lucide-react";
import { CatalogPanel } from "@/components/builder/catalog-panel";
import { PriceBar } from "@/components/builder/price-bar";
import { WorkspaceCanvas } from "@/components/builder/scene3d/workspace-canvas";
import { BuilderSkeleton } from "@/components/builder/builder-skeleton";
import { useHydrated } from "@/hooks/use-hydrated";

export default function BuilderExperience() {
  const hydrated = useHydrated();

  // Persisted selection lives in localStorage — render the skeleton until
  // hydration so SSR HTML and the first client render always match.
  if (!hydrated) return <BuilderSkeleton />;

  return (
    <section className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-10 sm:pt-14">
      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Palmtree className="size-3.5 text-primary" />
          Bali · office gear, rented monthly
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Design Your Workspace
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick a desk, choose a chair, throw on some monitors and a plant —
          watch your setup come to life. Rent it when it feels right.
        </p>
      </header>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <WorkspaceCanvas className="order-1 animate-fade-up lg:order-2" />
        <CatalogPanel />
      </div>

      <PriceBar />
    </section>
  );
}
