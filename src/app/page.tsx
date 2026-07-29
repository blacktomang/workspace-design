import { Palmtree } from "lucide-react";
import dynamic from "next/dynamic";
import { BuilderSkeleton } from "@/components/builder/builder-skeleton";

/**
 * The builder is a heavy client-side experience (interactive scene, catalog
 * panels). It's code-split out of the server-rendered shell so first paint
 * stays fast and the chunk loads in parallel. The hero copy above it is
 * server-rendered — it carries the page's H1 for SEO.
 */
const BuilderExperience = dynamic(
  () => import("@/components/builder/builder-experience"),
  { loading: () => <BuilderSkeleton /> }
);

export default function HomePage() {
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

      <BuilderExperience />
    </section>
  );
}
