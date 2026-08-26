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
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-1.5">
            <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.2 text-[9px] uppercase tracking-wider">
              Pillar 1
            </Badge>
            <span className="text-[11px] font-medium text-muted-foreground">
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

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/gamification/rewards/coupons">
            <Button variant="outline" className="text-xs font-medium h-8 gap-1 shadow-2xs">
              Vouchers & Batches
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
