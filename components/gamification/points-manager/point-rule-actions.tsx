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
import { PointRule } from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface PointRuleActionsProps {
  rule: PointRule;
  onEdit: (rule: PointRule) => void;
  onOpenNotifications: (rule: PointRule) => void;
  onToggleActive: (id: string) => void;
  trigger?: React.ReactNode;
}

export function PointRuleActions({
  rule,
  onEdit,
  onOpenNotifications,
  onToggleActive,
  trigger,
}: PointRuleActionsProps) {
  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(rule.id);
    toast.success("Point Rule ID copied to clipboard");
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
        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 truncate capitalize">
          {rule.action.replace(/_/g, " ").toLowerCase()}
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => onEdit(rule)}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          Edit Rule
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onOpenNotifications(rule)}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          Edit Notifications
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onToggleActive(rule.id)}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Power
            className={cn(
              "h-3.5 w-3.5",
              rule.isActive ? "text-amber-500" : "text-emerald-500",
            )}
          />
          <span>{rule.isActive ? "Disable Rule" : "Activate Rule"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={handleCopyId}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Rule ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PointRuleActions;
