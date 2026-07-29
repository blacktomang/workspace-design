# monis.rent Workspace Designer

Interactive 3D "design your workspace" builder for [monis.rent](https://monis.rent) — Bali office-gear rental. Pick a desk, chair, monitor and extras in a live 3D room, then send the setup to monis.rent via WhatsApp to rent it weekly.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · react-three-fiber + drei · zustand (persisted) · GSAP camera transitions.

## Commands

```bash
npm run dev    # dev server
npm run build  # production build
npm run lint   # eslint (flat config)
npx tsc --noEmit
```

## Environment

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_MONIS_WHATSAPP` — monis.rent's WhatsApp number (international format, no `+`). Defaults to a placeholder.

## How it's organized

- `src/lib/products.ts` — the catalog: single source of truth for products, prices (USD/week) and monitor IDs (`MONITOR_IDS`, `isMonitorId`).
- `src/lib/store/workspace-store.ts` — zustand store, persisted to localStorage (`monis-workspace`, versioned + migrated). UI-only state (fullscreen, camera) is not persisted.
- `src/components/builder/scene3d/` — three.js scene, loaded client-only via `next/dynamic(..., { ssr: false })`.
- `src/components/builder/scene/` — SVG fallback scene for no-WebGL / canvas crash. Both scenes switch on the same product IDs from the catalog.
- `src/components/builder/catalog/` — catalog card components (select / accessory / monitor / poster).
- Checkout (`/checkout`) summarizes the setup and deep-links to WhatsApp.

Deploy target: Vercel.
