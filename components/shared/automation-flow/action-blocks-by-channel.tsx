"use client";

import React, { useState } from "react";
import { Plus, Lock, Check, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  MEMBER_PALETTE_ACTIONS,
  SHARED_PALETTE_ACTIONS,
  getCategorizedActions,
  ActionMetadataItem,
} from "./action-palette-items";
import { AutomationActionType } from "./types";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";
import { EmailDomainSetupModal } from "@/components/members/automation/email-domain-setup-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ActionBlocksByChannelProps {
  /**
   * Action items to display. If not provided, defaults based on moduleType.
   */
  items?: ActionMetadataItem[];
  /**
   * Callback when an action is clicked or added.
   */
  onAddAction: (
    type: AutomationActionType,
    branchId?: string,
    path?: "yes" | "no"
  ) => void;
  /**
   * Current selected branch ID (e.g. "branch_1").
   */
  selectedBranchId?: string;
  /**
   * Callback when branch selection changes.
   */
  onSelectBranchId?: (branchId: string) => void;
  /**
   * Available branches.
   */
  branches?: { id: string; name: string }[];
  /**
   * Target outcome path: "yes" (Win / Criteria Met) or "no" (Consolation / Fallback).
   */
  targetBranch?: "yes" | "no";
  /**
   * Callback when target outcome path changes.
   */
  onTargetBranchChange?: (path: "yes" | "no") => void;
  /**
   * Whether to show the Branch & Outcome Path Selector panel.
   */
  showBranchPathSelector?: boolean;
  /**
   * Whether to show dual quick-add buttons (+ YES / + NO) directly on each card.
   */
  showDualPathButtons?: boolean;
  /**
   * Module type context: "member" | "survey" | "rewards".
   */
  moduleType?: "member" | "survey" | "rewards";
  /**
   * Layout format: 2-column "grid" or 1-column "list".
   */
  layout?: "grid" | "list";
  /**
   * Custom container className.
   */
  className?: string;
}

export const ActionBlocksByChannel: React.FC<ActionBlocksByChannelProps> = ({
  items,
  onAddAction,
  selectedBranchId = "branch_1",
  onSelectBranchId,
  branches = [],
  targetBranch = "yes",
  onTargetBranchChange,
  showBranchPathSelector = false,
  showDualPathButtons = false,
  moduleType = "member",
  layout = "grid",
  className,
}) => {
  const { isVerified } = useEmailDomainStatus();
  const [showDomainModal, setShowDomainModal] = useState(false);

  // Determine active item list
  const activeItems =
    items ||
    (moduleType === "survey" || moduleType === "rewards"
      ? SHARED_PALETTE_ACTIONS
      : MEMBER_PALETTE_ACTIONS);

  const categorizedGroups = getCategorizedActions(activeItems);

  const handleActionClick = (type: AutomationActionType, path?: "yes" | "no") => {
    if (type === "EMAIL" && !isVerified) {
      setShowDomainModal(true);
      toast.error(
        "Email domain setup required before adding automated email actions."
      );
      return;
    }
    onAddAction(type, selectedBranchId, path || targetBranch);
  };

  const selectedBranchName =
    branches.find((b) => b.id === selectedBranchId)?.name || selectedBranchId;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Optional Branch & Outcome Path Target Selector */}
      {showBranchPathSelector && (
        <div className="p-2.5 rounded-xl bg-muted/40 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Add to Branch & Path
            </span>
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] font-bold px-1.5 py-0 h-4 uppercase",
                targetBranch === "no"
                  ? "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10"
                  : "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10"
              )}
            >
              {selectedBranchName} · {targetBranch.toUpperCase()}
            </Badge>
          </div>

          {branches.length > 1 && onSelectBranchId && (
            <div className="flex flex-wrap gap-1">
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelectBranchId(b.id)}
                  className={cn(
                    "px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer",
                    selectedBranchId === b.id
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-card border-border hover:bg-muted text-muted-foreground"
                  )}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}

          {/* Outcome Path Toggle (YES vs NO) */}
          {onTargetBranchChange && (
            <div className="pt-0.5 space-y-1">
              <span className="text-[9.5px] font-semibold text-muted-foreground block">
                Target Outcome Path:
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => onTargetBranchChange("yes")}
                  className={cn(
                    "py-1 px-2 text-[10.5px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer",
                    targetBranch === "yes"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                  )}
                >
                  <Check className="w-3 h-3" />
                  YES (Matches)
                </button>

                <button
                  type="button"
                  onClick={() => onTargetBranchChange("no")}
                  className={cn(
                    "py-1 px-2 text-[10.5px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer",
                    targetBranch === "no"
                      ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20"
                  )}
                >
                  <X className="w-3 h-3" />
                  NO (Else)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Action Blocks by Channel
        </span>
        <span className="text-[9px] font-mono text-muted-foreground">
          {activeItems.length} Actions · {categorizedGroups.length} Channels
        </span>
      </div>

      {/* Channel Groups */}
      {categorizedGroups.map((group) => {
        const CategoryIcon = group.category.icon;
        return (
          <div key={group.category.id} className="space-y-1.5">
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-[10.5px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <span
                  className={cn(
                    "w-4 h-4 rounded flex items-center justify-center border",
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

            <div
              className={cn(
                layout === "grid"
                  ? "grid grid-cols-2 gap-2"
                  : "space-y-1.5"
              )}
            >
              {group.items.map((item) => {
                const Icon = item.icon;
                const isEmailLocked = item.type === "EMAIL" && !isVerified;

                return (
                  <div
                    key={item.type}
                    draggable={!isEmailLocked}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/reactflow/type", "action");
                      e.dataTransfer.setData("application/reactflow/action", item.type);
                      e.dataTransfer.setData("application/reactflow-action", item.type);
                      e.dataTransfer.setData("application/reactflow/branch", selectedBranchId);
                      e.dataTransfer.setData("application/reactflow-branch", selectedBranchId);
                      e.dataTransfer.setData("application/reactflow/path", targetBranch);
                      e.dataTransfer.setData("application/reactflow-path", targetBranch);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => !showDualPathButtons && handleActionClick(item.type)}
                    className={cn(
                      "p-2 rounded-xl border border-border bg-card hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-muted/30 text-left transition-all flex flex-col justify-between gap-1.5 group cursor-pointer active:cursor-grabbing",
                      isEmailLocked && "hover:border-amber-300 dark:hover:border-amber-800"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border",
                          item.badgeBg
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      {/* Action buttons */}
                      {showDualPathButtons ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(item.type, "yes");
                            }}
                            className="px-1.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[8px] cursor-pointer"
                            title="Add to YES Path"
                          >
                            + YES
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(item.type, "no");
                            }}
                            className="px-1.5 py-0.5 rounded bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-extrabold text-[8px] cursor-pointer"
                            title="Add to NO (Consolation) Path"
                          >
                            + NO
                          </button>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center transition-colors shrink-0",
                            isEmailLocked
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                          )}
                        >
                          {isEmailLocked ? (
                            <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <Plus className="w-2.5 h-2.5" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 w-full">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-foreground block truncate leading-tight">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-muted-foreground truncate block leading-tight mt-0.5">
                        {isEmailLocked ? "Requires domain setup" : item.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <EmailDomainSetupModal
        open={showDomainModal}
        onOpenChange={setShowDomainModal}
      />
    </div>
  );
};
