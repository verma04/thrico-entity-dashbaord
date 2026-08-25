"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Coins,
  ShoppingBag,
  Gift,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PillarsBannerProps {
  totalRedemptions?: number;
  activeCoupons?: number;
  loading?: boolean;
}

export const PillarsBanner: React.FC<PillarsBannerProps> = ({
  totalRedemptions = 0,
  activeCoupons = 0,
  loading = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-4 sm:p-5 shadow-xs">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 -bottom-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 top-1/2 h-36 w-36 rounded-full bg-purple-500/10 blur-2xl" />

      {/* Grid Pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04] dark:opacity-[0.08]" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Column: Heading & Info */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20">
              <Layers className="h-3 w-3" />
              Multi-Pillar Engine
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-2.5 w-2.5" />
              All 3 Active
            </span>
          </div>

          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-foreground leading-snug">
              3 Foundational Fulfillment Pillars
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed max-w-xl">
              Combine zero-cost internal vouchers, on-win Shopify discount synthesis,
              and 200+ top brand digital gift cards in one automated pipeline.
            </p>
          </div>

          {/* Quick pillar tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <Link href="/gamification/rewards/pillars/manual">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-emerald-500/10 border border-border/80 hover:border-emerald-500/30 px-2.5 py-1 transition-all cursor-pointer shadow-2xs">
                <div className="h-4 w-4 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Coins className="h-2.5 w-2.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block leading-tight">
                    Pillar 1: Manual
                  </span>
                  <span className="text-[8px] text-muted-foreground block leading-none">
                    Zero Cost
                  </span>
                </div>
                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>

            <Link href="/gamification/rewards/pillars/store">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-indigo-500/10 border border-border/80 hover:border-indigo-500/30 px-2.5 py-1 transition-all cursor-pointer shadow-2xs">
                <div className="h-4 w-4 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShoppingBag className="h-2.5 w-2.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block leading-tight">
                    Pillar 2: E-Commerce
                  </span>
                  <span className="text-[8px] text-muted-foreground block leading-none">
                    Shopify
                  </span>
                </div>
                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>

            <Link href="/gamification/rewards/pillars/gift-cards">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-violet-500/10 border border-border/80 hover:border-violet-500/30 px-2.5 py-1 transition-all cursor-pointer shadow-2xs">
                <div className="h-4 w-4 rounded bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Gift className="h-2.5 w-2.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 block leading-tight">
                    Pillar 3: Gift Cards
                  </span>
                  <span className="text-[8px] text-muted-foreground block leading-none">
                    Brand Catalog
                  </span>
                </div>
                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Engine Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 min-w-[200px] shrink-0">
          <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-2 px-2.5 flex items-center gap-2 shadow-2xs">
            <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                Fulfillment Speed
              </span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                &lt; 200 ms
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-2 px-2.5 flex items-center gap-2 shadow-2xs">
            <div className="h-7 w-7 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                Security &amp; Fraud
              </span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                100% Guarded
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-2 px-2.5 flex items-center gap-2 shadow-2xs col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="h-7 w-7 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                Gamification Sync
              </span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                Real-Time Webhook
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
