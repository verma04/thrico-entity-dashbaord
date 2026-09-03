"use client";

import React from "react";
import { Zap, Sparkles, Repeat } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PointRule } from "@/graphql/actions";
import { PointRuleActions } from "./point-rule-actions";
import { renderModuleIcon } from "@/components/subscription/utils";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getPointRuleTableColumns = (
  modules: {
    id: string;
    name: string;
    icon: string;
    type?: "MODULE" | "INTEGRATION";
  }[],
  onEdit: (rule: PointRule) => void,
  onToggleActive: (id: string) => void,
  toggling?: boolean,
): AdminTableColumn<PointRule>[] => {
  const getModuleInfo = (moduleId: string) => {
    return modules.find(
      (m) =>
        m.id?.toLowerCase() === moduleId?.toLowerCase() ||
        (m as any).uuid?.toLowerCase() === moduleId?.toLowerCase() ||
        (m as any).slug?.toLowerCase() === moduleId?.toLowerCase(),
    );
  };

  return [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-12 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => index + 1,
    },
    {
      key: "module",
      header: "Origin Module",
      cell: (rule: PointRule) => {
        const moduleInfo = getModuleInfo(rule.module);
        return (
          <AdminTableItem
            icon={renderModuleIcon(
              moduleInfo?.icon || "Settings",
              "h-3.5 w-3.5 text-foreground",
            )}
            title={moduleInfo?.name || rule.module}
            subtitle={
              rule.trigger === "FIRST_TIME" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-2.5 w-2.5" /> One-Time Milestone
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                  <Repeat className="h-2.5 w-2.5" /> Recurring Rule
                </span>
              )
            }
          />
        );
      },
    },
    {
      key: "cadence",
      header: "Cadence",
      cell: (rule: PointRule) => {
        const isFirstTime = rule.trigger === "FIRST_TIME";
        return isFirstTime ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap shadow-2xs">
            <Sparkles className="h-2.5 w-2.5 text-amber-500 fill-amber-500/20" />
            One-Time
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 whitespace-nowrap shadow-2xs">
            <Repeat className="h-2.5 w-2.5 text-sky-500" />
            Recurring
          </span>
        );
      },
    },
    {
      key: "source",
      header: "Source",
      cell: (rule: PointRule) => {
        const moduleInfo = getModuleInfo(rule.module);
        const source = rule.source || moduleInfo?.type || "MODULE";
        const isIntegration = source === "INTEGRATION";
        return (
          <AdminTableTag variant={isIntegration ? "purple" : "indigo"}>
            {isIntegration ? "Integration" : "Module"}
          </AdminTableTag>
        );
      },
    },
    {
      key: "action",
      header: "Trigger Event",
      className: "min-w-[180px] max-w-[300px]",
      cell: (rule: PointRule) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground capitalize">
            <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              {rule.action.replace(/_/g, " ").toLowerCase()}
            </span>
          </div>
          {rule.description ? (
            <p
              className="text-[11px] text-muted-foreground line-clamp-1 pl-5"
              title={rule.description}
            >
              {rule.description}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "points",
      header: "Yield",
      cell: (rule: PointRule) => (
        <AdminTableMetric
          value={`+${rule.points.toLocaleString()}`}
          unit="PTS"
          variant="indigo"
        />
      ),
    },
    {
      key: "eligibility",
      header: "Eligibility",
      cell: (rule: PointRule) => (
        <AdminTableTag variant="purple">
          {" "}
          {rule?.memberEligibility?.replace(/_/g, " ")}
        </AdminTableTag>
      ),
    },
    {
      key: "dailyCap",
      header: "Daily",
      cell: (rule: PointRule) => {
        if (rule.trigger === "FIRST_TIME") {
          return (
            <span className="text-[12px] text-muted-foreground font-medium">
              —
            </span>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-foreground">
              {rule.dailyCap ? `${rule.dailyCap}x` : "∞"}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
              Limit
            </span>
          </div>
        );
      },
    },
    {
      key: "weeklyCap",
      header: "Weekly",
      cell: (rule: PointRule) => {
        if (rule.trigger === "FIRST_TIME") {
          return (
            <span className="text-[12px] text-muted-foreground font-medium">
              —
            </span>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-foreground">
              {rule.weeklyCap ? `${rule.weeklyCap}x` : "∞"}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
              Limit
            </span>
          </div>
        );
      },
    },
    {
      key: "monthlyCap",
      header: "Monthly",
      cell: (rule: PointRule) => {
        if (rule.trigger === "FIRST_TIME") {
          return (
            <span className="text-[12px] text-muted-foreground font-medium">
              —
            </span>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-foreground">
              {rule.monthlyCap ? `${rule.monthlyCap}x` : "∞"}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
              Limit
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (rule: PointRule) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={rule.isActive}
            onCheckedChange={() => onToggleActive(rule.id)}
            disabled={toggling}
            className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
          />
          <AdminStatusBadge status={rule.isActive ? "APPROVED" : "DISABLED"}>
            {rule.isActive ? "Active" : "Disabled"}
          </AdminStatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-10 text-right",
      className: "text-right",
      isFixedRight: true,
      cell: (rule: PointRule) => (
        <PointRuleActions
          rule={rule}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
        />
      ),
    },
  ];
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface PointRulesListProps {
  rules: PointRule[];
  modules: {
    id: string;
    name: string;
    icon: string;
    type?: "MODULE" | "INTEGRATION";
  }[];
  onEdit: (rule: PointRule) => void;
  onToggleActive: (id: string) => void;
  toggling?: boolean;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function PointRulesList({
  rules,
  modules,
  onEdit,
  onToggleActive,
  toggling,
  visibleColumns,
  offset = 0,
}: PointRulesListProps) {
  const baseColumns = React.useMemo(
    () =>
      getPointRuleTableColumns(
        modules,
        onEdit,
        onToggleActive,
        toggling,
      ),
    [modules, onEdit, onToggleActive, toggling],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<PointRule>
        columns={activeColumns}
        data={rules}
        keyExtractor={(r) => r.id}
        emptyTitle="No scoring rules found"
        emptyDescription="Create a reward rule to start incentivizing engagement across the ecosystem."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default PointRulesList;
