"use client";

import React from "react";
import {
  MemberAutomationRule,
  MemberRuleTrigger,
} from "@/graphql/member-automation";
import {
  Award,
  Mail,
  Bell,
  Tag,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Edit2,
  Trash2,
  Zap,
  Users,
  ShieldCheck,
  CheckCircle2,
  GitCommit,
  Layers,
  Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RuleCardProps {
  rule: MemberAutomationRule;
  index: number;
  totalRules: number;
  onEdit: (rule: MemberAutomationRule) => void;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isToggling?: boolean;
}

export const RuleCard: React.FC<RuleCardProps> = ({
  rule,
  index,
  totalRules,
  onEdit,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  isToggling = false,
}) => {
  const getTriggerLabel = (trigger: MemberRuleTrigger) => {
    switch (trigger) {
      case "MEMBER_JOINED":
        return {
          label: "Member Registration / Joins",
          icon: Users,
          color:
            "text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/20",
        };
      case "MEMBER_APPROVED":
        return {
          label: "Member Registration Approved",
          icon: CheckCircle2,
          color:
            "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
        };
      case "MEMBER_VERIFIED":
        return {
          label: "Identity / Profile Verified",
          icon: ShieldCheck,
          color:
            "text-purple-700 dark:text-purple-300 bg-purple-500/10 border-purple-500/20",
        };
      default:
        return {
          label: trigger,
          icon: Zap,
          color: "text-zinc-600 bg-zinc-100 border-zinc-200",
        };
    }
  };

  const triggerConfig = getTriggerLabel(rule.trigger);
  const TriggerIcon = triggerConfig.icon;

  const conditions = rule.conditions || [];
  const actions = rule.actions || [];

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        rule.isActive
          ? "bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
          : "bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50 opacity-70"
      }`}
    >
      <div className="p-4 sm:p-5 space-y-4">
        {/* Header: Priority, Title, Toggle, Options */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Priority Badge */}
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center border border-zinc-200/80 dark:border-zinc-700 shadow-2xs shrink-0">
              #{rule.priority ?? index + 1}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {rule.name}
                </h3>
                {rule.isActive ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-zinc-400 dark:text-zinc-500 border-zinc-300 dark:border-zinc-700 text-[10px]"
                  >
                    Paused
                  </Badge>
                )}
              </div>
              {rule.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                  {rule.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Priority Reordering Buttons */}
            <div className="hidden sm:flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60">
              <Button
                variant="ghost"
                size="icon"
                disabled={index === 0}
                onClick={() => onMoveUp(index)}
                className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30"
                title="Move Priority Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={index === totalRules - 1}
                onClick={() => onMoveDown(index)}
                className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30"
                title="Move Priority Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Quick Active Switch */}
            <Switch
              checked={rule.isActive}
              disabled={isToggling}
              onCheckedChange={(checked) => onToggle(rule.id, checked)}
            />

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 text-xs">
                <DropdownMenuItem onClick={() => onEdit(rule)}>
                  <Edit2 className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                  Edit Rule
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={index === 0}
                  onClick={() => onMoveUp(index)}
                  className="sm:hidden"
                >
                  <ArrowUp className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                  Move Up
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={index === totalRules - 1}
                  onClick={() => onMoveDown(index)}
                  className="sm:hidden"
                >
                  <ArrowDown className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                  Move Down
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(rule.id)}
                  className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2 text-rose-500" />
                  Delete Rule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Visual Rule Flow (WHEN -> IF -> THEN) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
          {/* 1. WHEN (Trigger) */}
          <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              1. WHEN (TRIGGER)
            </span>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[11px] font-medium gap-1.5 py-1 ${triggerConfig.color}`}
              >
                <TriggerIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{triggerConfig.label}</span>
              </Badge>
            </div>
          </div>

          {/* 2. IF (Conditions) */}
          <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              2. IF (CONDITIONS){" "}
              {conditions.length > 1 ? `[${rule.conditionOperator || "AND"}]` : ""}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {conditions.length === 0 ? (
                <span className="text-xs text-zinc-500 italic">
                  Always applies (All members)
                </span>
              ) : (
                conditions.map((cond, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[11px] font-medium bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 py-0.5"
                  >
                    <span className="text-zinc-500 mr-1">
                      {cond.field
                        .replace("profile.", "")
                        .replace("userToEntity.", "")
                        .replace("user.", "")}
                      :
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {cond.operator === "is_not_empty"
                        ? "is set"
                        : cond.operator === "is_empty"
                        ? "is empty"
                        : Array.isArray(cond.value)
                        ? cond.value.join(", ")
                        : String(cond.value)}
                    </span>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* 3. THEN (Actions) */}
          <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              3. THEN (AUTOMATED ACTIONS)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {actions.map((act, i) => {
                switch (act.type) {
                  case "ASSIGN_MEMBERSHIP_TIER":
                    return (
                      <Badge
                        key={i}
                        className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Award className="w-3 h-3" />
                        <span>Tier: {act.tierName || act.tierId || "Assigned"}</span>
                      </Badge>
                    );
                  case "COMMUNITY_JOIN":
                    return (
                      <Badge
                        key={i}
                        className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Users className="w-3 h-3" />
                        <span>Join: {act.communityName || act.communityId || "Community"}</span>
                      </Badge>
                    );
                  case "EMAIL":
                    return (
                      <Badge
                        key={i}
                        className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        <span>
                          {act.emailSubject
                            ? `Email: "${act.emailSubject.slice(0, 18)}..."`
                            : act.templateName
                            ? `Template: ${act.templateName}`
                            : "Email Sent"}
                        </span>
                      </Badge>
                    );
                  case "NOTIFICATION":
                    return (
                      <Badge
                        key={i}
                        className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Bell className="w-3 h-3" />
                        <span>
                          {act.pushTitle
                            ? `Push: "${act.pushTitle.slice(0, 18)}..."`
                            : "Push Notification"}
                        </span>
                      </Badge>
                    );
                  case "ADD_MEMBER_TAG":
                    return (
                      <Badge
                        key={i}
                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        <span>
                          Tags (
                          {act.tags && act.tags.length > 0
                            ? act.tags.join(", ")
                            : "None"}
                          )
                        </span>
                      </Badge>
                    );
                  default:
                    return (
                      <Badge key={i} variant="outline" className="text-[11px]">
                        {act.type}
                      </Badge>
                    );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
