"use client";

import { Check, Eye, ImagePlus, Keyboard, Lamp, Leaf, Monitor } from "lucide-react";
import { DESKS, CHAIRS, MONITOR_IDS, useWorkspaceStore } from "@/lib/store/workspace-store";
import { getProduct } from "@/lib/products";
import { cn, formatUSD } from "@/lib/utils";

const EXTRAS: { id: string; label: string; icon: typeof Lamp; accessorKey: string }[] = [
  { id: "acc-lamp", label: "Desk Lamp", icon: Lamp, accessorKey: "acc-lamp" },
  { id: "acc-plant", label: "Plant", icon: Leaf, accessorKey: "acc-plant" },
  { id: "acc-keyboard", label: "Keyboard", icon: Keyboard, accessorKey: "acc-keyboard" },
  { id: "acc-laptop-stand", label: "Laptop Stand", icon: Monitor, accessorKey: "acc-laptop-stand" },
  { id: "acc-poster", label: "Poster", icon: ImagePlus, accessorKey: "acc-poster" },
];

export function FloatingPanel() {
  const isFullscreen = useWorkspaceStore((s) => s.isFullscreen);
  const cameraMode = useWorkspaceStore((s) => s.cameraMode);
  const accessories = useWorkspaceStore((s) => s.accessories);
  const addAccessory = useWorkspaceStore((s) => s.addAccessory);
  const removeAccessory = useWorkspaceStore((s) => s.removeAccessory);
  const setCameraMode = useWorkspaceStore((s) => s.setCameraMode);
  const selectedItem = useWorkspaceStore((s) => s.selectedItem);
  const deskId = useWorkspaceStore((s) => s.deskId);
  const chairId = useWorkspaceStore((s) => s.chairId);
  const monitorId = useWorkspaceStore((s) => s.monitorId);
  const setDesk = useWorkspaceStore((s) => s.setDesk);
  const setChair = useWorkspaceStore((s) => s.setChair);
  const setMonitor = useWorkspaceStore((s) => s.setMonitor);

  const isInRoom = cameraMode === "inroom";

  const toggleAccessory = (id: string) => {
    const qty = accessories[id] ?? 0;
    if (qty > 0) removeAccessory(id);
    else addAccessory(id);
  };

  const handleExitInRoom = () => setCameraMode("orbit");

  // Build variant items based on selected item type
  const variantItems = (() => {
    if (selectedItem === "desk") return DESKS as { id: string; name: string; priceWeekly: number }[];
    if (selectedItem === "chair") return CHAIRS as { id: string; name: string; priceWeekly: number }[];
    if (selectedItem === "monitor")
      return MONITOR_IDS.flatMap((id) => {
        const p = getProduct(id);
        return p ? [p] : [];
      });
    return null;
  })();

  const variantLabel =
    selectedItem === "desk" ? "Desk" : selectedItem === "chair" ? "Chair" : "Monitor";
  const variantCurrentId =
    selectedItem === "desk" ? deskId : selectedItem === "chair" ? chairId : monitorId;
  const onVariantSelect =
    selectedItem === "desk"
      ? setDesk
      : selectedItem === "chair"
        ? setChair
        : setMonitor;

  return (
    <div
      className={cn(
        "absolute right-4 top-1/2 z-50 -translate-y-1/2 transition-all duration-300",
        isFullscreen
          ? "pointer-events-auto translate-x-0 opacity-100"
          : "pointer-events-none translate-x-8 opacity-0"
      )}
    >
      <div className="flex w-56 flex-col gap-2.5 rounded-2xl border border-border/50 bg-background/90 p-3 shadow-2xl backdrop-blur-xl">
        {/* In-room view toggle */}
        <button
          type="button"
          onClick={() => {
            if (isInRoom) handleExitInRoom();
            else setCameraMode("inroom");
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isInRoom ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
        >
          <Eye className="size-4" />
          {isInRoom ? "Exit work view" : "Work view"}
        </button>

        {/* Variant selector — only when an item is selected */}
        {variantItems && (
          <div className="border-t border-border/50 pt-2.5">
            <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Choose {variantLabel}
            </p>
            <div className="flex flex-col gap-0.5">
              {variantItems.map((item) => {
                const isSelected = item.id === variantCurrentId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onVariantSelect(item.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary/5 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="flex-1 truncate">{item.name}</span>
                    {isSelected && <Check className="size-3.5 shrink-0 text-primary" />}
                    <span className="text-xs text-muted-foreground">
                      {formatUSD(item.priceWeekly)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Extras section */}
        <div className="border-t border-border/50 pt-2.5">
          <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Extras
          </p>
          <div className="flex flex-col gap-0.5">
            {EXTRAS.map(({ id, label, icon: Icon, accessorKey }) => {
              const active = (accessories[accessorKey] ?? 0) > 0;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleAccessory(id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/5 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span className="flex-1 text-left">{label}</span>
                  <span
                    className={cn(
                      "flex h-5 w-8 items-center rounded-full px-0.5 transition-colors",
                      active ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "size-4 rounded-full bg-white shadow-sm transition-transform",
                        active ? "translate-x-3" : "translate-x-0"
                      )}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
