"use client";

import {
  Armchair,
  Check,
  ImagePlus,
  Keyboard,
  Lamp,
  Leaf,
  Minus,
  Monitor,
  Plus,
  Sparkles,
  Table2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { fileToCompressedDataUrl } from "@/lib/image";
import {
  ACCESSORIES,
  CHAIRS,
  DESKS,
  type Category,
  type Product,
} from "@/lib/products";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn, formatUSD } from "@/lib/utils";

const TABS: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: "desk", label: "Desks", icon: Table2 },
  { id: "chair", label: "Chairs", icon: Armchair },
  { id: "accessory", label: "Extras", icon: Sparkles },
];

const ACCESSORY_ICONS: Record<string, LucideIcon> = {
  "acc-monitor-27": Monitor,
  "acc-monitor-49-gaming": Monitor,
  "acc-lamp": Lamp,
  "acc-plant": Leaf,
  "acc-keyboard": Keyboard,
  "acc-poster": ImagePlus,
  "acc-laptop-stand": Monitor,
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
          {formatUSD(product.priceWeekly)}
          <span className="text-xs font-normal text-muted-foreground">
            /week
          </span>
        </span>
      </span>
    </button>
  );
}

function AccessoryCard({ product }: { product: Product }) {
  const qty = useWorkspaceStore((s) => s.accessories[product.id] ?? 0);
  const yo = useWorkspaceStore((s) => s);
  console.log(yo)
  const addAccessory = useWorkspaceStore((s) => s.addAccessory);
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);

  if (product.id === "acc-poster") {
    return <PosterCard product={product} qty={qty} />;
  }

  // Monitors: show as a selectable type card (cycle between 27" and 49" gaming)
  if (product.id === "acc-monitor-27" || product.id === "acc-monitor-49-gaming") {
    return <MonitorCard product={product} />;
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

/** Monitor card: click to toggle on/off, and cycle between 27" and 49" gaming types. */
function MonitorCard({ product }: { product: Product }) {
  const monitorId = useWorkspaceStore((s) => s.monitorId);
  const accessories = useWorkspaceStore((s) => s.accessories);
  const setMonitor = useWorkspaceStore((s) => s.setMonitor);
  const addAccessory = useWorkspaceStore((s) => s.addAccessory);
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);

  const hasMonitor =
    (accessories["acc-monitor-27"] ?? 0) + (accessories["acc-monitor-49-gaming"] ?? 0) > 0;
  const isSelected = hasMonitor && monitorId === product.id;
  const Icon = Monitor;

  const handleClick = () => {
    if (!hasMonitor) {
      // Turn on: add current product and set as selected
      addAccessory(product.id);
      setMonitor(product.id);
    } else if (monitorId === product.id) {
      // Turn off
      removeAccessory(monitorId);
    } else {
      // Switch type
      removeAccessory(monitorId);
      addAccessory(product.id);
      setMonitor(product.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isSelected}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all",
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
          : hasMonitor
            ? "border-border bg-card opacity-60"
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

/** Custom poster: upload any image, we render it in a frame on the wall. */
function PosterCard({ product, qty }: { product: Product; qty: number }) {
  const posterImage = useWorkspaceStore((s) => s.posterImage);
  const setPosterImage = useWorkspaceStore((s) => s.setPosterImage);
  const setAccessoryQty = useWorkspaceStore((s) => s.setAccessoryQty);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setPosterImage(dataUrl);
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setPosterImage(null);
    setAccessoryQty("acc-poster", 0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-all",
        qty > 0
          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
          : "border-border bg-card"
      )}
    >
      {posterImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterImage}
          alt="Your poster"
          className="size-9 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
            qty > 0
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <ImagePlus className="size-4" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {posterImage
            ? "Looking good! Tap × to remove."
            : `${formatUSD(product.priceWeekly)}/week · upload any image`}
        </p>
      </div>
      {qty > 0 ? (
        <button
          type="button"
          aria-label="Remove poster"
          onClick={clear}
          className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        <label
          htmlFor="poster-file-input"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90",
            busy && "pointer-events-none opacity-60"
          )}
        >
          <ImagePlus className="size-3.5" />
          {busy ? "Adding…" : "Upload"}
        </label>
      )}
      {/* always mounted so clicking the 3D poster can reopen the picker */}
      <input
        id="poster-file-input"
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
