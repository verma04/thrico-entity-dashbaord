"use client";

import React from "react";
import { Zap, Coins } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/graphql/actions";
import { BadgeActions } from "./badge-actions";
import { BadgeIcon } from "./badge-icon";
import { renderModuleIcon } from "@/components/subscription/utils";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getBadgeTableColumns = (
  modules: { id: string; name: string; icon: string; type?: "MODULE" | "INTEGRATION" }[],
  onEdit: (badge: Badge) => void,
  onToggleActive: (id: string) => void,
  toggling?: boolean,
): AdminTableColumn<Badge>[] => {
  const getModuleInfo = (moduleId?: string) => {
    if (!moduleId) return null;
    return modules.find(
      (m) =>
        m.id?.toLowerCase() === moduleId.toLowerCase() ||
        (m as any).uuid?.toLowerCase() === moduleId.toLowerCase() ||
        (m as any).slug?.toLowerCase() === moduleId.toLowerCase(),
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
      key: "badge",
      header: "Recognition Badge",
      cell: (badge: Badge) => (
        <AdminTableItem
          icon={
            <BadgeIcon
              icon={badge.icon}
              className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm shrink-0 flex items-center justify-center"
            />
          }
          title={badge.name}
          subtitle={badge.description}
        />
      ),
    },
    {
      key: "source",
      header: "Source",
      cell: (badge: Badge) => {
        const moduleInfo = getModuleInfo(badge.module);
        const source = badge.source || moduleInfo?.type || "MODULE";
        const isIntegration = source === "INTEGRATION";
        return (
          <AdminTableTag variant={isIntegration ? "purple" : "indigo"}>
            {isIntegration ? "Integration" : "Module"}
          </AdminTableTag>
        );
      },
    },
    {
      key: "origin",
      header: "Domain",
      cell: (badge: Badge) => {
        const moduleInfo = getModuleInfo(badge.module);
        return moduleInfo ? (
          <div className="flex items-center gap-1.5 group">
            <div className="h-5 w-5 rounded flex items-center justify-center bg-muted/60 border border-border/50 transition-colors">
              {renderModuleIcon(
                moduleInfo.icon,
                "h-3 w-3 text-muted-foreground",
              )}
            </div>
            <span className="text-[12px] font-semibold text-foreground truncate max-w-[120px]">
              {moduleInfo.name}
            </span>
          </div>
        ) : (
          <AdminTableTag variant="muted">Global</AdminTableTag>
        );
      },
    },
    {
      key: "criteria",
      header: "Award Criteria",
      cell: (badge: Badge) => {
        const isAction = badge.type === "ACTION";
        return (
          <div className="flex items-center gap-1.5">
            <div className="text-muted-foreground/70">
              {isAction ? (
                <Zap className="h-3 w-3 text-amber-500" />
              ) : (
                <Coins className="h-3 w-3 text-indigo-500" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-foreground uppercase tracking-tight">
                {isAction
                  ? (badge.condition?.action || badge.action || "").replace(
                      /_/g,
                      " ",
                    )
                  : "Threshold Points"}
              </span>
              <span className="text-[9px] text-muted-foreground font-semibold font-mono">
                REQ:{" "}
                {isAction
                  ? badge.condition?.count || badge.targetValue || 1
                  : `${(badge.condition?.pointsRequired || badge.targetValue || 0)?.toLocaleString()} PTS`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "eligibility",
      header: "Eligibility",
      cell: (badge: Badge) => (
        <AdminTableTag variant="purple">
          {badge.memberEligibility
            ? badge.memberEligibility.replace(/_/g, " ")
            : "ALL"}
        </AdminTableTag>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (badge: Badge) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={badge.isActive}
            onCheckedChange={() => onToggleActive(badge.id)}
            disabled={toggling}
            className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
          />
          <AdminStatusBadge status={badge.isActive ? "APPROVED" : "DISABLED"}>
            {badge.isActive ? "Active" : "Disabled"}
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
      cell: (badge: Badge) => (
        <BadgeActions
          badge={badge}
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

export interface BadgesTableListProps {
  badges: Badge[];
  modules: { id: string; name: string; icon: string; type?: "MODULE" | "INTEGRATION" }[];
  onEdit: (badge: Badge) => void;
  onToggleActive: (id: string) => void;
  toggling?: boolean;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function BadgesTableList({
  badges,
  modules,
  onEdit,
  onToggleActive,
  toggling,
  visibleColumns,
  offset = 0,
}: BadgesTableListProps) {
  const baseColumns = React.useMemo(
    () =>
      getBadgeTableColumns(
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
      <AdminTable<Badge>
        columns={activeColumns}
        data={badges}
        keyExtractor={(b) => b.id}
        emptyTitle="No badges defined"
        emptyDescription="Badges motivate community participation. Create your first credential to reward member loyalty."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default BadgesTableList;
