"use client";

import { Armchair, Monitor, Sparkles, Table2, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { AccessoryCard } from "@/components/builder/catalog/accessory-card";
import { MonitorInfoCard } from "@/components/builder/catalog/monitor-card";
import { SelectCard } from "@/components/builder/catalog/select-card";
import {
  ACCESSORIES,
  CHAIRS,
  DESKS,
  getProduct,
  MONITOR_IDS,
  type Category,
  type Product,
} from "@/lib/products";
import { cn } from "@/lib/utils";

const TABS: { id: Category | "monitor"; label: string; icon: LucideIcon }[] = [
  { id: "desk", label: "Desks", icon: Table2 },
  { id: "chair", label: "Chairs", icon: Armchair },
  { id: "monitor", label: "Monitors", icon: Monitor },
  { id: "accessory", label: "Extras", icon: Sparkles },
];

const CATEGORY_ITEMS: Record<Category, Product[]> = {
  desk: DESKS,
  chair: CHAIRS,
  accessory: ACCESSORIES,
};

export function CatalogPanel() {
  const [tab, setTab] = useState<Category | "monitor">("desk");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-1 rounded-full bg-muted p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              tab === id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="max-h-[calc(100vh-320px)] min-h-0 overflow-y-auto pb-2">
        <div key={tab} className="flex animate-fade-up flex-col gap-2.5">
          {tab === "monitor" ? (
            <>
              {MONITOR_IDS.map((id) => {
                const product = getProduct(id);
                if (!product) return null;
                return <MonitorInfoCard key={id} product={product} />;
              })}
            </>
          ) : tab === "accessory" ? (
            ACCESSORIES.map((p) => <AccessoryCard key={p.id} product={p} />)
          ) : (
            CATEGORY_ITEMS[tab].map((p) => (
              <SelectCard key={p.id} product={p} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
