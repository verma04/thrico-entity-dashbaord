"use client";

import React, { useState } from "react";
import {
  Gift,
  ShoppingBag,
  Utensils,
  Sparkles,
  Car,
  Film,
  Smartphone,
  MoreVertical,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  Edit,
  Trash2,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GiftCardRuleItem } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GiftCardCardProps {
  reward: GiftCardRuleItem;
  onEdit?: (reward: GiftCardRuleItem) => void;
  onDelete?: (rewardId: string) => void;
}

export const GiftCardCard: React.FC<GiftCardCardProps> = ({
  reward,
  onEdit,
  onDelete,
}) => {
  const getBrandIcon = () => {
    switch (reward.category) {
      case "Food & Dining":
        return Utensils;
      case "Fashion & Lifestyle":
        return Sparkles;
      case "Travel & Mobility":
        return Car;
      case "Entertainment & Tech":
        return Smartphone;
      case "E-Commerce":
      default:
        return ShoppingBag;
    }
  };

  const Icon = getBrandIcon();

  return (
    <div className="group relative rounded-xl border border-border/70 bg-card hover:border-violet-300 dark:hover:border-violet-800/80 hover:shadow-xs transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Details Area */}
      <div className="relative p-3.5 pb-2.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          {/* Brand & Value Tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200/60 dark:border-violet-900/60">
              <Icon className="h-3 w-3 text-violet-600 dark:text-violet-400" />
              {reward.brand}
            </span>
            {reward.isActive ? (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active Offer" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" title="Paused" />
            )}
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuItem
                onClick={() => onEdit?.(reward)}
                className="gap-2 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Offer Config
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toast.info("Idempotency Engine Info", {
                    description: `Prefix: TXN-${reward.brand.slice(0, 3).toUpperCase()} | Fee: ₹${reward.serviceFee} | Validity: ${reward.validityMonths}mo`,
                  })
                }
                className="gap-2 cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Inspect Provider Contract
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(reward.id)}
                className="gap-2 text-red-600 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Offer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title & Denomination */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-1">
            <h4 className="text-xs font-bold text-foreground leading-tight line-clamp-1 group-hover:text-violet-600 transition-colors">
              {reward.title}
            </h4>
            <span className="text-xs font-mono font-bold text-violet-700 dark:text-violet-300 shrink-0">
              ₹{reward.denomination}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            Fulfillable via connected gift card provider on minigame victory.
          </p>
        </div>

        {/* Financial Breakdown & Metrics */}
        <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2 text-[10px]">
          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-semibold">
              Cost Per Win
            </span>
            <span className="font-semibold text-foreground font-mono">
              ₹{reward.denomination} + ₹{reward.serviceFee} = <strong className="text-violet-600 dark:text-violet-400">₹{reward.totalCostPerWin}</strong>
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-semibold">
              Total Issued
            </span>
            <span className="font-semibold text-foreground font-mono">
              {reward.totalIssued} winners
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-muted/20 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
          <span className="text-violet-600 dark:text-violet-400 font-bold">On-Demand API</span>
          <span>• ₹{reward.totalCostPerWin} / win</span>
        </div>

        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(reward)}
            className="h-6 px-2 text-[10px] font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/40 cursor-pointer shadow-2xs gap-1"
          >
            <Edit className="h-2.5 w-2.5 text-violet-600" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

