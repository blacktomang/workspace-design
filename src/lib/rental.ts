import { MONIS_WHATSAPP_NUMBER } from "@/lib/config";
import { getProduct, type Product } from "@/lib/products";
import { formatIDR } from "@/lib/utils";

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
  { months: 1, discount: 0 },
  { months: 3, discount: 0.05 },
  { months: 6, discount: 0.1 },
  { months: 12, discount: 0.15 },
] as const;

export function discountFor(months: number) {
  return DURATIONS.find((d) => d.months === months)?.discount ?? 0;
}

export function buildLines(sel: WorkspaceSelection): RentalLine[] {
  const lines: RentalLine[] = [];
  const push = (p: Product | undefined, qty = 1) => {
    if (!p || qty <= 0) return;
    lines.push({
      id: p.id,
      name: p.name,
      qty,
      unitPrice: p.priceMonthly,
      lineTotal: p.priceMonthly * qty,
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
  months: number;
  discount: number;
  monthly: number;
  effectiveMonthly: number;
  total: number;
  name?: string;
}) {
  const { lines, months, discount, monthly, effectiveMonthly, total, name } =
    opts;
  const itemLines = lines
    .map(
      (l) =>
        `• ${l.qty > 1 ? `${l.qty}× ` : ""}${l.name} — ${formatIDR(l.lineTotal)}/mo`
    )
    .join("\n");
  const message = [
    `Hi monis.rent! ${name ? `I'm ${name}. ` : ""}I'd like to rent this workspace setup:`,
    "",
    itemLines,
    "",
    `Duration: ${months} month${months > 1 ? "s" : ""}${discount > 0 ? ` (−${Math.round(discount * 100)}%)` : ""}`,
    `Monthly: ${formatIDR(effectiveMonthly)}${discount > 0 ? ` (was ${formatIDR(monthly)})` : ""}`,
    `Total: ${formatIDR(total)}`,
    "",
    "— sent from the Workspace Designer",
  ].join("\n");
  return `https://wa.me/${MONIS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
