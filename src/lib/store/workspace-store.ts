"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACCESSORIES, CHAIRS, DESKS, getProduct } from "@/lib/products";

export interface WorkspaceState {
  deskId: string;
  chairId: string;
  /** accessoryId -> quantity */
  accessories: Record<string, number>;
  /** dataURL of the user's uploaded poster image */
  posterImage: string | null;
  setDesk: (id: string) => void;
  setChair: (id: string) => void;
  addAccessory: (id: string) => void;
  removeAccessory: (id: string) => void;
  setAccessoryQty: (id: string, qty: number) => void;
  setPosterImage: (dataUrl: string | null) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  deskId: DESKS[0].id,
  chairId: CHAIRS[0].id,
  accessories: {} as Record<string, number>,
  posterImage: null as string | null,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setDesk: (id) => set({ deskId: id }),
      setChair: (id) => set({ chairId: id }),
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
  s: Pick<WorkspaceState, "deskId" | "chairId" | "accessories">
) {
  const desk = getProduct(s.deskId)?.priceWeekly ?? 0;
  const chair = getProduct(s.chairId)?.priceWeekly ?? 0;
  const accessories = Object.entries(s.accessories).reduce((sum, [id, qty]) => {
    return sum + (getProduct(id)?.priceWeekly ?? 0) * qty;
  }, 0);
  return desk + chair + accessories;
}

export function selectItemCount(s: Pick<WorkspaceState, "accessories">) {
  return Object.values(s.accessories).reduce((a, b) => a + b, 0);
}

export { DESKS, CHAIRS, ACCESSORIES };
