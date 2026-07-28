"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import {
  selectItemCount,
  selectWeeklyTotal,
  useWorkspaceStore,
} from "@/lib/store/workspace-store";
import { formatUSD } from "@/lib/utils";

export function PriceBar() {
  const total = useWorkspaceStore(selectWeeklyTotal);
  const accessoryCount = useWorkspaceStore(selectItemCount);
  const reset = useWorkspaceStore((s) => s.reset);

  return (
    <div className="sticky bottom-4 z-30 mt-8">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-2xl border border-border bg-card/95 p-3 pl-5 shadow-lg backdrop-blur">
        <div>
          <p className="text-xs text-muted-foreground">
            Weekly total · {accessoryCount + 2} items
          </p>
          <p className="text-xl font-bold tracking-tight">
            <span key={total} className="animate-price">
              {formatUSD(total)}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              /week
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Rent Your Setup
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
