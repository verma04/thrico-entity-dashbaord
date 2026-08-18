"use client";

import React from "react";
import { ArrowUp, ArrowDown, TrendingUp, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Rank, useToggleRank } from "@/graphql/actions";
import { RankActions } from "./rank-actions";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getRankTableColumns = (
  sortedRanks: Rank[],
  onEdit: (rank: Rank) => void,
  onOpenNotifications: (rank: Rank) => void,
  onMoveUp: (index: number) => void,
  onMoveDown: (index: number) => void,
  handleToggle: (id: string) => void,
  toggling?: boolean,
  refetch?: () => void,
): AdminTableColumn<Rank>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "order",
    header: "Order",
    headerClassName: "w-[60px] text-center",
    className: "text-center",
    cell: (_, index: number) => (
      <div className="flex items-center justify-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-5 w-5 p-0 rounded text-muted-foreground hover:text-foreground hover:bg-muted",
            index === 0 && "opacity-20 pointer-events-none",
          )}
          onClick={() => onMoveUp(index)}
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-5 w-5 p-0 rounded text-muted-foreground hover:text-foreground hover:bg-muted",
            index === sortedRanks.length - 1 && "opacity-20 pointer-events-none",
          )}
          onClick={() => onMoveDown(index)}
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
      </div>
    ),
  },
  {
    key: "rank",
    header: "Rank Identity",
    cell: (rank: Rank, index: number) => (
      <AdminTableItem
        icon={
          <div
            className="h-7 w-7 flex items-center justify-center rounded-md border overflow-hidden shrink-0"
            style={{
              backgroundColor: `${rank.color || "#6366f1"}12`,
              borderColor: `${rank.color || "#6366f1"}25`,
            }}
          >
            <BadgeIcon
              icon={rank.icon}
              className="h-full w-full text-xs flex items-center justify-center"
              imageClassName="rounded-md"
            />
          </div>
        }
        title={rank.name}
        badge={
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded border"
            style={{
              color: rank.color || "#6366f1",
              borderColor: `${rank.color || "#6366f1"}30`,
              backgroundColor: `${rank.color || "#6366f1"}10`,
            }}
          >
            Tier {index + 1}
          </span>
        }
      />
    ),
  },
  {
    key: "range",
    header: "Point Threshold",
    cell: (rank: Rank) => (
      <div className="flex items-center gap-1.5 text-[12px] font-mono font-medium text-foreground">
        <TrendingUp className="h-3 w-3 text-muted-foreground/60 shrink-0" />
        <span>{rank?.minPoints?.toLocaleString() ?? 0}</span>
        <span className="text-muted-foreground opacity-40">—</span>
        <span>{rank?.maxPoints?.toLocaleString() ?? 0}</span>
        <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
          PTS
        </span>
      </div>
    ),
  },
  {
    key: "notifications",
    header: "Alerts",
    cell: (rank: Rank) => {
      const hasPush = rank.allowPushNotification !== false;
      const hasEmail = rank.allowEmailNotification !== false;

      return (
        <div className="flex items-center gap-1.5">
          <div
            title={hasPush ? "Push Notification Enabled" : "Push Notification Muted"}
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors",
              hasPush
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
                : "bg-transparent text-zinc-400 dark:text-zinc-600 border-transparent opacity-40",
            )}
          >
            <Bell className="h-3 w-3" />
            <span>Push</span>
          </div>
          <div
            title={hasEmail ? "Email Notification Enabled" : "Email Notification Muted"}
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors",
              hasEmail
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
                : "bg-transparent text-zinc-400 dark:text-zinc-600 border-transparent opacity-40",
            )}
          >
            <Mail className="h-3 w-3" />
            <span>Email</span>
          </div>
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Participation",
    cell: (rank: Rank) => (
      <div className="flex items-center gap-2">
        <Switch
          checked={rank.isActive}
          onCheckedChange={() => handleToggle(rank.id)}
          disabled={toggling}
          className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
        />
        <AdminStatusBadge status={rank.isActive ? "APPROVED" : "DISABLED"}>
          {rank.isActive ? "Active" : "Hidden"}
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
    cell: (rank: Rank) => (
      <RankActions
        rank={rank}
        onEdit={onEdit}
        onOpenNotifications={onOpenNotifications}
        refetch={refetch}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface RanksTableListProps {
  ranks: Rank[];
  onEdit: (rank: Rank) => void;
  onOpenNotifications: (rank: Rank) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function RanksTableList({
  ranks,
  onEdit,
  onOpenNotifications,
  onMoveUp,
  onMoveDown,
  refetch,
  visibleColumns,
  offset = 0,
}: RanksTableListProps) {
  const [toggleRank, { loading: toggling }] = useToggleRank({
    onCompleted: () => {
      refetch?.();
      toast.success("Rank status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggle = async (id: string) => {
    await toggleRank({ variables: { id } });
  };

  const sortedRanks = React.useMemo(
    () => [...ranks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [ranks],
  );

  const baseColumns = React.useMemo(
    () =>
      getRankTableColumns(
        sortedRanks,
        onEdit,
        onOpenNotifications,
        onMoveUp,
        onMoveDown,
        handleToggle,
        toggling,
        refetch,
      ),
    [sortedRanks, onEdit, onOpenNotifications, onMoveUp, onMoveDown, toggling, refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<Rank>
        columns={activeColumns}
        data={sortedRanks}
        keyExtractor={(r) => r.id}
        emptyTitle="No levels defined"
        emptyDescription="Create community ranks to provide clear progression paths for your members."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default RanksTableList;
