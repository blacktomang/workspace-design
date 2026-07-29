"use client";

import { Minus, Plus, Sparkles } from "lucide-react";
import { isMonitorId, type Product } from "@/lib/products";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn, formatUSD } from "@/lib/utils";
import { ACCESSORY_ICONS } from "./accessory-icons";
import { PosterCard } from "./poster-card";

/** Quantity stepper card for extras (poster and monitors get special UI). */
export function AccessoryCard({ product }: { product: Product }) {
  const qty = useWorkspaceStore((s) => s.accessories[product.id] ?? 0);
  const addAccessory = useWorkspaceStore((s) => s.addAccessory);
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);

  if (product.id === "acc-poster") {
    return <PosterCard product={product} qty={qty} />;
  }

  // Monitors are shown in their own tab — skip in Extras
  if (isMonitorId(product.id)) {
    return null;
  }

  const max = product.maxQty ?? 99;
  const Icon = ACCESSORY_ICONS[product.id] ?? Sparkles;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-all",
        qty > 0
          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
          : "border-border bg-card"
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          qty > 0
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatUSD(product.priceWeekly)}/week
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={`Remove one ${product.name}`}
          onClick={() => removeAccessory(product.id)}
          disabled={qty === 0}
          className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-30"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-semibold tabular-nums">
          {qty}
        </span>
        <button
          type="button"
          aria-label={`Add one ${product.name}`}
          onClick={() => addAccessory(product.id)}
          disabled={qty >= max}
          className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-30"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
