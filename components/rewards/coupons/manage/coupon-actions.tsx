"use client";

import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Ticket,
  Upload,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

export interface CouponActionsProps {
  reward: any;
  onOpenUploadForReward?: (rewardId: string) => void;
  onManageVouchers?: (rewardId: string) => void;
  trigger?: React.ReactNode;
}

export function CouponActions({
  reward,
  onOpenUploadForReward,
  onManageVouchers,
  trigger,
}: CouponActionsProps) {
  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(reward.id);
    toast.success("Reward ID copied to clipboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-lg shadow-md border-border p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 truncate">
          {reward.title}
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link
            href={`/gamification/rewards/coupons/${reward.id}/edit`}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            Edit Reward
          </Link>
        </DropdownMenuItem>

        {onManageVouchers && (
          <DropdownMenuItem
            onClick={() => onManageVouchers(reward.id)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
            Manage Vouchers
          </DropdownMenuItem>
        )}

        {onOpenUploadForReward && (
          <DropdownMenuItem
            onClick={() => onOpenUploadForReward(reward.id)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Upload className="h-3.5 w-3.5 text-muted-foreground" />
            Upload Vouchers
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={handleCopyId}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Reward ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CouponActions;
