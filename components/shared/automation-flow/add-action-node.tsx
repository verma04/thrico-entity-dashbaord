"use client";

import React, { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Plus, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SHARED_PALETTE_ACTIONS } from "./action-palette-items";
import { SharedAddActionNodeData } from "./types";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";
import { EmailDomainSetupModal } from "@/components/members/automation/email-domain-setup-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const SharedAddActionNode = memo(({ data }: NodeProps<any>) => {
  const nodeData = data as SharedAddActionNodeData;
  const { isVerified } = useEmailDomainStatus();
  const [showDomainModal, setShowDomainModal] = useState(false);

  const handleSelectAction = (type: any) => {
    if (type === "EMAIL" && !isVerified) {
      setShowDomainModal(true);
      toast.error("Email domain setup required before adding email actions.");
      return;
    }
    nodeData.onAddAction?.(type);
  };

  return (
    <div className="group relative w-[240px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background shadow-xs"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="w-full p-3 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:scale-[1.02]"
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold">Add Action Block</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-64 p-1.5 shadow-xl">
          <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
            Select Action Type
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SHARED_PALETTE_ACTIONS.map((item) => {
            const Icon = item.icon;
            const isEmailLocked = item.type === "EMAIL" && !isVerified;
            return (
              <DropdownMenuItem
                key={item.type}
                onClick={() => handleSelectAction(item.type)}
                className={cn(
                  "text-xs gap-2.5 py-2 cursor-pointer flex items-center justify-between",
                  isEmailLocked && "opacity-90"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center shrink-0 border",
                      item.badgeBg
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold block truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {isEmailLocked ? "Domain setup required" : item.desc}
                    </span>
                  </div>
                </div>

                {isEmailLocked && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge
                      variant="outline"
                      className="text-[8.5px] font-bold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-1 py-0 h-4"
                    >
                      Setup
                    </Badge>
                    <Lock className="w-3 h-3 text-amber-500" />
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <EmailDomainSetupModal
        open={showDomainModal}
        onOpenChange={setShowDomainModal}
      />
    </div>
  );
});

SharedAddActionNode.displayName = "SharedAddActionNode";

