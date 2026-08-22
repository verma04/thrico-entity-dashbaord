"use client";

import React from "react";
import Link from "next/link";
import { Plus, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ManualBannerProps {
  onCreateClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const ManualBanner: React.FC<ManualBannerProps> = ({
  onCreateClick,
  onHowItWorksClick,
}) => {
  return (
    <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-1.5">
            <Badge className="bg-emerald-600 text-white font-bold px-2 py-0.2 text-[9px] uppercase tracking-wider">
              Pillar 1
            </Badge>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              Self-Sovereign Internal Engine
            </span>
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Manual / Internal Vouchers
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create, issue, and manage proprietary voucher assets with 1:1 serial pools or 1:N shared campaigns with zero vendor costs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onHowItWorksClick && (
            <Button
              variant="outline"
              onClick={onHowItWorksClick}
              className="text-xs font-semibold h-8 gap-1.5 border-emerald-300 dark:border-emerald-800 bg-background/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              How Manual Works
            </Button>
          )}

          {onCreateClick ? (
            <Button
              onClick={onCreateClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Internal Voucher
            </Button>
          ) : (
            <Link href="/gamification/rewards/coupons/create">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs">
                <Plus className="h-3.5 w-3.5" />
                Create Internal Voucher
              </Button>
            </Link>
          )}

          <Link href="/gamification/rewards/coupons">
            <Button variant="outline" className="text-xs font-medium h-8 gap-1">
              Vouchers & Batches
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
