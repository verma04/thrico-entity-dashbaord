"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ManualRewardCard, ManualRewardItem } from "./manual-reward-card";

interface ManualRewardGridProps {
  rewards: ManualRewardItem[];
  loading: boolean;
  currencyName: string;
  onSimulateWin?: (reward: ManualRewardItem) => void;
  onManagePool?: (reward: ManualRewardItem) => void;
  onEdit?: (reward: ManualRewardItem) => void;
  onCreateClick?: () => void;
}

export function ManualRewardGrid({
  rewards,
  loading,
  currencyName,
  onSimulateWin,
  onManagePool,
  onEdit,
  onCreateClick,
}: ManualRewardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-card p-3.5 space-y-3"
          >
            <Skeleton className="h-28 w-full rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 p-12 text-center flex flex-col items-center justify-center gap-3 bg-muted/20">
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
          <Ticket className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h4 className="text-sm font-bold text-foreground">
            No Internal Vouchers Found
          </h4>
          <p className="text-xs text-muted-foreground">
            No manual vouchers match the selected filters or search query. Create
            your first proprietary voucher batch or shared promo code.
          </p>
        </div>
        {onCreateClick && (
          <Button
            onClick={onCreateClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold h-8 mt-1 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Internal Voucher
          </Button>
        )}
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5"
      >
        {rewards.map((reward) => (
          <motion.div
            key={reward.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            <ManualRewardCard
              reward={reward}
              currencyName={currencyName}
              onSimulateWin={onSimulateWin}
              onManagePool={onManagePool}
              onEdit={onEdit}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

