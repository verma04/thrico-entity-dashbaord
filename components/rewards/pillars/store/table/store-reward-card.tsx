"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Tag,
  Percent,
  Truck,
  Sparkles,
  ShoppingBag,
  MoreVertical,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Edit,
  Trash2,
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
import { StoreRewardItem, StoreDiscountType } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StoreRewardCardProps {
  reward: StoreRewardItem;
  onSimulateWin?: (reward: StoreRewardItem) => void;
  onEdit?: (reward: StoreRewardItem) => void;
  onDelete?: (rewardId: string) => void;
}

export const StoreRewardCard: React.FC<StoreRewardCardProps> = ({
  reward,
  onSimulateWin,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const getDiscountIcon = () => {
    switch (reward.discountType) {
      case StoreDiscountType.PERCENTAGE:
        return Percent;
      case StoreDiscountType.FREE_SHIPPING:
        return Truck;
      case StoreDiscountType.BUY_X_GET_Y:
        return Sparkles;
      case StoreDiscountType.FIXED_AMOUNT:
      default:
        return Tag;
    }
  };

  const Icon = getDiscountIcon();

  const getDiscountLabel = () => {
    switch (reward.discountType) {
      case StoreDiscountType.PERCENTAGE:
        return `${reward.discountValue}% OFF`;
      case StoreDiscountType.FREE_SHIPPING:
        return "FREE SHIPPING";
      case StoreDiscountType.BUY_X_GET_Y:
        return "BOGO SPECIAL";
      case StoreDiscountType.FIXED_AMOUNT:
      default:
        return `₹${reward.discountValue} OFF`;
    }
  };

  const handleSimulate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSimulateWin) {
      onSimulateWin(reward);
    } else {
      const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${reward.codePrefix}${suffix}`;
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`🎡 Simulated Win: Generated ${code}`, {
        description: `Synthesized via Shopify PriceRules API with single-use lock.`,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative rounded-xl border border-border/70 bg-card hover:border-indigo-300 dark:hover:border-indigo-800/80 hover:shadow-xs transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Media / Tag Area */}
      <div className="relative p-3.5 pb-2.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          {/* Discount Pill Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60">
              <Icon className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
              {getDiscountLabel()}
            </span>
            {reward.isActive ? (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active Rule" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" title="Draft / Inactive" />
            )}
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuItem
                onClick={handleSimulate}
                className="gap-2 cursor-pointer text-indigo-600 font-semibold"
              >
                <Zap className="h-3.5 w-3.5" />
                Simulate Member Win
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onEdit?.(reward)}
                className="gap-2 cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Rule Config
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toast.info("PriceRule Inspection", {
                    description: `Prefix: ${reward.codePrefix} | Min: ₹${reward.minCartSubtotal || 0} | Expiry: ${reward.validityDays}d`,
                  })
                }
                className="gap-2 cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Inspect PriceRule API
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(reward.id)}
                className="gap-2 text-red-600 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Rule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {reward.title}
          </h4>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {reward.description}
          </p>
        </div>

        {/* Requirements & Metrics */}
        <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2 text-[10px]">
          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-semibold">
              Min. Purchase
            </span>
            <span className="font-semibold text-foreground">
              {reward.minCartSubtotal ? `₹${reward.minCartSubtotal}` : "No Minimum"}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-semibold">
              Validity
            </span>
            <span className="font-semibold text-foreground">
              {reward.validityDays} Days
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-3 bg-muted/20 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground truncate">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Shopify</span>
          <span>• {reward.codePrefix}***</span>
        </div>

        {onEdit && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(reward);
            }}
            className="h-6 px-2 text-[10px] font-semibold text-foreground hover:bg-muted border-border cursor-pointer shadow-2xs gap-1"
          >
            <Edit className="h-2.5 w-2.5 text-muted-foreground" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};
