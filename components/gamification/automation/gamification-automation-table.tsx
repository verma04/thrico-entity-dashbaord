"use client";

import React from "react";
import {
  UnifiedGamificationRule,
  GamificationModuleType,
  AnyGamificationTrigger,
  AnyGamificationActionType,
} from "@/graphql/gamification-automation";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableTag,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export const gamificationAutomationTableColumns: { key: string; header: string }[] = [
  { key: "priority", header: "Order" },
  { key: "rule", header: "Rule Name & Scope" },
  { key: "module", header: "Module" },
  { key: "trigger", header: "Trigger Event" },
  { key: "conditions", header: "Criteria" },
  { key: "actions", header: "Automated Actions" },
  { key: "status", header: "Status" },
  { key: "updatedAt", header: "Updated" },
  { key: "actionsMenu", header: "Actions" },
];

interface GamificationAutomationTableProps {
  rules: UnifiedGamificationRule[];
  loading?: boolean;
  onEdit: (rule: UnifiedGamificationRule) => void;
  onToggle: (rule: UnifiedGamificationRule, isActive: boolean) => Promise<void>;
  onDelete: (rule: UnifiedGamificationRule) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate?: (rule: UnifiedGamificationRule) => void;
  togglingId?: string | null;
  visibleColumns?: Record<string, boolean>;
}

export const GamificationAutomationTable: React.FC<
  GamificationAutomationTableProps
> = ({
  rules,
  loading = false,
  onEdit,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  togglingId,
  visibleColumns = {},
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

  const getTriggerBadge = (trigger: AnyGamificationTrigger) => {
    switch (trigger) {
      case "POINTS_EARNED":
        return { label: "Points Earned", variant: "amber" as const };
      case "POINTS_THRESHOLD_REACHED":
        return { label: "Points Threshold", variant: "indigo" as const };
      case "DAILY_CAP_REACHED":
        return { label: "Daily Cap Hit", variant: "rose" as const };
      case "WEEKLY_CAP_REACHED":
        return { label: "Weekly Cap Hit", variant: "rose" as const };
      case "MONTHLY_CAP_REACHED":
        return { label: "Monthly Cap Hit", variant: "rose" as const };

      case "BADGE_EARNED":
        return { label: "Badge Earned", variant: "emerald" as const };
      case "BADGE_PROGRESS_UPDATED":
        return { label: "Progress Updated", variant: "sky" as const };
      case "ALL_BADGES_COMPLETED":
        return { label: "All Badges Done", variant: "purple" as const };

      case "RANK_ACHIEVED":
        return { label: "Rank Achieved", variant: "purple" as const };
      case "RANK_PROMOTED":
        return { label: "Rank Promoted", variant: "emerald" as const };
      case "RANK_DEMOTED":
        return { label: "Rank Demoted", variant: "rose" as const };

      case "LEADERBOARD_TOP_POSITION":
        return { label: "Top Position", variant: "amber" as const };
      case "LEADERBOARD_POSITION_CHANGED":
        return { label: "Position Changed", variant: "sky" as const };
      case "LEADERBOARD_ENTERED":
        return { label: "Entered Board", variant: "indigo" as const };

      default:
        return { label: trigger, variant: "muted" as const };
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
            <span className="truncate max-w-[120px]">
              {action.tier?.tierName || action.tierName || "Assign Tier"}
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
            <span className="truncate max-w-[120px]">
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
            <span className="truncate max-w-[120px]">
              {action.email?.templateName ||
                action.email?.subject ||
                action.templateName ||
                "Send Email"}
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
            <span className="truncate max-w-[120px]">
              {action.notification?.pushTitle ||
                action.pushTitle ||
                "Push Notification"}
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
            <span className="truncate max-w-[120px]">
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
            <span className="truncate max-w-[120px]">
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
            <span className="truncate max-w-[120px]">
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

  const columns: AdminTableColumn<UnifiedGamificationRule>[] = [
    {
      key: "priority",
      header: "Order",
      className: "w-[80px]",
      cell: (rule: UnifiedGamificationRule, index: number) => (
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs font-semibold text-muted-foreground w-4 text-center">
            {index + 1}
          </span>
          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-20"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(index);
              }}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-20"
              disabled={index === rules.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(index);
              }}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "rule",
      header: "Rule Name & Scope",
      cell: (rule: UnifiedGamificationRule) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              onClick={() => onEdit(rule)}
              className="text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {rule.name}
            </span>
          </div>
          {rule.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[280px]">
              {rule.description}
            </p>
          )}
          {rule.targetName && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 inline-block" />
              <span>Target: {rule.targetName}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "module",
      header: "Module",
      className: "w-[110px]",
      cell: (rule: UnifiedGamificationRule) => {
        const mod = getModuleBadge(rule.module);
        const Icon = mod.icon;
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border",
              mod.className
            )}
          >
            <Icon className="w-3 h-3" />
            {mod.label}
          </span>
        );
      },
    },
    {
      key: "trigger",
      header: "Trigger Event",
      className: "w-[140px]",
      cell: (rule: UnifiedGamificationRule) => {
        const trigger = getTriggerBadge(rule.trigger);
        return (
          <AdminTableTag variant={trigger.variant}>
            {trigger.label}
          </AdminTableTag>
        );
      },
    },
    {
      key: "conditions",
      header: "Criteria",
      cell: (rule: UnifiedGamificationRule) => {
        const conds = rule.conditions || [];
        if (conds.length === 0) {
          return (
            <span className="text-[11px] font-medium text-muted-foreground italic flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500/70" />
              Always fires
            </span>
          );
        }
        return (
          <div className="flex flex-wrap items-center gap-1 max-w-[220px]">
            {conds.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border"
              >
                <span>{c.field}</span>
                <span className="text-primary font-bold">{c.operator}</span>
                <span className="text-foreground">{String(c.value)}</span>
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Automated Actions",
      cell: (rule: UnifiedGamificationRule) => {
        const acts = rule.actions || [];
        if (acts.length === 0) {
          return (
            <span className="text-[11px] text-muted-foreground italic">
              No actions
            </span>
          );
        }
        return (
          <div className="flex flex-wrap items-center gap-1.5 max-w-[340px]">
            {acts.map((act, i) => getActionBadge(act, i))}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      className: "w-[110px]",
      cell: (rule: UnifiedGamificationRule) => (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={rule.isActive}
            disabled={togglingId === rule.id}
            onCheckedChange={(checked) => onToggle(rule, checked)}
            className="cursor-pointer data-[state=checked]:bg-emerald-600"
          />
          <span
            className={cn(
              "text-xs font-semibold select-none",
              rule.isActive ? "text-emerald-600" : "text-muted-foreground"
            )}
          >
            {rule.isActive ? "Active" : "Paused"}
          </span>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      className: "w-[110px]",
      cell: (rule: UnifiedGamificationRule) => (
        <AdminTableDate date={rule.updatedAt} />
      ),
    },
    {
      key: "actionsMenu",
      header: "",
      className: "w-[48px]",
      cell: (rule: UnifiedGamificationRule, index: number) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={(e) => e.stopPropagation()}
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
      ),
    },
  ];

  const filteredColumns = columns.filter(
    (col) => visibleColumns[col.key] !== false
  );

  return (
    <AdminTable
      data={rules}
      columns={filteredColumns}
      loading={loading}
      keyExtractor={(rule) => rule.id}
      emptyTitle="No Gamification Automation Rules"
      emptyDescription="Create your first automated action flow or pick from starter blueprints above."
    />
  );
};
