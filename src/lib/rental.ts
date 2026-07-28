import { MONIS_WHATSAPP_NUMBER } from "@/lib/config";
import { getProduct, type Product } from "@/lib/products";
import { formatUSD } from "@/lib/utils";

export interface WorkspaceSelection {
  deskId: string;
  chairId: string;
  accessories: Record<string, number>;
}

export interface RentalLine {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export const DURATIONS = [
  { weeks: 4, discount: 0 },
  { weeks: 12, discount: 0.05 },
  { weeks: 26, discount: 0.1 },
  { weeks: 52, discount: 0.15 },
] as const;

export function discountFor(weeks: number) {
  return DURATIONS.find((d) => d.weeks === weeks)?.discount ?? 0;
}

export function buildLines(sel: WorkspaceSelection): RentalLine[] {
  const lines: RentalLine[] = [];
  const push = (p: Product | undefined, qty = 1) => {
    if (!p || qty <= 0) return;
    lines.push({
      id: p.id,
      name: p.name,
      qty,
      unitPrice: p.priceWeekly,
      lineTotal: p.priceWeekly * qty,
    });
  };
  push(getProduct(sel.deskId));
  push(getProduct(sel.chairId));
  for (const [id, qty] of Object.entries(sel.accessories)) {
    push(getProduct(id), qty);
  }
  return lines;
}

export function linesTotal(lines: RentalLine[]) {
  return lines.reduce((sum, l) => sum + l.lineTotal, 0);
}

export function buildWhatsAppLink(opts: {
  lines: RentalLine[];
  weeks: number;
  discount: number;
  weekly: number;
  effectiveWeekly: number;
  total: number;
  name?: string;
}) {
  const { lines, weeks, discount, weekly, effectiveWeekly, total, name } = opts;
  const itemLines = lines
    .map(
      (l) =>
        `• ${l.qty > 1 ? `${l.qty}× ` : ""}${l.name} — ${formatUSD(l.lineTotal)}/week`
    )
    .join("\n");
  const message = [
    `Hi monis.rent! ${name ? `I'm ${name}. ` : ""}I'd like to rent this workspace setup:`,
    "",
    itemLines,
    "",
    `Duration: ${weeks} weeks${discount > 0 ? ` (−${Math.round(discount * 100)}%)` : ""}`,
    `Weekly: ${formatUSD(effectiveWeekly)}${discount > 0 ? ` (was ${formatUSD(weekly)})` : ""}`,
    `Total: ${formatUSD(total)}`,
    "",
    "— sent from the Workspace Designer",
  ].join("\n");
  return `https://wa.me/${MONIS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
