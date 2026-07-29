"use client";

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
    <>
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <WorkspaceCanvas className="order-1 animate-fade-up lg:order-2" />
        <CatalogPanel />
      </div>

      <PriceBar />
    </>
  );
}
