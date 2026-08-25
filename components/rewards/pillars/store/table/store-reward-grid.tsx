"use client";

import React from "react";
import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreRewardCard } from "./store-reward-card";
import { StoreRewardItem } from "../types";

interface StoreRewardGridProps {
  rewards: StoreRewardItem[];
  loading?: boolean;
  onCreateClick?: () => void;
  onSimulateWin?: (reward: StoreRewardItem) => void;
  onEdit?: (reward: StoreRewardItem) => void;
  onDelete?: (rewardId: string) => void;
}

export const StoreRewardGrid: React.FC<StoreRewardGridProps> = ({
  rewards,
  loading = false,
  onCreateClick,
  onSimulateWin,
  onEdit,
  onDelete,
}) => {
  if (!loading && rewards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xs">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-foreground">
            No Store Reward Rules Found
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm">
            Configure your first on-demand Shopify store discount rule to synthesize discount codes on member minigame wins.
          </p>
        </div>
        {onCreateClick && (
          <Button
            onClick={onCreateClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-8 shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Store Reward
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {rewards.map((reward) => (
        <StoreRewardCard
          key={reward.id}
          reward={reward}
          onSimulateWin={onSimulateWin}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
