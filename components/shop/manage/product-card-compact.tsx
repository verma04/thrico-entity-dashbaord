"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Store,
  Eye,
  Layers,
} from "lucide-react";
import { ProductActions } from "./product-actions";
import { cn } from "@/lib/utils";

interface ProductCardCompactProps {
  product: any;
  onEdit?: (product: any) => void;
  refetch?: (variables?: any) => Promise<any> | void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  INACTIVE: {
    label: "Inactive",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  ARCHIVED: {
    label: "Archived",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export function ProductCardCompact({
  product,
  onEdit,
  refetch,
}: ProductCardCompactProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const statusInfo = STATUS_CONFIG[product.status?.toUpperCase()] || {
    label: product.status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  const coverUrl =
    !imgError && product.media?.[0]?.url
      ? product.media[0].url.startsWith("http")
        ? product.media[0].url
        : `https://cdn.thrico.network/${product.media[0].url}`
      : null;

  const inStock =
    typeof product.stock === "number" ? product.stock > 0 : true;

  return (
    <div
      onClick={() => router.push(`/shop/${product.id}/manage`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Classification-card style top color bar */}
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10",
          inStock ? "bg-emerald-500" : "bg-rose-500",
        )}
      />

      {/* ── Top Area (Image or Header Tags) ─────────────────────────────── */}
      {coverUrl ? (
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-muted">
          <Image
            src={coverUrl}
            alt={product.title || "Product cover"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Floating Price Badge (Top-Left) */}
          <div className="absolute top-2.5 left-2.5 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg px-2 py-1 flex items-center gap-1 shadow-xs leading-none">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{product.price || 0}
            </span>
          </div>

          {/* Action button (Top-Right) */}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-background/80 hover:bg-background backdrop-blur-md rounded-md shadow-xs transition-colors">
              <ProductActions
                product={product}
                refetch={() => refetch?.()}
              />
            </div>
          </div>

          {/* Category & Status pills on bottom of image */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight backdrop-blur-md border shadow-2xs",
                inStock
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
              )}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-md bg-black/50 text-white border border-white/10 shadow-2xs",
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              ₹{product.price || 0}
            </span>

            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight border",
                inStock
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
              )}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>
          </div>

          <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
            <ProductActions
              product={product}
              refetch={() => refetch?.()}
            />
          </div>
        </div>
      )}

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            {product.description || "No product description provided."}
          </p>

          {/* Store / Category info */}
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium pt-0.5">
            <Store className="h-3 w-3 text-primary/70 shrink-0" />
            <span className="truncate">
              {product.store?.name || product.category || "Official Store"}
            </span>
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            {product.variants && product.variants.length > 0 && (
              <div className="flex items-center gap-1 text-foreground/80 font-medium">
                <Layers className="h-3 w-3 text-muted-foreground shrink-0" />
                <span>{product.variants.length}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  variants
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3 w-3 shrink-0" />
              <span>{product.viewsCount || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {product.isFeatured && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardCompact;
