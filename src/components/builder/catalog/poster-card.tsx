"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { fileToCompressedDataUrl } from "@/lib/image";
import type { Product } from "@/lib/products";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn, formatUSD } from "@/lib/utils";

/** Custom poster: upload any image, we render it in a frame on the wall. */
export function PosterCard({ product, qty }: { product: Product; qty: number }) {
  const posterImage = useWorkspaceStore((s) => s.posterImage);
  const setPosterImage = useWorkspaceStore((s) => s.setPosterImage);
  const setAccessoryQty = useWorkspaceStore((s) => s.setAccessoryQty);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setPosterImage(dataUrl);
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setPosterImage(null);
    setAccessoryQty("acc-poster", 0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-all",
        qty > 0
          ? "border-primary bg-primary/5 ring-2 ring-primary/15"
          : "border-border bg-card"
      )}
    >
      {posterImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterImage}
          alt="Your poster"
          className="size-9 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
            qty > 0
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <ImagePlus className="size-4" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {posterImage
            ? "Looking good! Tap × to remove."
            : `${formatUSD(product.priceWeekly)}/week · upload any image`}
        </p>
      </div>
      {qty > 0 ? (
        <button
          type="button"
          aria-label="Remove poster"
          onClick={clear}
          className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        <label
          htmlFor="poster-file-input"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90",
            busy && "pointer-events-none opacity-60"
          )}
        >
          <ImagePlus className="size-3.5" />
          {busy ? "Adding…" : "Upload"}
        </label>
      )}
      {/* always mounted so clicking the 3D poster can reopen the picker */}
      <input
        id="poster-file-input"
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
