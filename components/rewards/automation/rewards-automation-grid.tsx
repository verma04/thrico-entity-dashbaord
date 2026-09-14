"use client";

import React from "react";
import {
  RewardsAutomationRule,
  RewardAutomationModule,
} from "@/graphql/rewards-automation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  Activity,
  GitBranch,
  Filter,
  Zap,
  Clock,
  Layers,
} from "lucide-react";
import { getModuleVisuals } from "./flow/rewards-custom-nodes";
import { cn } from "@/lib/utils";

interface RewardsAutomationGridProps {
  rules: RewardsAutomationRule[];
  loading?: boolean;
  onEdit: (rule: RewardsAutomationRule) => void;
  onViewLogs: (rule: RewardsAutomationRule) => void;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string) => void;
  onDuplicate?: (rule: RewardsAutomationRule) => void;
  togglingId?: string | null;
}

export const RewardsAutomationGrid: React.FC<RewardsAutomationGridProps> = ({
  rules,
  loading = false,
  onEdit,
  onViewLogs,
  onToggle,
  onDelete,
  onDuplicate,
  togglingId,
}) => {
  const inferModule = (r: RewardsAutomationRule): RewardAutomationModule => {
    if (r.module) return r.module;
    const trig = r.trigger;
    if (trig.startsWith("SPIN_WHEEL")) return "SPIN_WHEEL";
    if (trig.startsWith("SCRATCH_CARD")) return "SCRATCH_CARD";
    if (trig.startsWith("MATCH_WIN")) return "MATCH_WIN";
    return "REWARDS";
  };

  if (loading && rules.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-56 rounded-2xl border border-border bg-card/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="p-12 text-center space-y-2 border border-dashed border-border rounded-2xl bg-card/40">
        <Zap className="w-8 h-8 text-muted-foreground mx-auto" />
        <h4 className="text-sm font-bold text-foreground">
          No rewards automation rules match current filters
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Try adjusting your search query or module filters above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rules.map((rule) => {
        const mod = inferModule(rule);
        const modMeta = getModuleVisuals(mod);
        const ModIcon = modMeta.icon;

        const yesActions = (rule.actions || []).filter(
          (a) => !String(a.branch || "").endsWith("_no")
        );
        const noActions = (rule.actions || []).filter((a) =>
          String(a.branch || "").endsWith("_no")
        );

        return (
          <div
            key={rule.id}
            className="rounded-2xl border border-border/80 bg-card hover:border-border transition-all flex flex-col justify-between shadow-2xs hover:shadow-md group overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div className={cn("h-1.5 w-full bg-gradient-to-r", modMeta.color)} />

            <div className="p-4 space-y-3.5 flex-1">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
                      modMeta.bg
                    )}
                  >
                    <ModIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      onClick={() => onEdit(rule)}
                      className="text-xs font-bold text-foreground hover:text-primary cursor-pointer truncate leading-tight"
                    >
                      {rule.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground truncate block">
                      {modMeta.label} • {rule.branches?.length || 1} Branch
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-xs">
                    <DropdownMenuItem
                      onClick={() => onEdit(rule)}
                      className="gap-2 text-xs font-medium cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-primary" /> Edit Workflow
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onViewLogs(rule)}
                      className="gap-2 text-xs font-medium cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-purple-500" /> View
                      Logs & Stats
                    </DropdownMenuItem>
                    {onDuplicate && (
                      <DropdownMenuItem
                        onClick={() => onDuplicate(rule)}
                        className="gap-2 text-xs font-medium cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-500" /> Duplicate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(rule.id)}
                      className="gap-2 text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Scope & Trigger */}
              <div className="px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> Trigger:
                  </span>
                  <span className="font-bold text-foreground">
                    {rule.trigger.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3 text-muted-foreground" /> Scope:
                  </span>
                  <span className="font-semibold text-foreground truncate max-w-[140px]">
                    {rule.rewardTitle || (rule.rewardId === "ALL" ? "All Active" : "Item")}
                  </span>
                </div>
              </div>

              {/* Action Tracks */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {yesActions.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[8.5px] font-extrabold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  >
                    YES: {yesActions.length} Action{yesActions.length === 1 ? "" : "s"}
                  </Badge>
                )}
                {noActions.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[8.5px] font-extrabold px-2 py-0.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30"
                  >
                    NO: {noActions.length} Action{noActions.length === 1 ? "" : "s"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-3 border-t border-border/70 bg-muted/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Switch
                  checked={rule.isActive}
                  disabled={togglingId === rule.id}
                  onCheckedChange={(checked) => onToggle(rule.id, checked)}
                />
                <span className="text-[10.5px] font-bold text-muted-foreground">
                  {rule.isActive ? "Active" : "Paused"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-foreground">
                <span className="text-muted-foreground font-normal">Runs:</span>
                <span>{(rule.executionCount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
