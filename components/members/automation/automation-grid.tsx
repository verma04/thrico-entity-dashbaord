"use client";

import React from "react";
import {
  MemberAutomationRule,
  MemberRuleTrigger,
  MemberRuleActionType,
} from "@/graphql/member-automation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Zap,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { safeFormat } from "@/lib/date-utils";

interface AutomationGridProps {
  rules: MemberAutomationRule[];
  onEdit: (rule: MemberAutomationRule) => void;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate?: (rule: MemberAutomationRule) => void;
  togglingId?: string | null;
}

export const AutomationGrid: React.FC<AutomationGridProps> = ({
  rules,
  onEdit,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  togglingId,
}) => {
  const getTriggerMeta = (trigger: MemberRuleTrigger) => {
    switch (trigger) {
      case "MEMBER_JOINED":
        return {
          label: "When Member Joins",
          icon: UserPlus,
          badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          bannerClass: "from-emerald-500/10 via-emerald-500/5 to-transparent",
        };
      case "MEMBER_APPROVED":
        return {
          label: "When Approved",
          icon: CheckCircle2,
          badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          bannerClass: "from-blue-500/10 via-blue-500/5 to-transparent",
        };
      case "MEMBER_VERIFIED":
        return {
          label: "When Verified",
          icon: ShieldCheck,
          badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          bannerClass: "from-purple-500/10 via-purple-500/5 to-transparent",
        };
      default:
        return {
          label: trigger,
          icon: Zap,
          badgeClass: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
          bannerClass: "from-zinc-500/10 via-zinc-500/5 to-transparent",
        };
    }
  };

  if (rules.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {rules.map((rule, index) => {
        const triggerMeta = getTriggerMeta(rule.trigger);
        const TriggerIcon = triggerMeta.icon;
        const isToggling = togglingId === rule.id;
        const isFirst = index === 0;
        const isLast = index === rules.length - 1;

        return (
          <div
            key={rule.id}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-2xs hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 overflow-hidden",
              !rule.isActive && "opacity-75 bg-zinc-50/60 dark:bg-zinc-900/40"
            )}
          >
            {/* Top Accent Gradient Bar */}
            <div
              className={`h-1.5 w-full bg-gradient-to-r ${triggerMeta.bannerClass}`}
            />

            <div className="p-4 space-y-3.5 flex-1">
              {/* Header: Priority, Trigger Badge, Switch & Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                    #{rule.priority ?? index + 1}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      triggerMeta.badgeClass
                    )}
                  >
                    <TriggerIcon className="w-3 h-3" />
                    {triggerMeta.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={rule.isActive}
                    disabled={isToggling}
                    onCheckedChange={(checked) => onToggle(rule.id, checked)}
                    className="data-[state=checked]:bg-emerald-600 h-4 w-8"
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => onEdit(rule)}
                        className="text-xs gap-2 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit Rule
                      </DropdownMenuItem>
                      {onDuplicate && (
                        <DropdownMenuItem
                          onClick={() => onDuplicate(rule)}
                          className="text-xs gap-2 cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Duplicate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={isFirst}
                        onClick={() => onMoveUp(index)}
                        className="text-xs gap-2 cursor-pointer"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                        Move Up
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={isLast}
                        onClick={() => onMoveDown(index)}
                        className="text-xs gap-2 cursor-pointer"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                        Move Down
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(rule.id)}
                        className="text-xs gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Rule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Title & Description */}
              <div
                onClick={() => onEdit(rule)}
                className="cursor-pointer space-y-1 group/title"
              >
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover/title:text-primary transition-colors">
                  {rule.name}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {rule.description || "Automated membership assignment rule."}
                </p>
              </div>

              {/* Conditions Section */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <span>Conditions</span>
                  {rule.conditionOperator && (rule.conditions?.length || 0) > 1 && (
                    <span className="font-bold text-zinc-500">
                      Match {rule.conditionOperator}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {!rule.conditions || rule.conditions.length === 0 ? (
                    <span className="text-[10px] text-zinc-500 italic bg-zinc-100/60 dark:bg-zinc-800/50 px-2 py-0.5 rounded">
                      Applies to all members
                    </span>
                  ) : (
                    rule.conditions.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-700/80"
                      >
                        <span className="font-bold">
                          {c.field.replace("profile.", "").replace("user.", "")}:
                        </span>
                        <span className="truncate max-w-[100px]">
                          {String(c.value || c.operator)}
                        </span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Actions Pipeline ({rule.actions.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rule.actions.map((act, i) => {
                    switch (act.type as MemberRuleActionType) {
                      case "ASSIGN_MEMBERSHIP_TIER":
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          >
                            <Award className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[120px]">
                              {act.tierName || "Assign Tier"}
                            </span>
                          </span>
                        );
                      case "COMMUNITY_JOIN":
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          >
                            <Users className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[120px]">
                              {act.communityName || "Join Circle"}
                            </span>
                          </span>
                        );
                      case "EMAIL":
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20"
                          >
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[120px]">
                              {act.emailSubject || "Email"}
                            </span>
                          </span>
                        );
                      case "NOTIFICATION":
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          >
                            <Bell className="w-3 h-3 shrink-0" />
                            <span>Push Notice</span>
                          </span>
                        );
                      case "ADD_MEMBER_TAG":
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                          >
                            <Tag className="w-3 h-3 shrink-0" />
                            <span>
                              {act.tags && act.tags.length > 0
                                ? act.tags.join(", ")
                                : "Add Tags"}
                            </span>
                          </span>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-[10px]">
                <Clock className="w-3 h-3" />
                {safeFormat(rule.updatedAt || rule.createdAt, "MMM dd, yyyy", "—")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(rule)}
                className="h-6 px-2 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
              >
                Configure
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
