"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  MemberAutomationRule,
  MemberRuleTrigger,
  MemberRuleActionType,
} from "@/graphql/member-automation";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminTableDate,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
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
  Sliders,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const automationTableColumns = [
  { key: "priority", header: "Order" },
  { key: "rule", header: "Rule Name" },
  { key: "trigger", header: "Trigger Event" },
  { key: "conditions", header: "Target Conditions" },
  { key: "actions", header: "Automated Actions" },
  { key: "status", header: "Status" },
  { key: "updatedAt", header: "Updated" },
  { key: "actionsMenu", header: "Actions" },
];

interface AutomationTableProps {
  rules: MemberAutomationRule[];
  loading?: boolean;
  onEdit: (rule: MemberAutomationRule) => void;
  onToggle: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate?: (rule: MemberAutomationRule) => void;
  togglingId?: string | null;
  visibleColumns?: Record<string, boolean>;
}

export const AutomationTable: React.FC<AutomationTableProps> = ({
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
  const router = useRouter();

  const getTriggerBadge = (trigger: MemberRuleTrigger) => {
    switch (trigger) {
      case "MEMBER_JOINED":
        return {
          label: "When Joins",
          icon: UserPlus,
          variant: "emerald" as const,
        };
      case "MEMBER_APPROVED":
        return {
          label: "When Approved",
          icon: CheckCircle2,
          variant: "blue" as const,
        };
      case "MEMBER_VERIFIED":
        return {
          label: "When Verified",
          icon: ShieldCheck,
          variant: "purple" as const,
        };
      default:
        return {
          label: trigger,
          icon: Zap,
          variant: "slate" as const,
        };
    }
  };

  const getActionBadge = (action: any, index: number) => {
    switch (action.type as MemberRuleActionType) {
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
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20"
          >
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[110px]">
              {action.emailSubject || "Send Email"}
            </span>
          </span>
        );
      case "NOTIFICATION":
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          >
            <Bell className="w-3 h-3 shrink-0" />
            <span>Push Notice</span>
          </span>
        );
      case "ADD_MEMBER_TAG":
        const tagCount = action.tags?.length || 0;
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
          >
            <Tag className="w-3 h-3 shrink-0" />
            <span>
              {tagCount > 0
                ? action.tags.slice(0, 2).join(", ") + (tagCount > 2 ? ` +${tagCount - 2}` : "")
                : "Add Tags"}
            </span>
          </span>
        );
      default:
        return null;
    }
  };

  const columns: AdminTableColumn<MemberAutomationRule>[] = [
    {
      key: "priority",
      header: "# Priority",
      headerClassName: "w-24 text-center",
      className: "text-center",
      cell: (row, index) => {
        const isFirst = index === 0;
        const isLast = index === rules.length - 1;
        return (
          <div className="flex items-center justify-center gap-1">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              #{row.priority ?? index + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                disabled={isFirst}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp(index);
                }}
                className={cn(
                  "p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors",
                  isFirst && "opacity-20 cursor-not-allowed"
                )}
                title="Move up priority"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={isLast}
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown(index);
                }}
                className={cn(
                  "p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors",
                  isLast && "opacity-20 cursor-not-allowed"
                )}
                title="Move down priority"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      },
    },
    {
      key: "rule",
      header: "Rule Name & Description",
      cell: (row) => (
        <div
          onClick={() => onEdit(row)}
          className="cursor-pointer group flex items-start gap-3 min-w-[220px]"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-zinc-200/80 dark:border-zinc-700 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-colors shadow-2xs">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors truncate">
                {row.name}
              </span>
              {row.conditionOperator && row.conditions && row.conditions.length > 1 && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  {row.conditionOperator}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
              {row.description || "Automated membership assignment rule."}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "trigger",
      header: "Trigger",
      cell: (row) => {
        const t = getTriggerBadge(row.trigger);
        return (
          <AdminTableTag variant={t.variant} icon={t.icon}>
            {t.label}
          </AdminTableTag>
        );
      },
    },
    {
      key: "conditions",
      header: "Conditions",
      cell: (row) => {
        const conds = row.conditions || [];
        if (conds.length === 0) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-500 bg-zinc-100/70 dark:bg-zinc-800/60 dark:text-zinc-400">
              Always matches (All members)
            </span>
          );
        }
        return (
          <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
            {conds.map((c, i) => {
              const fieldLabel = c.field.replace("profile.", "").replace("user.", "");
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {fieldLabel}:
                  </span>
                  <span className="truncate max-w-[120px]">
                    {String(c.value || c.operator)}
                  </span>
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions Pipeline",
      cell: (row) => (
        <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
          {row.actions.map((act, i) => getActionBadge(act, i))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const isToggling = togglingId === row.id;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.isActive}
              disabled={isToggling}
              onCheckedChange={(checked) => onToggle(row.id, checked)}
              className="data-[state=checked]:bg-emerald-600 h-4 w-8"
            />
            <span
              className={cn(
                "text-[11px] font-semibold",
                row.isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400 dark:text-zinc-500"
              )}
            >
              {row.isActive ? "Active" : "Paused"}
            </span>
          </div>
        );
      },
    },
    {
      key: "updatedAt",
      header: "Updated",
      cell: (row) => (
        <AdminTableDate date={row.updatedAt || row.createdAt} />
      ),
    },
    {
      key: "actionsMenu",
      header: "Actions",
      headerClassName: "w-12 text-right",
      className: "text-right",
      isFixedRight: true,
      cell: (row, index) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
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
                Duplicate Rule
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onToggle(row.id, !row.isActive)}
              className="text-xs gap-2 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" />
              {row.isActive ? "Pause Rule" : "Activate Rule"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={index === 0}
              onClick={() => onMoveUp(index)}
              className="text-xs gap-2 cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Move Up
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={index === rules.length - 1}
              onClick={() => onMoveDown(index)}
              className="text-xs gap-2 cursor-pointer"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Move Down
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(row.id)}
              className="text-xs gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
      <AdminTable
        columns={filteredColumns}
        data={rules}
        loading={loading}
        keyExtractor={(row) => row.id}
        emptyTitle="No automation rules found"
        emptyDescription="Create your first rule to automatically assign membership tiers, community circles, emails, and tags."
        emptyIcon={Zap}
        size="sm"
      />
    </div>
  );
};
