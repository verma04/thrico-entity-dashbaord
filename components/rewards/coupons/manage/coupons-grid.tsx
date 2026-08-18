"use client";

import React from "react";
import { Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CouponCardCompact } from "./coupon-card-compact";

interface CouponsGridProps {
  rewards: any[];
  onOpenUploadForReward: (rewardId: string) => void;
  onManageVouchers: (rewardId: string) => void;
}

export function CouponsGrid({
  rewards,
  onOpenUploadForReward,
  onManageVouchers,
}: CouponsGridProps) {
  if (!rewards || rewards.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Ticket className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No rewards in collection
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Define your first master reward offer or coupon to begin the redemption lifecycle for your members.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {rewards.map((reward) => (
        <CouponCardCompact
          key={reward.id}
          reward={reward}
          onOpenUploadForReward={onOpenUploadForReward}
          onManageVouchers={onManageVouchers}
        />
      ))}
    </div>
  );
}

export default CouponsGrid;
