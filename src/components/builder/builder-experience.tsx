"use client";

import { useWorkspaceStore, selectMonthlyTotal } from "@/lib/store/workspace-store";
import { formatIDR } from "@/lib/utils";

/**
 * Placeholder for the interactive workspace builder.
 * Will become: visual scene preview + catalog panels (desks/chairs/accessories).
 */
export default function BuilderExperience() {
  const deskId = useWorkspaceStore((s) => s.deskId);
  const chairId = useWorkspaceStore((s) => s.chairId);
  const accessories = useWorkspaceStore((s) => s.accessories);
  const total = useWorkspaceStore(selectMonthlyTotal);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Design Your Workspace</h1>
      <p className="text-muted-foreground">
        Builder foundation is ready — desk: {deskId}, chair: {chairId},{" "}
        accessories: {Object.keys(accessories).length}
      </p>
      <p className="rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground">
        {formatIDR(total)} / month
      </p>
    </section>
  );
}
