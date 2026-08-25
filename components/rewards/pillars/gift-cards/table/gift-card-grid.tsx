"use client";

import React from "react";
import { Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GiftCardCard } from "./gift-card-card";
import { GiftCardRuleItem } from "../types";

interface GiftCardGridProps {
  rewards: GiftCardRuleItem[];
  loading?: boolean;
  onCreateClick?: () => void;
  onEdit?: (reward: GiftCardRuleItem) => void;
  onDelete?: (rewardId: string) => void;
}

export const GiftCardGrid: React.FC<GiftCardGridProps> = ({
  rewards,
  loading = false,
  onCreateClick,
  onEdit,
  onDelete,
}) => {
  if (!loading && rewards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20 shadow-xs">
          <Gift className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-foreground">
            No Digital Gift Card Offers Configured
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm">
            Add top brand vouchers (Amazon, Flipkart, Swiggy) to your gamification reward pool. Cards are purchased on-demand when members win.
          </p>
        </div>
        {onCreateClick && (
          <Button
            onClick={onCreateClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-8 shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Configure Gift Card
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {rewards.map((reward) => (
        <GiftCardCard
          key={reward.id}
          reward={reward}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
