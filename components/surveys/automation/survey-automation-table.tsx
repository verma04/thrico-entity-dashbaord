"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  SurveyAutomationRule,
  SurveyRuleTrigger,
  SurveyRuleActionType,
} from "@/graphql/survey-automation";
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
  ClipboardList,
  CheckCircle2,
  PlusCircle,
  Zap,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const surveyAutomationTableColumns: { key: string; header: string }[] = [
  { key: "priority", header: "Order" },
  { key: "rule", header: "Rule Name & Scope" },
  { key: "trigger", header: "Trigger Event" },
  { key: "conditions", header: "Criteria" },
  { key: "actions", header: "Automated Actions" },
  { key: "status", header: "Status" },
  { key: "updatedAt", header: "Updated" },
  { key: "actionsMenu", header: "Actions" },
];

interface SurveyAutomationTableProps {
  rules: SurveyAutomationRule[];
  loading?: boolean;
  onEdit: (rule: SurveyAutomationRule) => void;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate?: (rule: SurveyAutomationRule) => void;
  togglingId?: string | null;
  visibleColumns?: Record<string, boolean>;
}

export const SurveyAutomationTable: React.FC<SurveyAutomationTableProps> = ({
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
  const getTriggerBadge = (trigger: SurveyRuleTrigger) => {
    switch (trigger) {
      case "SURVEY_SUBMITTED":
        return {
          label: "On Submit",
          variant: "sky" as const,
        };
      case "SURVEY_COMPLETED":
        return {
          label: "On Completed",
          variant: "emerald" as const,
        };
      case "SURVEY_CREATED":
        return {
          label: "On Launch",
          variant: "indigo" as const,
        };
      default:
        return {
          label: trigger,
          variant: "muted" as const,
        };
    }
  };

  const getActionBadge = (action: any, index: number) => {
    switch (action.type as SurveyRuleActionType) {
      case "ASSIGN_MEMBERSHIP_TIER":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          >
            <Award className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[110px]">
              {action.tierName || "Assign Tier"}
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
            <span className="truncate max-w-[110px]">
              {action.communityName || "Join Circle"}
            </span>
          </span>
        );
      case "EMAIL":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
          >
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[110px]">
              {action.emailSubject || "Email"}
            </span>
          </span>
        );
      case "NOTIFICATION":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
          >
            <Bell className="w-3 h-3 shrink-0" />
            <span>Push Alert</span>
          </span>
        );
      case "ADD_MEMBER_TAG":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          >
            <Tag className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[100px]">
              {action.tags?.join(", ") || "Tags"}
            </span>
          </span>
        );
      default:
        return null;
    }
  };

  const columns: AdminTableColumn<SurveyAutomationRule>[] = [
    {
      key: "priority",
      header: "#",
      headerClassName: "w-16 text-center",
      className: "text-center",
      cell: (row: SurveyAutomationRule, index?: number) => {
        const idx = index ?? 0;
        return (
          <span className="font-mono text-xs font-bold text-muted-foreground">
            #{row.priority ?? idx + 1}
          </span>
        );
      },
    },
    {
      key: "rule",
      header: "Rule Name & Scope",
      cell: (row: SurveyAutomationRule) => (
        <div
          onClick={() => onEdit(row)}
          className="flex items-center gap-3 max-w-[260px] cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
              {row.name}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {row.surveyName ? `📋 ${row.surveyName}` : "🌐 All Surveys"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "trigger",
      header: "Trigger",
      cell: (row: SurveyAutomationRule) => {
        const t = getTriggerBadge(row.trigger);
        return <AdminTableTag variant={t.variant}>{t.label}</AdminTableTag>;
      },
    },
    {
      key: "conditions",
      header: "Criteria",
      cell: (row: SurveyAutomationRule) => {
        const conds = row.conditions || [];
        if (conds.length === 0) {
          return (
            <span className="text-[11px] text-muted-foreground italic">
              All responses
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {conds.map((c, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded bg-muted text-[10.5px] font-medium border border-border"
              >
                {c.field.replace("context.", "")}: {String(c.value)}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions Pipeline",
      cell: (row: SurveyAutomationRule) => {
        const branchCount = new Set(
          row.actions.map((a) =>
            a.conditions && a.conditions.length > 0
              ? JSON.stringify(a.conditions)
              : "universal",
          ),
        ).size;

        const actionCounts: Record<string, number> = {};
        row.actions.forEach((act) => {
          actionCounts[act.type] = (actionCounts[act.type] || 0) + 1;
        });

        return (
          <div className="flex flex-wrap items-center gap-1.5 max-w-[260px]">
            {branchCount > 1 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                <GitBranch className="w-2.5 h-2.5" />
                {branchCount} Branches
              </span>
            )}

            {actionCounts["EMAIL"] && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Mail className="w-3 h-3 shrink-0" />
                <span>Email ({actionCounts["EMAIL"]})</span>
              </span>
            )}
            {actionCounts["ASSIGN_MEMBERSHIP_TIER"] && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Award className="w-3 h-3 shrink-0" />
                <span>Tier ({actionCounts["ASSIGN_MEMBERSHIP_TIER"]})</span>
              </span>
            )}
            {actionCounts["ADD_MEMBER_TAG"] && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Tag className="w-3 h-3 shrink-0" />
                <span>Tags ({actionCounts["ADD_MEMBER_TAG"]})</span>
              </span>
            )}
            {actionCounts["COMMUNITY_JOIN"] && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Users className="w-3 h-3 shrink-0" />
                <span>Circle ({actionCounts["COMMUNITY_JOIN"]})</span>
              </span>
            )}
            {actionCounts["NOTIFICATION"] && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Bell className="w-3 h-3 shrink-0" />
                <span>Alert ({actionCounts["NOTIFICATION"]})</span>
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Active",
      cell: (row: SurveyAutomationRule) => (
        <Switch
          checked={row.isActive}
          disabled={togglingId === row.id}
          onCheckedChange={(checked) => onToggle(row.id, checked)}
          className="data-[state=checked]:bg-emerald-600"
        />
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      cell: (row: SurveyAutomationRule) => (
        <AdminTableDate date={row.updatedAt || row.createdAt} />
      ),
    },
    {
      key: "actionsMenu",
      header: "",
      headerClassName: "w-12 text-right",
      className: "text-right",
      isFixedRight: true,
      cell: (row: SurveyAutomationRule, index?: number) => {
        const idx = index ?? 0;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => onEdit(row)}
                className="text-xs gap-2 cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Rule
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem
                  onClick={() => onDuplicate(row)}
                  className="text-xs gap-2 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={idx === 0}
                onClick={() => onMoveUp(idx)}
                className="text-xs gap-2 cursor-pointer"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                Move Up
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={idx === rules.length - 1}
                onClick={() => onMoveDown(idx)}
                className="text-xs gap-2 cursor-pointer"
              >
                <ArrowDown className="h-3.5 w-3.5" />
                Move Down
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(row.id)}
                className="text-xs gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Rule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredColumns = columns.filter(
    (col) => visibleColumns[col.key] !== false,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
      <AdminTable
        data={rules}
        columns={filteredColumns}
        loading={loading}
        keyExtractor={(row) => row.id}
        emptyTitle="No survey automation rules found"
        emptyDescription="Create your first survey rule to automatically assign membership tiers, emails, circles, and member tags."
        emptyIcon={ClipboardList}
        size="sm"
      />
    </div>
  );
};
