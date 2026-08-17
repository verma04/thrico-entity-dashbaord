"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, Copy, Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CommerceCoupon {
  id: string;
  code?: string | null;
  title?: string | null;
  discountType?: string | null;
  value?: number | null;
  amount?: string | null;
  currency?: string | null;
  timesUsed?: number | null;
  usageCount?: number | null;
  usageLimit?: number | null;
  status?: string | null;
}

interface CommerceCouponsFeedProps {
  coupons: CommerceCoupon[];
  loading?: boolean;
  viewAllHref: string;
}

export function CommerceCouponsFeed({
  coupons = [],
  loading = false,
  viewAllHref,
}: CommerceCouponsFeedProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const displayCoupons = coupons.slice(0, 6);

  const handleCopy = (code: string, id: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Copied code "${code}"`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm flex flex-col h-full">
      {loading ? (
        <div className="divide-y divide-border/40 p-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-7 w-7 rounded bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-6 w-14 rounded bg-muted animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      ) : displayCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground/50 flex-1">
          <Tag className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-xs font-semibold text-foreground/70">No active coupons</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
            Sync store discount rules and promotional coupons to manage rewards.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 flex-1">
          {displayCoupons.map((coupon) => {
            const code = coupon.code || coupon.title || "PROMO";
            const usage = coupon.timesUsed ?? coupon.usageCount ?? 0;
            const limit = coupon.usageLimit;
            const isPercent = coupon.discountType?.toLowerCase().includes("percent");
            const discountValue = coupon.value || coupon.amount || "Active";
            const isCopied = copiedId === coupon.id;

            return (
              <div
                key={coupon.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Tag className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 truncate">
                        {code}
                      </span>
                      <button
                        onClick={() => handleCopy(code, coupon.id)}
                        className="text-muted-foreground/50 hover:text-foreground transition-colors p-0.5"
                        title="Copy code"
                      >
                        {isCopied ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-70 group-hover:opacity-100" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                      <span>
                        Used {usage} {limit ? `/ ${limit}` : "times"}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold shrink-0"
                >
                  {isPercent ? `${discountValue}% OFF` : typeof discountValue === "number" ? `$${discountValue} OFF` : discountValue}
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-2.5 bg-muted/20 border-t border-border/40 flex justify-center">
        <Link href={viewAllHref} className="w-full">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground h-7 rounded-lg gap-1 hover:bg-muted"
          >
            View all coupons
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
