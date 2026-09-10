"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Zap,
  Users,
  CheckCircle2,
  ShieldCheck,
  Filter,
  Check,
  X,
  UserPlus,
  UserX,
  UserMinus,
  Ban,
  StopCircle,
  GitBranch,
  Plus,
  LogOut,
  Trash2,
  Copy,
  Settings2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MEMBER_PALETTE_ACTIONS } from "@/components/shared/automation-flow";
import { MemberRuleTrigger } from "@/graphql/member-automation";
import { cn } from "@/lib/utils";

// ── Trigger Node ─────────────────────────────────────────────────────────────
export const TriggerNode = memo(({ data, selected }: NodeProps<any>) => {
  const trigger = (data.trigger as MemberRuleTrigger) || "MEMBER_JOINED";

  const getTriggerMeta = () => {
    switch (trigger) {
      case "MEMBER_JOINED":
        return {
          title: "Member Registration",
          desc: "Evaluated when a member registers or joins.",
          icon: UserPlus,
          color: "from-emerald-500 to-teal-600",
          border: "border-emerald-500/40 dark:border-emerald-500/30",
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          badge: "Join Event",
        };
      case "MEMBER_VERIFIED":
        return {
          title: "Identity Verified",
          desc: "Triggered on institutional or KYC document approval.",
          icon: ShieldCheck,
          color: "from-purple-500 to-pink-600",
          border: "border-purple-500/40 dark:border-purple-500/30",
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
          badge: "Trust Badge",
        };
      case "MEMBER_APPROVED":
        return {
          title: "Member Approval",
          desc: "Triggered when an admin approves applicant profile.",
          icon: CheckCircle2,
          color: "from-blue-500 to-indigo-600",
          border: "border-blue-500/40 dark:border-blue-500/30",
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          badge: "Approval Event",
        };
      case "MEMBER_REJECTED":
        return {
          title: "Member Rejected",
          desc: "Triggered when member application is declined.",
          icon: UserX,
          color: "from-rose-500 to-red-600",
          border: "border-rose-500/40 dark:border-rose-500/30",
          bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
          badge: "Rejection",
        };
      case "MEMBER_DISABLED":
        return {
          title: "Member Disabled",
          desc: "Triggered when member account is deactivated/disabled.",
          icon: UserMinus,
          color: "from-amber-500 to-orange-600",
          border: "border-amber-500/40 dark:border-amber-500/30",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          badge: "Deactivated",
        };
      case "MEMBER_BLOCKED":
        return {
          title: "Member Blocked",
          desc: "Triggered when member is banned or restricted.",
          icon: Ban,
          color: "from-red-600 to-rose-700",
          border: "border-red-500/40 dark:border-red-500/30",
          bg: "bg-red-500/10 text-red-600 dark:text-red-400",
          badge: "Restricted",
        };
      default:
        return {
          title: "Trigger Event",
          desc: "Lifecycle trigger initiating this workflow.",
          icon: Zap,
          color: "from-amber-500 to-orange-600",
          border: "border-amber-500/40 dark:border-amber-500/30",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          badge: "Event",
        };
    }
  };

  const meta = getTriggerMeta();
  const Icon = meta.icon;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        data?.onSelect?.();
      }}
      className={cn(
        "group relative w-[210px] rounded-xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-sm",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
          : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      )}
    >
      {/* Top Accent Bar */}
      <div className={cn("h-1.5 w-full rounded-t-xl bg-gradient-to-r", meta.color)} />

      <div className="p-2.5 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-2xs",
                meta.bg
              )}
            >
              <Icon className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <span className="text-[8.5px] font-bold tracking-wider text-muted-foreground uppercase block leading-none">
                Trigger
              </span>
              <h4 className="text-[11px] font-bold text-foreground leading-tight truncate">
                {meta.title}
              </h4>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-[8px] font-bold px-1 py-0 h-4 shrink-0", meta.bg, meta.border)}
          >
            {meta.badge}
          </Badge>
        </div>

        <p className="text-[9.5px] text-muted-foreground leading-snug line-clamp-2">
          {meta.desc}
        </p>

        {/* Trigger Pre-Conditions (YES/NO gatekeeper badges) */}
        {data.preconditions && Object.keys(data.preconditions).length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {data.preconditions.firstTimeOnly && (
              <Badge variant="outline" className="text-[8px] font-semibold px-1 py-0 h-3.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                ✓ First-Time
              </Badge>
            )}
            {data.preconditions.verifiedOnly && (
              <Badge variant="outline" className="text-[8px] font-semibold px-1 py-0 h-3.5 bg-blue-500/10 text-blue-600 border-blue-500/30">
                ✓ Verified
              </Badge>
            )}
            {data.preconditions.approvalRequired && (
              <Badge variant="outline" className="text-[8px] font-semibold px-1 py-0 h-3.5 bg-purple-500/10 text-purple-600 border-purple-500/30">
                ✓ Pre-Approval
              </Badge>
            )}
          </div>
        )}

        {/* Quick Trigger Switcher */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            data?.onSelect?.();
          }}
          className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[9px] text-muted-foreground cursor-pointer"
        >
          <span className="flex items-center gap-1 font-medium">
            <Zap className="w-2.5 h-2.5 text-amber-500" />
            Real-Time
          </span>
          <span className="font-semibold text-primary group-hover:underline">
            Configure →
          </span>
        </div>

        {/* Filter Rule Action */}
        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[9px]">
          <div className="flex items-center gap-1 font-medium text-muted-foreground truncate">
            <Filter className="w-2.5 h-2.5 text-blue-500 shrink-0" />
            <span className="truncate">
              {data.hasConditions
                ? `${data.conditionCount ? `${data.conditionCount} Filter${data.conditionCount > 1 ? "s" : ""}` : "Filters"}`
                : "No Filter (All)"}
            </span>
          </div>
          {!data.hasConditions && data.onAddCondition && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                data.onAddCondition();
              }}
              className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
              title="Add targeting filter condition to flow"
            >
              <Plus className="w-2.5 h-2.5" />
              Add
            </button>
          )}
        </div>

        {/* Multi-Branch Action Bar */}
        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[9px]">
          <div className="flex items-center gap-1 font-medium text-muted-foreground truncate">
            <GitBranch className="w-2.5 h-2.5 text-purple-500 shrink-0" />
            <span className="truncate">
              {data.branchCount && data.branchCount > 1
                ? `${data.branchCount} Branches`
                : "1 Branch"}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              data.onAddBranch?.();
            }}
            className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
            title="Create another branch from this trigger event"
          >
            <Plus className="w-2.5 h-2.5" />
            Branch
          </button>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-background shadow-xs transition-transform group-hover:scale-125"
      />
    </div>
  );
});

TriggerNode.displayName = "TriggerNode";

// ── Condition / Filter Branch Node ───────────────────────────────────────────
export const ConditionNode = memo(({ data, selected }: NodeProps<any>) => {
  const conditions = data.conditions || [];
  const operator = data.conditionOperator || "AND";
  const simulation = data.simulationStatus;
  const branchIndex = data.branchIndex ?? 0;
  const branchName = data.branchName || data.title || `Branch ${branchIndex + 1}`;

  const getBranchTitle = () => {
    if (data.branchTitle) return data.branchTitle;
    if (conditions.length === 0) return branchName;
    const firstCond = conditions[0];
    const fieldClean = (firstCond.field || "")
      .replace("profile.", "")
      .replace("user.", "")
      .replace("userToEntity.", "");
    return `${branchName}: If ${fieldClean} ${firstCond.operator} "${String(firstCond.value ?? "")}"`;
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        data?.onSelect?.();
      }}
      className={cn(
        "group relative rounded-xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-sm",
        data.hasNoPath ? "w-[260px]" : "w-[230px]",
        selected
          ? "border-purple-500 ring-2 ring-purple-500/20 shadow-md scale-[1.02]"
          : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
        simulation === "passed" && "ring-2 ring-emerald-500/40 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20",
        simulation === "failed" && "ring-2 ring-rose-500/40 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20"
      )}
    >
      {/* Input Handle from Trigger */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-purple-500 !border-2 !border-background shadow-xs"
      />

      {/* Top Accent Bar */}
      <div className="h-1.5 w-full rounded-t-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

      <div className="p-2.5 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-2xs">
              <GitBranch className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <span className="text-[8.5px] font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase block leading-none">
                Branch #{branchIndex + 1}
              </span>
              <h4 className="text-[11px] font-bold text-foreground truncate mt-0.5" title={getBranchTitle()}>
                {getBranchTitle()}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {data.onDuplicateBranch && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  data.onDuplicateBranch?.();
                }}
                className="h-5 w-5 text-muted-foreground hover:text-foreground"
                title="Duplicate Branch"
              >
                <Copy className="w-2.5 h-2.5" />
              </Button>
            )}

            {data.onDeleteBranch && data.canDeleteBranch && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  data.onDeleteBranch();
                }}
                className="p-0.5 rounded text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete branch"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}

            {conditions.length > 1 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  data.onOperatorChange?.(operator === "AND" ? "OR" : "AND");
                }}
                className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded-full border border-border text-[8.5px] font-bold cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                title="Toggle Match ALL (AND) / ANY (OR)"
              >
                <span className={operator === "AND" ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"}>
                  AND
                </span>
                <span className="text-muted-foreground">/</span>
                <span className={operator === "OR" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}>
                  OR
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Condition Chips List */}
        {conditions.length === 0 ? (
          <div className="p-2 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5 text-center space-y-0.5">
            <p className="text-[10px] font-semibold text-purple-900 dark:text-purple-200">
              Universal Cohort (All Members)
            </p>
            <p className="text-[9px] text-muted-foreground">
              Executes unconditionally for all matching members.
            </p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[120px] overflow-y-auto pr-0.5">
            {conditions.map((cond: any, i: number) => {
              const fieldClean = cond.field.replace("profile.", "").replace("user.", "").replace("userToEntity.", "");
              return (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (data.onSelectConditionField) {
                      data.onSelectConditionField(cond.field);
                    } else if (data.onSelect) {
                      data.onSelect();
                    }
                  }}
                  className="flex items-center justify-between gap-1.5 p-1.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-purple-500/20 text-[10px] cursor-pointer hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all group/chip"
                  title="Click to edit this condition in the inspector"
                >
                  <div className="flex items-center gap-1 truncate min-w-0">
                    <span className="font-semibold text-foreground capitalize truncate max-w-[65px]">
                      {fieldClean}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {cond.operator}
                    </span>
                    {(() => {
                      const valStr = String(cond.value ?? "");
                      const isBool = valStr === "true" || valStr === "false" || valStr === "YES" || valStr === "NO" || cond.value === true || cond.value === false;
                      const isYes = valStr === "true" || valStr === "YES" || cond.value === true;
                      if (isBool) {
                        return (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[8px] font-bold px-1 py-0 h-3.5 uppercase",
                              isYes
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                            )}
                          >
                            {isYes ? "YES" : "NO"}
                          </Badge>
                        );
                      }
                      return (
                        <span className="font-medium text-purple-600 dark:text-purple-400 truncate max-w-[70px]">
                          {String(cond.value || "set")}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {i < conditions.length - 1 && (
                      <span className="text-[8px] font-bold text-muted-foreground uppercase shrink-0">
                        {operator}
                      </span>
                    )}
                    {data.onDeleteCondition && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          data.onDeleteCondition(i);
                        }}
                        className="opacity-40 hover:opacity-100 p-0.5 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-opacity cursor-pointer ml-0.5"
                        title="Remove this condition"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Simulation Feedback */}
        {simulation && simulation !== "idle" && (
          <div
            className={cn(
              "flex items-center gap-1 p-1.5 rounded-md text-[9px] font-bold",
              simulation === "passed" && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
              simulation === "failed" && "bg-rose-500/10 text-rose-600 border border-rose-500/20",
              simulation === "running" && "bg-purple-500/10 text-purple-600 border border-purple-500/20 animate-pulse"
            )}
          >
            {simulation === "passed" && <Check className="w-3 h-3 shrink-0" />}
            {simulation === "failed" && <X className="w-3 h-3 shrink-0" />}
            <span className="truncate">
              {simulation === "passed" && "Matches branch filters!"}
              {simulation === "failed" && "Did not match criteria."}
              {simulation === "running" && "Evaluating profile..."}
            </span>
          </div>
        )}

        {/* Footer with Edit Criteria & Action / Else Path */}
        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[9px]">
          <span className="text-muted-foreground flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 group-hover:underline">
            <Settings2 className="w-2.5 h-2.5" />
            Filters →
          </span>

          <div className="flex items-center gap-1">
            {!data.hasNoPath && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  data.onToggleNoPath?.(true);
                }}
                className="h-5 px-1 text-[9px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded border border-dashed border-rose-300 dark:border-rose-800 flex items-center gap-0.5 transition-all cursor-pointer"
                title="Enable alternative action path when filters are not met"
              >
                <Plus className="w-2 h-2" />
                + NO
              </button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-5 text-[9.5px] font-bold text-purple-700 dark:text-purple-300 gap-0.5 hover:bg-purple-50 dark:hover:bg-purple-950/40 px-1.5 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" />
                  Action
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-1 shadow-xl">
                <DropdownMenuLabel className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-0.5">
                  Add to {branchName} (YES Path)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {MEMBER_PALETTE_ACTIONS.map((act) => {
                  const ActIcon = act.icon;
                  return (
                    <DropdownMenuItem
                      key={act.type}
                      onClick={() => data.onAddActionToBranch?.(act.type, "yes")}
                      className="text-xs gap-2 py-1 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded flex items-center justify-center shrink-0 border",
                          act.badgeBg
                        )}
                      >
                        <ActIcon className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-semibold truncate text-[11px]">{act.label}</span>
                    </DropdownMenuItem>
                  );
                })}
                {data.hasNoPath && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[9px] font-bold text-rose-600 uppercase tracking-wider px-2 py-0.5">
                      Add to {branchName} (NO / Else Path)
                    </DropdownMenuLabel>
                    {MEMBER_PALETTE_ACTIONS.map((act) => {
                      const ActIcon = act.icon;
                      return (
                        <DropdownMenuItem
                          key={`no-${act.type}`}
                          onClick={() => data.onAddActionToBranch?.(act.type, "no")}
                          className="text-xs gap-2 py-1 cursor-pointer"
                        >
                          <div
                            className={cn(
                              "w-4 h-4 rounded flex items-center justify-center shrink-0 border",
                              act.badgeBg
                            )}
                          >
                            <ActIcon className="w-2.5 h-2.5" />
                          </div>
                          <span className="font-semibold truncate text-rose-600 dark:text-rose-400 text-[11px]">
                            {act.label} (NO)
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Path Status Badges at Bottom */}
        {data.hasNoPath ? (
          <div className="pt-1.5 border-t border-border/60 grid grid-cols-2 gap-1.5 text-[9px]">
            <div className="flex items-center justify-center gap-0.5 py-0.5 px-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold">
              <Check className="w-2.5 h-2.5" />
              <span>YES Path</span>
            </div>
            <div className="relative group/no flex items-center justify-between py-0.5 px-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold">
              <span className="flex items-center gap-0.5">
                <X className="w-2.5 h-2.5" />
                <span>NO Path</span>
              </span>
              {data.onToggleNoPath && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onToggleNoPath?.(false);
                  }}
                  className="opacity-40 group-hover/no:opacity-100 hover:text-rose-700 hover:bg-rose-200/50 dark:hover:bg-rose-950/80 rounded p-0.5 transition-opacity cursor-pointer"
                  title="Disable NO (Else) path"
                >
                  <Trash2 className="w-2 h-2" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-1 border-t border-border/40 flex items-center justify-center">
            <span className="text-[8.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
              <Check className="w-2 h-2" /> Matches → Direct Actions
            </span>
          </div>
        )}
      </div>

      {/* Output Handles to Action Chain(s) */}
      {data.hasNoPath ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            style={{ left: "25%" }}
            className="!w-2.5 !h-2.5 !bg-emerald-500 !border-2 !border-background shadow-xs hover:scale-125 transition-transform"
            title="YES Path: Actions execute when criteria match"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            style={{ left: "75%" }}
            className="!w-2.5 !h-2.5 !bg-rose-500 !border-2 !border-background shadow-xs hover:scale-125 transition-transform"
            title="NO Path: Alternative actions when criteria do NOT match"
          />
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Bottom}
          id="yes"
          className="!w-2.5 !h-2.5 !bg-emerald-500 !border-2 !border-background shadow-xs hover:scale-125 transition-transform"
          title="Proceed to action chain (Matches criteria)"
        />
      )}
    </div>
  );
});

ConditionNode.displayName = "ConditionNode";

// ── Add Branch Node ─────────────────────────────────────────────────────────
export const AddBranchNode = memo(({ data }: NodeProps<any>) => {
  return (
    <div className="group relative w-[180px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-purple-500 !border-2 !border-background shadow-xs"
      />

      <button
        type="button"
        onClick={() => data.onAddBranch?.()}
        className="w-full p-2.5 rounded-xl border-2 border-dashed border-purple-400 dark:border-purple-700 bg-purple-50/40 dark:bg-purple-950/20 hover:border-purple-500 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-2xs group-hover:scale-[1.02]"
      >
        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center">
          <GitBranch className="w-3 h-3" />
        </div>
        <span className="text-[11px] font-bold">+ New Branch</span>
        <span className="text-[9px] text-muted-foreground">Filter cohort branch</span>
      </button>
    </div>
  );
});

AddBranchNode.displayName = "AddBranchNode";

// ── Reusable Action & Add Action Nodes ───────────────────────────────────────
export {
  SharedActionNode as ActionNode,
  SharedAddActionNode as AddActionNode,
} from "@/components/shared/automation-flow";

// ── Exit / Graceful Termination Node ─────────────────────────────────────────
export const ExitNode = memo(({ data, selected }: NodeProps<any>) => {
  const simulation = data.simulationStatus;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        data?.onSelect?.();
      }}
      className={cn(
        "group relative w-[185px] rounded-xl bg-white dark:bg-zinc-900 border transition-all duration-200 cursor-pointer select-none shadow-2xs",
        selected
          ? "border-rose-500 ring-2 ring-rose-500/20 shadow-sm scale-[1.02]"
          : "border-dashed border-rose-300 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-800",
        simulation === "failed" && "ring-2 ring-rose-500/40 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20"
      )}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-rose-500 !border-2 !border-background shadow-xs"
      />

      {/* Top Accent Bar */}
      <div className="h-1 w-full rounded-t-xl bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />

      <div className="p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-2xs">
              <StopCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[8px] font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase leading-none">
                NO / Unmatched
              </span>
              <h4 className="text-[11px] font-bold text-foreground">
                Workflow Ends
              </h4>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[8px] font-bold text-rose-600 border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-1 py-0 h-4"
          >
            Exit
          </Badge>
        </div>

        <p className="text-[9px] text-muted-foreground leading-snug line-clamp-2">
          Target criteria not met. Workflow halts safely without executing actions.
        </p>

        {simulation === "failed" && (
          <div className="p-1 rounded bg-rose-500/10 border border-rose-500/20 text-[8.5px] font-bold text-rose-600 flex items-center gap-1">
            <X className="w-2.5 h-2.5 shrink-0" />
            <span>Simulation: Halted at NO</span>
          </div>
        )}

        {/* Add Action directly to NO Branch */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              data?.onAddNoAction?.();
            }}
            className="w-full py-1 px-1.5 rounded-md border border-dashed border-rose-300 dark:border-rose-800/80 bg-rose-50/60 dark:bg-rose-950/25 text-rose-600 dark:text-rose-400 hover:bg-rose-100/70 dark:hover:bg-rose-950/60 text-[9px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
            title="Add automated action for when condition is not met"
          >
            <Plus className="w-2.5 h-2.5" />
            Action to NO Path
          </button>
        </div>
      </div>
    </div>
  );
});

ExitNode.displayName = "ExitNode";
