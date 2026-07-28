"use client";

import { useWorkspaceStore, selectMonthlyTotal } from "@/lib/store/workspace-store";
import { formatIDR } from "@/lib/utils";

/**
 * Placeholder for the summary / "Rent your setup" view.
 * Reads the persisted workspace selection.
 */
export default function CheckoutSummary() {
  const deskId = useWorkspaceStore((s) => s.deskId);
  const chairId = useWorkspaceStore((s) => s.chairId);
  const accessories = useWorkspaceStore((s) => s.accessories);
  const total = useWorkspaceStore(selectMonthlyTotal);

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Ready to Rent?</h1>
      <p className="text-muted-foreground">
        Desk: {deskId} · Chair: {chairId} · Accessories:{" "}
        {Object.keys(accessories).length} · Total: {formatIDR(total)}/mo
      </p>
    </section>
  );
}
