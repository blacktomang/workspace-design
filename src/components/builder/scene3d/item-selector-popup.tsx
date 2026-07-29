"use client";

import { Check, X } from "lucide-react";
import { DESKS, CHAIRS, useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn, formatUSD } from "@/lib/utils";

export function ItemSelectorPopup() {
  const selectedItem = useWorkspaceStore((s) => s.selectedItem);
  const showPopup = useWorkspaceStore((s) => s.showItemPopup);
  const deskId = useWorkspaceStore((s) => s.deskId);
  const chairId = useWorkspaceStore((s) => s.chairId);
  const setDesk = useWorkspaceStore((s) => s.setDesk);
  const setChair = useWorkspaceStore((s) => s.setChair);
  const setShowPopup = useWorkspaceStore((s) => s.setShowItemPopup);
  const selectItem = useWorkspaceStore((s) => s.selectItem);

  if (!showPopup || !selectedItem) return null;

  const items = selectedItem === "desk" ? DESKS : CHAIRS;
  const currentId = selectedItem === "desk" ? deskId : chairId;
  const label = selectedItem === "desk" ? "Desk" : "Chair";

  const handleSelect = (id: string) => {
    if (selectedItem === "desk") setDesk(id);
    else setChair(id);
    setShowPopup(false);
    selectItem(undefined);
  };

  const handleClose = () => {
    setShowPopup(false);
    selectItem(undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Popup */}
      <div
        className="relative z-10 mx-4 w-full max-w-sm animate-in fade-in zoom-in-95 rounded-2xl border border-border bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Choose {label}</h3>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const isSelected = item.id === currentId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3 text-left transition-all hover:border-primary/40",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                    : "border-border bg-card"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <span className="text-xs font-bold">
                    {item.name.charAt(0)}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">{item.name}</span>
                    {isSelected && (
                      <Check className="size-3.5 shrink-0 text-primary" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {formatUSD(item.priceWeekly)}/week
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
