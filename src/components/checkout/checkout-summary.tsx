"use client";

import { ArrowLeft, MessageCircle, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WorkspaceScene } from "@/components/builder/scene/workspace-scene";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  buildLines,
  buildWhatsAppLink,
  DURATIONS,
  discountFor,
  linesTotal,
} from "@/lib/rental";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn, formatUSD } from "@/lib/utils";

export default function CheckoutSummary() {
  const hydrated = useHydrated();
  const deskId = useWorkspaceStore((s) => s.deskId);
  const chairId = useWorkspaceStore((s) => s.chairId);
  const accessories = useWorkspaceStore((s) => s.accessories);

  const [weeks, setWeeks] = useState(26);
  const [name, setName] = useState("");

  if (!hydrated) {
    return (
      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="h-9 w-64 animate-pulse rounded-xl bg-muted" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="aspect-[900/620] animate-pulse rounded-3xl bg-muted" />
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      </section>
    );
  }

  const lines = buildLines({ deskId, chairId, accessories });
  const weekly = linesTotal(lines);
  const discount = discountFor(weeks);
  const effectiveWeekly = weekly * (1 - discount);
  const total = effectiveWeekly * weeks;
  const waLink = buildWhatsAppLink({
    lines,
    weeks,
    discount,
    weekly,
    effectiveWeekly,
    total,
    name: name.trim() || undefined,
  });

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Keep designing
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to Rent?
      </h1>
      <p className="mt-2 flex items-center gap-2 text-muted-foreground">
        <Truck className="size-4 text-primary" />
        Delivered and assembled at your villa or co-living in Bali.
      </p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex flex-col gap-6">
          <WorkspaceScene className="animate-fade-up" />

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Rental duration</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Longer rentals get a better weekly rate.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DURATIONS.map((d) => (
                <button
                  key={d.weeks}
                  type="button"
                  onClick={() => setWeeks(d.weeks)}
                  aria-pressed={weeks === d.weeks}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 transition-all",
                    weeks === d.weeks
                      ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  )}
                >
                  <span className="font-semibold">{d.weeks} weeks</span>
                  <span
                    className={cn(
                      "text-xs",
                      d.discount > 0
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {d.discount > 0 ? `−${d.discount * 100}%` : "no discount"}
                  </span>
                </button>
              ))}
            </div>

            <label
              htmlFor="renter-name"
              className="mt-5 block text-sm font-medium"
            >
              Your name <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="renter-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="So monis.rent knows who's asking"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="font-semibold">Your setup</h2>
          <ul className="mt-2 divide-y divide-border">
            {lines.map((l) => (
              <li
                key={l.id}
                className="flex items-baseline justify-between gap-4 py-2.5 text-sm"
              >
                <span>
                  {l.qty > 1 && (
                    <span className="mr-1 font-semibold text-primary">
                      {l.qty}×
                    </span>
                  )}
                  {l.name}
                </span>
                <span className="shrink-0 font-medium tabular-nums">
                  {formatUSD(l.lineTotal)}/week
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weekly subtotal</span>
              <span className="tabular-nums">{formatUSD(weekly)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Duration discount (−{discount * 100}%)</span>
                <span className="tabular-nums">
                  −{formatUSD(weekly - effectiveWeekly)}
                </span>
              </div>
            )}
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-semibold">You pay</span>
              <span className="text-xl font-bold tabular-nums">
                {formatUSD(effectiveWeekly)}
                <span className="text-sm font-normal text-muted-foreground">
                  /week
                </span>
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{weeks}-week total</span>
              <span className="tabular-nums">{formatUSD(total)}</span>
            </div>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-5" />
            Rent via WhatsApp
          </a>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Sends your setup to monis.rent — they confirm availability and
            delivery.
          </p>
        </aside>
      </div>
    </section>
  );
}
