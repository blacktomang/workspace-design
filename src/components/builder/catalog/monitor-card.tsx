"use client";

import { Check, Monitor } from "lucide-react";
import type { Product } from "@/lib/products";
import {
  selectHasMonitor,
  useWorkspaceStore,
} from "@/lib/store/workspace-store";
import { cn, formatUSD } from "@/lib/utils";
import { ACCESSORY_ICONS } from "./accessory-icons";

/** Selectable monitor card — click to switch monitor type. */
export function MonitorInfoCard({ product }: { product: Product }) {
  const monitorId = useWorkspaceStore((s) => s.monitorId);
  const hasMonitor = useWorkspaceStore(selectHasMonitor);
  const setMonitor = useWorkspaceStore((s) => s.setMonitor);

  const isSelected = hasMonitor && monitorId === product.id;
  const Icon = ACCESSORY_ICONS[product.id] ?? Monitor;

  return (
    <button
      type="button"
      onClick={() => setMonitor(product.id)}
      aria-pressed={isSelected}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all",
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-medium">{product.name}</span>
          {isSelected && <Check className="size-4 shrink-0 text-primary" />}
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
