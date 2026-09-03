"use client";

import React from "react";
import {
  UnifiedGamificationRule,
  GamificationModuleType,
  AnyGamificationTrigger,
  AnyGamificationActionType,
} from "@/graphql/gamification-automation";
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
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Award,
  Mail,
  Bell,
  Users,
  Tag,
  Coins,
  Medal,
  Crown,
  Trophy,
  Zap,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GamificationAutomationGridProps {
  rules: UnifiedGamificationRule[];
  onEdit: (rule: UnifiedGamificationRule) => void;
  onToggle: (rule: UnifiedGamificationRule, isActive: boolean) => Promise<void>;
  onDelete: (rule: UnifiedGamificationRule) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate?: (rule: UnifiedGamificationRule) => void;
  togglingId?: string | null;
}

export const GamificationAutomationGrid: React.FC<
  GamificationAutomationGridProps
> = ({
  rules,
  onEdit,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  togglingId,
}) => {
  const getModuleBadge = (module: GamificationModuleType) => {
    switch (module) {
      case "POINTS":
        return {
          label: "Points",
          icon: Coins,
          className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case "BADGES":
        return {
          label: "Badges",
          icon: Medal,
          className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "RANKS":
        return {
          label: "Ranks",
          icon: Crown,
          className:
            "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
      case "LEADERBOARD":
        return {
          label: "Leaderboard",
          icon: Trophy,
          className:
            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      case "CURRENCY":
        return {
          label: "Currency",
          icon: Coins,
          className:
            "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
        };
      default:
        return {
          label: "Module",
          icon: Coins,
          className: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const getActionBadge = (action: any, index: number) => {
    const type = action.type as AnyGamificationActionType;
    switch (type) {
      case "ASSIGN_MEMBERSHIP_TIER":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          >
            <Award className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[130px]">
              {action.tier?.tierName || action.tierName || "Tier Upgrade"}
            </span>
          </span>
        );
      case "COMMUNITY_JOIN":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
          >
            <Users className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[130px]">
              {action.community?.communityName ||
                action.communityName ||
                "Circle Access"}
            </span>
          </span>
        );
      case "EMAIL":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20"
          >
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[130px]">
              {action.email?.templateName ||
                action.email?.subject ||
                action.templateName ||
                "Email Dispatch"}
            </span>
          </span>
        );
      case "NOTIFICATION":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
          >
            <Bell className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[130px]">
              {action.notification?.pushTitle ||
                action.pushTitle ||
                "Push Alert"}
            </span>
          </span>
        );
      case "ADD_MEMBER_TAG":
        const tags = action.tag?.tags || action.tags || [];
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          >
            <Tag className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[130px]">
              {tags.length > 0 ? tags.join(", ") : "Member Tags"}
            </span>
          </span>
        );
      case "AWARD_POINTS":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25"
          >
            <Coins className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[130px]">
              +{action.points?.points || 0} pts
            </span>
          </span>
        );
      case "AWARD_BADGE":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          >
            <Medal className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[130px]">
              {action.badge?.badgeName || action.badgeName || "Award Badge"}
            </span>
          </span>
        );
      default:
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground"
          >
            <Zap className="w-3 h-3" />
            {type}
          </span>
        );
    }
  };

  if (rules.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rules.map((rule, index) => {
        const mod = getModuleBadge(rule.module);
        const ModIcon = mod.icon;
        const conds = rule.conditions || [];
        const acts = rule.actions || [];

        return (
          <div
            key={rule.id}
            onClick={() => onEdit(rule)}
            className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer space-y-4"
          >
            {/* Card Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border",
                      mod.className
                    )}
                  >
                    <ModIcon className="w-3 h-3" />
                    {mod.label}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                </div>

                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Switch
                    checked={rule.isActive}
                    disabled={togglingId === rule.id}
                    onCheckedChange={(checked) => onToggle(rule, checked)}
                    className="cursor-pointer data-[state=checked]:bg-emerald-600"
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem
                        onClick={() => onEdit(rule)}
                        className="text-xs font-medium cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                        Edit Rule
                      </DropdownMenuItem>
                      {onDuplicate && (
                        <DropdownMenuItem
                          onClick={() => onDuplicate(rule)}
                          className="text-xs font-medium cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                          Duplicate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={index === 0}
                        onClick={() => onMoveUp(index)}
                        className="text-xs font-medium cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                        Move Up
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={index === rules.length - 1}
                        onClick={() => onMoveDown(index)}
                        className="text-xs font-medium cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                        Move Down
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(rule)}
                        className="text-xs font-medium text-rose-600 focus:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete Rule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {rule.name}
                </h4>
                {rule.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {rule.description}
                  </p>
                )}
                {rule.targetName && (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/90 font-medium mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
                    <span>Target: {rule.targetName}</span>
                  </div>
                )}
              </div>

              {/* Trigger Info */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 border border-border/50">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-semibold text-foreground">Trigger:</span>
                <span className="truncate">{rule.trigger}</span>
              </div>

              {/* Criteria Pills */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Criteria ({conds.length})
                </div>
                {conds.length === 0 ? (
                  <span className="text-xs font-medium text-muted-foreground italic flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
                    Always fires on trigger event
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {conds.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border"
                      >
                        <span>{c.field}</span>
                        <span className="text-primary font-bold">
                          {c.operator}
                        </span>
                        <span className="text-foreground">
                          {String(c.value)}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions List */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Automated Actions ({acts.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {acts.map((act, i) => getActionBadge(act, i))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {rule.updatedAt
                    ? new Date(rule.updatedAt).toLocaleDateString()
                    : "Recently updated"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs font-medium gap-1 text-muted-foreground group-hover:text-primary transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Configure
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
