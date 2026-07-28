"use client";

import {
  Armchair,
  Check,
  Keyboard,
  Lamp,
  Leaf,
  Minus,
  Monitor,
  Plus,
  Sparkles,
  Table2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import {
  ACCESSORIES,
  CHAIRS,
  DESKS,
  type Category,
  type Product,
} from "@/lib/products";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn, formatIDR } from "@/lib/utils";

const TABS: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: "desk", label: "Desks", icon: Table2 },
  { id: "chair", label: "Chairs", icon: Armchair },
  { id: "accessory", label: "Extras", icon: Sparkles },
];

const ACCESSORY_ICONS: Record<string, LucideIcon> = {
  "acc-monitor": Monitor,
  "acc-lamp": Lamp,
  "acc-plant": Leaf,
  "acc-keyboard": Keyboard,
};

const CATEGORY_ITEMS: Record<Category, Product[]> = {
  desk: DESKS,
  chair: CHAIRS,
  accessory: ACCESSORIES,
};

export function CatalogPanel() {
  const [tab, setTab] = useState<Category>("desk");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
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

      <div key={tab} className="flex animate-fade-up flex-col gap-2.5">
        {tab === "accessory"
          ? ACCESSORIES.map((p) => <AccessoryCard key={p.id} product={p} />)
          : CATEGORY_ITEMS[tab].map((p) => (
              <SelectCard key={p.id} product={p} />
            ))}
      </div>
    </div>
  );
}

function SelectCard({ product }: { product: Product }) {
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
          {formatIDR(product.priceMonthly)}
          <span className="text-xs font-normal text-muted-foreground">/mo</span>
        </span>
      </span>
    </button>
  );
}

function AccessoryCard({ product }: { product: Product }) {
  const qty = useWorkspaceStore((s) => s.accessories[product.id] ?? 0);
  const addAccessory = useWorkspaceStore((s) => s.addAccessory);
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);

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
          {formatIDR(product.priceMonthly)}/mo
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
