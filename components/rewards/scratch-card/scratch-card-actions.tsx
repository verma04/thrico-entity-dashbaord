"use client";

import React from "react";
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
  Copy,
  Trash2,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { ScratchRewardTier } from "./types";

import Link from "next/link";

export interface ScratchCardActionsProps {
  tier: ScratchRewardTier;
  onEdit?: (tier: ScratchRewardTier) => void;
  onDelete: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => Promise<void>;
  trigger?: React.ReactNode;
}

export function ScratchCardActions({
  tier,
  onEdit,
  onDelete,
  onToggleActive,
  trigger,
}: ScratchCardActionsProps) {
  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tier.id);
    toast.success("Tier ID copied to clipboard");
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleActive) {
      onToggleActive(tier.id, !(tier.isActive !== false));
    }
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
          {tier.label}
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link
            href={`/gamification/rewards/engagement-games/scratch-card/${tier.id}`}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5 flex items-center"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            Edit Tier
          </Link>
        </DropdownMenuItem>

        {onToggleActive && (
          <DropdownMenuItem
            onClick={handleToggle}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            {tier.isActive !== false ? (
              <>
                <Ban className="h-3.5 w-3.5 text-rose-500" />
                <span>Deactivate Tier</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Activate Tier</span>
              </>
            )}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={handleCopyId}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Tier ID
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete(tier.id);
          }}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
          Delete Tier
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ScratchCardActions;
