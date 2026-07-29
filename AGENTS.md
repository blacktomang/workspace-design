<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# monis.rent Workspace Designer

Interactive 3D "design your workspace" builder for monis.rent (Bali office-gear rental). Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · react-three-fiber · zustand. Repo: `blacktomang/workspace-design` — keep `desent-bot` as collaborator (challenge requirement). Deploy target: Vercel.

## Commands

- `npm run dev` / `npm run build` / `npm run start` — usual flow; `npm run lint` runs **plain `eslint`** (flat config), not `next lint`.
- No test framework is installed. Verification chain after changes: `npm run lint && npx tsc --noEmit && npm run build`.
- Do not use Chrome MCP for testing/screenshots (user's global rule).

## Traps (learned the hard way)

- **Hydration**: zustand `persist` rehydrates from localStorage synchronously on the client, so any component rendering persisted state will SSR/CSR-mismatch. Gate on `useHydrated()` (`src/hooks/use-hydrated.ts`) and render a skeleton first — see `builder-experience.tsx` / `checkout-summary.tsx`.
- **Store versioning**: persisted under key `monis-workspace` with `version: 1`. When product IDs or state shape change, bump `version`, or old persisted IDs silently no-op against the new catalog.
- **three.js boundary**: all `three`/R3F imports must stay inside `src/components/builder/scene3d/` behind `next/dynamic(..., { ssr: false })` in `workspace-canvas.tsx`. `ssr: false` is illegal in Server Components — the wrapper is a client component; never import three from a server module.
- **Two scenes, one catalog**: `scene3d/` (3D) and `scene/` (SVG WebGL fallback) both switch on product IDs from `src/lib/products.ts`. Adding/renaming a product ID means updating both `desks.tsx`/`chairs.tsx` pairs or the fallback renders the wrong variant.
- **ESLint `react-hooks/set-state-in-effect`**: sync `setState` inside effects errors. Set state only in async callbacks (see `poster.tsx` texture loading) or use the `useHydrated` `useSyncExternalStore` pattern.

## Conventions

- Tailwind v4, no `tailwind.config`: design tokens + keyframes live in `src/app/globals.css` (`@theme inline`); dark mode via `@custom-variant dark` + `next-themes` (`attribute="class"`).
- Catalog (`src/lib/products.ts`) is the single source of truth; prices are **USD per week** (`formatUSD` in `lib/utils`). Rental durations are in weeks (`src/lib/rental.ts`).
- monis.rent's WhatsApp number: `src/lib/config.ts`, overridable via `NEXT_PUBLIC_MONIS_WHATSAPP`.
- Commits: conventional, small and feature-scoped (`feat:` / `chore:` / `fix:`), per user preference.
- Do not run dev server, run web mcp to test, or event build
