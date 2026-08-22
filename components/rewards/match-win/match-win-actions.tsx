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
} from "lucide-react";
import { toast } from "sonner";
import { MatchWinCombination } from "./types";
import Link from "next/link";

export interface MatchWinActionsProps {
  combination: MatchWinCombination;
  onEdit?: (combination: MatchWinCombination) => void;
  onDelete: (id: string) => void;
  trigger?: React.ReactNode;
}

export function MatchWinActions({
  combination,
  onEdit,
  onDelete,
  trigger,
}: MatchWinActionsProps) {
  const combinationId = combination.id || combination.key;

  const handleCopyKey = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(combination.key || combinationId);
    toast.success("Combination key copied to clipboard");
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
          {combination.key}
        </DropdownMenuLabel>

        {combination.id ? (
          <DropdownMenuItem asChild>
            <Link
              href={`/gamification/rewards/engagement-games/match-win/${combination.id}`}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5 flex items-center"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              Edit Combination
            </Link>
          </DropdownMenuItem>
        ) : (
          onEdit && (
            <DropdownMenuItem
              onClick={() => onEdit(combination)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5 flex items-center"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              Edit Combination
            </DropdownMenuItem>
          )
        )}

        <DropdownMenuItem
          onClick={handleCopyKey}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Identifier Key
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (combination.id) onDelete(combination.id);
          }}
          disabled={!combination.id}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
          Delete Combination
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MatchWinActions;
