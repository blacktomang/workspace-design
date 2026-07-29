"use client";

import { Armchair, Check, Table2 } from "lucide-react";
import type { Product } from "@/lib/products";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn, formatUSD } from "@/lib/utils";

/** Single-choice card for desks and chairs. */
export function SelectCard({ product }: { product: Product }) {
  const selectedId = useWorkspaceStore((s) =>
    product.category === "desk" ? s.deskId : s.chairId
  );
  const setDesk = useWorkspaceStore((s) => s.setDesk);
  const setChair = useWorkspaceStore((s) => s.setChair);

  const selected = selectedId === product.id;
  const Icon = product.category === "desk" ? Table2 : Armchair;

  return (
    <button
      type="button"
      onClick={() =>
        product.category === "desk" ? setDesk(product.id) : setChair(product.id)
      }
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-medium">{product.name}</span>
          {selected && <Check className="size-4 shrink-0 text-primary" />}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </span>
        <span className="mt-1.5 block text-sm font-semibold text-primary">
          {formatUSD(product.priceWeekly)}
          <span className="text-xs font-normal text-muted-foreground">
            /week
          </span>
        </span>
      </span>
    </button>
  );
}
