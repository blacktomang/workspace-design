"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACCESSORIES, CHAIRS, DESKS, getProduct } from "@/lib/products";

export const MONITOR_IDS = ["acc-monitor-27", "acc-monitor-34"] as const;

export interface WorkspaceState {
  deskId: string;
  chairId: string;
  /** Which monitor type is selected (acc-monitor-27 or acc-monitor-34) */
  monitorId: string;
  /** accessoryId -> quantity */
  accessories: Record<string, number>;
  /** dataURL of the user's uploaded poster image */
  posterImage: string | null;
  setDesk: (id: string) => void;
  setChair: (id: string) => void;
  setMonitor: (id: string) => void;
  addAccessory: (id: string) => void;
  removeAccessory: (id: string) => void;
  setAccessoryQty: (id: string, qty: number) => void;
  setPosterImage: (dataUrl: string | null) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  deskId: DESKS[0].id,
  chairId: CHAIRS[0].id,
  monitorId: MONITOR_IDS[0],
  accessories: {} as Record<string, number>,
  posterImage: null as string | null,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setDesk: (id) => set({ deskId: id }),
      setChair: (id) => set({ chairId: id }),
      setMonitor: (id) => set({ monitorId: id }),
      addAccessory: (id) =>
        set((s) => {
          const max = getProduct(id)?.maxQty ?? 99;
          const qty = s.accessories[id] ?? 0;
          if (qty >= max) return s;
          return { accessories: { ...s.accessories, [id]: qty + 1 } };
        }),
      removeAccessory: (id) =>
        set((s) => {
          const qty = (s.accessories[id] ?? 0) - 1;
          const next = { ...s.accessories };
          if (qty <= 0) delete next[id];
          else next[id] = qty;
          return { accessories: next };
        }),
      setAccessoryQty: (id, qty) =>
        set((s) => {
          const max = getProduct(id)?.maxQty ?? 99;
          const clamped = Math.max(0, Math.min(qty, max));
          const next = { ...s.accessories };
          if (clamped === 0) delete next[id];
          else next[id] = clamped;
          return { accessories: next };
        }),
      setPosterImage: (dataUrl) =>
        set((s) => ({
          posterImage: dataUrl,
          accessories:
            dataUrl && !(s.accessories["acc-poster"] ?? 0)
              ? { ...s.accessories, "acc-poster": 1 }
              : s.accessories,
        })),
      reset: () => set(DEFAULT_STATE),
    }),
    { name: "monis-workspace", version: 1 }
  )
);

/** Derived selectors (pure — safe to use anywhere) */
export function selectWeeklyTotal(
  s: Pick<WorkspaceState, "deskId" | "chairId" | "monitorId" | "accessories">
) {
  const desk = getProduct(s.deskId)?.priceWeekly ?? 0;
  const chair = getProduct(s.chairId)?.priceWeekly ?? 0;
  const monitor = s.accessories["acc-monitor-27"] || s.accessories["acc-monitor-34"]
    ? (getProduct(s.monitorId)?.priceWeekly ?? 0)
    : 0;
  const accessories = Object.entries(s.accessories).reduce((sum, [id, qty]) => {
    // Skip monitor IDs — they're priced via monitorId above
    if (id === "acc-monitor-27" || id === "acc-monitor-34") return sum;
    return sum + (getProduct(id)?.priceWeekly ?? 0) * qty;
  }, 0);
  return desk + chair + monitor + accessories;
}

export function selectItemCount(s: Pick<WorkspaceState, "accessories">) {
  return Object.values(s.accessories).reduce((a, b) => a + b, 0);
}

export { DESKS, CHAIRS, ACCESSORIES };
