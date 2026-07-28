"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACCESSORIES, CHAIRS, DESKS, getProduct } from "@/lib/products";

export interface WorkspaceState {
  deskId: string;
  chairId: string;
  /** accessoryId -> quantity */
  accessories: Record<string, number>;
  setDesk: (id: string) => void;
  setChair: (id: string) => void;
  addAccessory: (id: string) => void;
  removeAccessory: (id: string) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  deskId: DESKS[0].id,
  chairId: CHAIRS[0].id,
  accessories: {} as Record<string, number>,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setDesk: (id) => set({ deskId: id }),
      setChair: (id) => set({ chairId: id }),
      addAccessory: (id) =>
        set((s) => ({
          accessories: { ...s.accessories, [id]: (s.accessories[id] ?? 0) + 1 },
        })),
      removeAccessory: (id) =>
        set((s) => {
          const qty = (s.accessories[id] ?? 0) - 1;
          const next = { ...s.accessories };
          if (qty <= 0) delete next[id];
          else next[id] = qty;
          return { accessories: next };
        }),
      reset: () => set(DEFAULT_STATE),
    }),
    { name: "monis-workspace" }
  )
);

/** Derived selectors (pure — safe to use anywhere) */
export function selectMonthlyTotal(s: Pick<WorkspaceState, "deskId" | "chairId" | "accessories">) {
  const desk = getProduct(s.deskId)?.priceMonthly ?? 0;
  const chair = getProduct(s.chairId)?.priceMonthly ?? 0;
  const accessories = Object.entries(s.accessories).reduce((sum, [id, qty]) => {
    return sum + (getProduct(id)?.priceMonthly ?? 0) * qty;
  }, 0);
  return desk + chair + accessories;
}

export function selectItemCount(s: Pick<WorkspaceState, "accessories">) {
  return Object.values(s.accessories).reduce((a, b) => a + b, 0);
}

export { DESKS, CHAIRS, ACCESSORIES };
