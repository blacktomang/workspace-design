import dynamic from "next/dynamic";
import { BuilderSkeleton } from "@/components/builder/builder-skeleton";

/**
 * The builder is a heavy client-side experience (interactive scene, catalog
 * panels). It's code-split out of the server-rendered shell so first paint
 * stays fast and the chunk loads in parallel.
 */
const BuilderExperience = dynamic(
  () => import("@/components/builder/builder-experience"),
  { loading: () => <BuilderSkeleton /> }
);

export default function HomePage() {
  return <BuilderExperience />;
}
