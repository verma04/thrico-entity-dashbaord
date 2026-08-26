"use client";

import React from "react";
import {
  Ticket,
  Coins,
  Layers,
  Users,
  Copy,
  Check,
  MoreVertical,
  Zap,
  Package,
  Calendar,
  Edit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { safeFormat } from "@/lib/date-utils";
import { ManualCouponType } from "@/graphql/actions/rewards/manual";

export interface ManualRewardItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
  couponType: ManualCouponType | string;
  couponCode?: string;
  codePrefix?: string;
  faceValue?: number;
  currency?: string;
  totalInventory?: number;
  allocatedCount?: number;
  redeemedCount?: number;
  remainingCount?: number;
  isActive: boolean;
  validityDays?: number;
  expiryDate?: string;
  createdAt: string;
}

interface ManualRewardCardProps {
  reward: ManualRewardItem;
  currencyName?: string;
  onSimulateWin?: (reward: ManualRewardItem) => void;
  onManagePool?: (reward: ManualRewardItem) => void;
  onEdit?: (reward: ManualRewardItem) => void;
}

export function ManualRewardCard({
  reward,
  currencyName,
  onSimulateWin,
  onManagePool,
  onEdit,
}: ManualRewardCardProps) {
  const [copied, setCopied] = React.useState(false);

  const isOneToOne =
    reward.couponType === ManualCouponType.ONE_TO_ONE ||
    reward.couponType === "ONE_TO_ONE";

  const displayCode = isOneToOne
    ? `${reward.codePrefix || "VCH"}-XXXXX`
    : reward.couponCode || "PROMO";

  const total = reward.totalInventory || 50;
  const remaining = reward.remainingCount ?? Math.max(0, total - (reward.redeemedCount || 0));
  const redeemed = reward.redeemedCount || 0;
  const percentUsed = Math.min(100, Math.round((redeemed / (total || 1)) * 100));

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    toast.success(`Copied "${displayCode}" to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const coverUrl = reward.image
    ? reward.image.startsWith("http")
      ? reward.image
      : `https://cdn.thrico.network/${reward.image}`
    : null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-2xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top Status Accent Bar */}
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10",
          reward.isActive ? "bg-emerald-500" : "bg-muted-foreground/40"
        )}
      />

      {/* Top Banner / Image Section */}
      <div className="relative h-28 w-full overflow-hidden bg-muted/40 border-b border-border/50 shrink-0">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={reward.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent flex items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
              {isOneToOne ? (
                <Layers className="h-5 w-5" />
              ) : (
                <Ticket className="h-5 w-5" />
              )}
            </div>
          </div>
        )}

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
          <Badge
            className={cn(
              "text-[9px] font-bold px-1.5 py-0 uppercase tracking-wider text-white shadow-2xs",
              reward.isActive ? "bg-emerald-600" : "bg-zinc-600"
            )}
          >
            {reward.isActive ? "Active" : "Draft"}
          </Badge>

          <Badge
            variant="outline"
            className="bg-black/60 backdrop-blur-xs text-white border-white/20 text-[9px] font-bold uppercase gap-1"
          >
            {isOneToOne ? (
              <Layers className="h-2.5 w-2.5 text-emerald-400" />
            ) : (
              <Users className="h-2.5 w-2.5 text-blue-400" />
            )}
            {isOneToOne ? "1:1 Pool" : "1:N Promo"}
          </Badge>
        </div>

        {/* Top Right Action Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={handleCopy} className="text-xs gap-2">
                <Copy className="h-3.5 w-3.5" />
                Copy Code / Series
              </DropdownMenuItem>
              {onSimulateWin && (
                <DropdownMenuItem
                  onClick={() => onSimulateWin(reward)}
                  className="text-xs gap-2 text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Simulate Voucher Claim
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(reward)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Campaign Config
                </DropdownMenuItem>
              )}
              {onManagePool && (
                <DropdownMenuItem
                  onClick={() => onManagePool(reward)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Package className="h-3.5 w-3.5" />
                  Inspect Voucher Pool
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {reward.title}
          </h4>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {reward.description || "Proprietary internal voucher asset."}
          </p>
        </div>

        {/* Code / Series Box with Click-to-copy */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border/60">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
              {isOneToOne ? "Series Template" : "Promo String"}
            </span>
            <span className="font-mono text-xs font-bold text-foreground truncate block">
              {displayCode}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors ml-2 shrink-0 border border-transparent hover:border-border cursor-pointer"
            title="Copy"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Capacity / Utilization Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-medium text-muted-foreground flex items-center gap-1">
              <Package className="h-3 w-3" />
              {isOneToOne ? "Pool Saturation" : "Usage Limit"}
            </span>
            <span className="font-mono font-bold text-foreground">
              {isOneToOne
                ? `${remaining} / ${total} Available`
                : `${redeemed} Claimed`}
            </span>
          </div>
          <Progress
            value={percentUsed}
            className="h-1.5 bg-muted rounded-full"
          />
        </div>

        {/* Bottom Metadata Footer */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="h-3 w-3" />
            {reward.expiryDate
              ? `Exp: ${safeFormat(reward.expiryDate, "dd MMM yyyy")}`
              : reward.validityDays
              ? `${reward.validityDays}d validity`
              : "No expiry"}
          </span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            Zero vendor fee
          </span>
        </div>
      </div>
    </div>
  );
}
