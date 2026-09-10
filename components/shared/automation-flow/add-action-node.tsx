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
import {
  SHARED_PALETTE_ACTIONS,
  MEMBER_PALETTE_ACTIONS,
  getCategorizedActions,
} from "./action-palette-items";
import { SharedAddActionNodeData } from "./types";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";
import { EmailDomainSetupModal } from "@/components/members/automation/email-domain-setup-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const SharedAddActionNode = memo(({ data }: NodeProps<any>) => {
  const nodeData = data as SharedAddActionNodeData;
  const { isVerified } = useEmailDomainStatus();
  const [showDomainModal, setShowDomainModal] = useState(false);

  const isNoBranch =
    nodeData.branch === "no" ||
    (typeof nodeData.branch === "string" && nodeData.branch.endsWith("_no"));
  const label =
    nodeData.label || (isNoBranch ? "Add Action (NO Path)" : "Add Action (YES Path)");

  const paletteItems =
    nodeData.moduleType === "survey"
      ? SHARED_PALETTE_ACTIONS
      : MEMBER_PALETTE_ACTIONS;

  const categorizedGroups = getCategorizedActions(paletteItems);

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
        className={cn(
          "!w-3 !h-3 !border-2 !border-background shadow-xs",
          isNoBranch ? "!bg-rose-500" : "!bg-emerald-500"
        )}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "nodrag w-full p-3 rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:scale-[1.02] bg-white/60 dark:bg-zinc-900/60",
              isNoBranch
                ? "border-rose-300/80 dark:border-rose-900/60 hover:border-rose-500 hover:bg-rose-500/5 text-rose-600 dark:text-rose-400"
                : "border-emerald-300/80 dark:border-emerald-900/60 hover:border-emerald-500 hover:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                isNoBranch
                  ? "bg-rose-500/10 text-rose-600"
                  : "bg-emerald-500/10 text-emerald-600"
              )}
            >
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold">{label}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-80 p-2 shadow-xl max-h-[82vh] overflow-y-auto">
          <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Select Action Type</span>
            <span className="text-[9px] font-mono opacity-60">
              {paletteItems.length} Actions · {categorizedGroups.length} Channels
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />

          <div className="space-y-3 my-1">
            {categorizedGroups.map((group) => {
              const CategoryIcon = group.category.icon;
              return (
                <div key={group.category.id} className="space-y-1">
                  <div className="px-2 pt-1 pb-0.5 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                      <span
                        className={cn(
                          "w-4 h-4 rounded flex items-center justify-center text-[10px] border",
                          group.category.color
                        )}
                      >
                        <CategoryIcon className="w-2.5 h-2.5" />
                      </span>
                      {group.category.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {group.items.length}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isEmailLocked = item.type === "EMAIL" && !isVerified;
                      return (
                        <DropdownMenuItem
                          key={item.type}
                          onClick={() => handleSelectAction(item.type)}
                          className={cn(
                            "text-xs gap-2.5 py-1.5 px-2 cursor-pointer flex items-center justify-between rounded-lg hover:bg-muted/80",
                            isEmailLocked && "opacity-90"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center shrink-0 border shadow-2xs",
                                item.badgeBg
                              )}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold block truncate text-[11.5px]">
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
                  </div>
                </div>
              );
            })}
          </div>
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
