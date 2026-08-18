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
  Bell,
  Power,
  Copy,
} from "lucide-react";
import { Rank, useToggleRank } from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface RankActionsProps {
  rank: Rank;
  onEdit: (rank: Rank) => void;
  onOpenNotifications: (rank: Rank) => void;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function RankActions({
  rank,
  onEdit,
  onOpenNotifications,
  refetch,
  trigger,
}: RankActionsProps) {
  const [toggleRank, { loading: toggling }] = useToggleRank({
    onCompleted: () => {
      refetch?.();
      toast.success("Rank status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleRank({ variables: { id: rank.id } });
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(rank.id);
    toast.success("Rank ID copied to clipboard");
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
          {rank.name}
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => onEdit(rank)}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          Edit Rank
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onOpenNotifications(rank)}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          Edit Notifications
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleToggle}
          disabled={toggling}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Power
            className={cn(
              "h-3.5 w-3.5",
              rank.isActive ? "text-amber-500" : "text-emerald-500",
            )}
          />
          <span>{rank.isActive ? "Disable Rank" : "Activate Rank"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={handleCopyId}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Rank ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RankActions;
