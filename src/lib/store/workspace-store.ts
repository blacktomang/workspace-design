"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CHAIRS,
  DESKS,
  getProduct,
  hasMonitorAccessory,
  isMonitorId,
  MONITOR_IDS,
} from "@/lib/products";
import { buildLines, linesTotal } from "@/lib/rental";

export type SelectableItem = "desk" | "chair" | "monitor";

export interface WorkspaceState {
  deskId: string;
  chairId: string;
  /** Which monitor variant is selected (one of MONITOR_IDS) */
  monitorId: string;
  /** accessoryId -> quantity */
  accessories: Record<string, number>;
  /** dataURL of the user's uploaded poster image */
  posterImage: string | null;

  /** Fullscreen + camera mode (UI-only, not persisted) */
  isFullscreen: boolean;
  cameraMode: "orbit" | "inroom";
  selectedItem?: SelectableItem;
  showItemPopup: boolean;

  setDesk: (id: string) => void;
  setChair: (id: string) => void;
  /**
   * Atomically switch the monitor variant: removes any other monitor from
   * accessories and adds this one, so scene and pricing can never diverge.
   */
  setMonitor: (id: string) => void;
  addAccessory: (id: string) => void;
  removeAccessory: (id: string) => void;
  setAccessoryQty: (id: string, qty: number) => void;
  setPosterImage: (dataUrl: string | null) => void;
  reset: () => void;
  setFullscreen: (enabled: boolean) => void;
  setCameraMode: (mode: "orbit" | "inroom") => void;
  selectItem: (itemType?: SelectableItem) => void;
  setShowItemPopup: (show: boolean) => void;
}

const DEFAULT_STATE = {
  deskId: DESKS[0].id,
  chairId: CHAIRS[0].id,
  monitorId: MONITOR_IDS[1] as string,
  accessories: { [MONITOR_IDS[1]]: 1 } as Record<string, number>,
  posterImage: null as string | null,
  isFullscreen: false,
  cameraMode: "orbit" as "orbit" | "inroom",
  selectedItem: undefined as SelectableItem | undefined,
  showItemPopup: false,
};

/** Shape that actually lands in localStorage (see partialize). */
interface PersistedWorkspace {
  deskId: string;
  chairId: string;
  monitorId: string;
  accessories: Record<string, number>;
  posterImage: string | null;
}

/**
 * v1 -> v2: product IDs changed over time (e.g. acc-monitor-34 became
 * acc-monitor-49-gaming). Drop unknown accessories, normalize to exactly one
 * monitor matching monitorId, and validate desk/chair against the catalog.
 */
function migratePersisted(persisted: unknown, version: number): PersistedWorkspace {
  const state = (persisted ?? {}) as Partial<PersistedWorkspace>;
  if (version < 2) {
    const accessories: Record<string, number> = {};
    for (const [id, qty] of Object.entries(state.accessories ?? {})) {
      if (getProduct(id) && qty > 0) accessories[id] = qty;
    }
    const presentMonitors = MONITOR_IDS.filter((id) => (accessories[id] ?? 0) > 0);
    for (const id of MONITOR_IDS) delete accessories[id];
    if (presentMonitors.length > 0) {
      const keep =
        state.monitorId && (presentMonitors as readonly string[]).includes(state.monitorId)
          ? state.monitorId
          : presentMonitors[0];
      accessories[keep] = 1;
      state.monitorId = keep;
    } else if (!state.monitorId || !isMonitorId(state.monitorId)) {
      state.monitorId = DEFAULT_STATE.monitorId;
    }
    state.accessories = accessories;
    if (!getProduct(state.deskId ?? "")) state.deskId = DEFAULT_STATE.deskId;
    if (!getProduct(state.chairId ?? "")) state.chairId = DEFAULT_STATE.chairId;
  }
  return state as PersistedWorkspace;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setDesk: (id) => set({ deskId: id }),
      setChair: (id) => set({ chairId: id }),
      setMonitor: (id) =>
        set((s) => {
          if (!isMonitorId(id)) return s;
          const accessories = { ...s.accessories };
          for (const m of MONITOR_IDS) delete accessories[m];
          accessories[id] = 1;
          return { monitorId: id, accessories };
        }),
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
      setFullscreen: (enabled) =>
        set({ isFullscreen: enabled, ...(enabled ? {} : { cameraMode: "orbit" as const }) }),
      setCameraMode: (mode) => set({ cameraMode: mode }),
      selectItem: (itemType) => set({ selectedItem: itemType, showItemPopup: !!itemType }),
      setShowItemPopup: (show) => set({ showItemPopup: show }),
      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: "monis-workspace",
      version: 2,
      migrate: migratePersisted,
      partialize: (state): PersistedWorkspace => ({
        deskId: state.deskId,
        chairId: state.chairId,
        monitorId: state.monitorId,
        accessories: state.accessories,
        posterImage: state.posterImage,
      }),
    }
  )
);

/** Derived selectors (pure — safe to use anywhere) */

/**
 * Weekly total — the same pricing pipeline as checkout (`buildLines`), so
 * the price bar and the WhatsApp quote can never disagree.
 */
export function selectWeeklyTotal(
  s: Pick<WorkspaceState, "deskId" | "chairId" | "accessories">
) {
  return linesTotal(
    buildLines({ deskId: s.deskId, chairId: s.chairId, accessories: s.accessories })
  );
}

export function selectItemCount(s: Pick<WorkspaceState, "accessories">) {
  return Object.values(s.accessories).reduce((a, b) => a + b, 0);
}

/** True when any monitor accessory is selected. */
export function selectHasMonitor(s: Pick<WorkspaceState, "accessories">) {
  return hasMonitorAccessory(s.accessories);
}
