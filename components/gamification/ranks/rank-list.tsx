"use client";

import React from "react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Pencil,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Bell,
  Mail,
  MoreHorizontal,
  Copy,
  Power,
} from "lucide-react";
import { Rank, useToggleRank } from "@/graphql/actions";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import { toast } from "sonner";
import { RankNotificationModal } from "./rank-notification-modal";

interface RankListProps {
  ranks: Rank[];
  onEdit: (rank: Rank) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  refetch: () => void;
  isLoading?: boolean;
}

export function RankList({
  ranks,
  onEdit,
  onMoveUp,
  onMoveDown,
  refetch,
  isLoading,
}: RankListProps) {
  const [notificationModalRank, setNotificationModalRank] =
    React.useState<Rank | null>(null);

  const [toggleRank, { loading: toggling }] = useToggleRank({
    onCompleted: () => {
      refetch();
      toast.success("Rank status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const sortedRanks = [...ranks].sort((a, b) => a.order - b.order);

  const handleToggle = async (id: string) => {
    await toggleRank({ variables: { id } });
  };

  const columns = [
    {
      key: "order",
      header: "Order",
      headerClassName: "w-[60px] text-center",
      className: "text-center",
      cell: (rank: Rank, index: number) => (
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
              index === sortedRanks.length - 1 &&
                "opacity-20 pointer-events-none",
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
                backgroundColor: `${rank.color}12`,
                borderColor: `${rank.color}25`,
              }}
            >
              <BadgeIcon icon={rank.icon} className="h-full w-full text-xs" imageClassName="rounded-md" />
            </div>
          }
          title={rank.name}
          badge={
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded border"
              style={{ color: rank.color, borderColor: `${rank.color}30`, backgroundColor: `${rank.color}10` }}
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
          <span>{rank?.minPoints?.toLocaleString()}</span>
          <span className="text-muted-foreground opacity-40">—</span>
          <span>{rank?.maxPoints?.toLocaleString()}</span>
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
      headerClassName: "w-12 text-right",
      className: "text-right",
      cell: (rank: Rank) => (
        <div className="flex justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Open actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-foreground border-b border-border/50 truncate">
                {rank.name}
              </div>
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => onEdit(rank)}
              >
                <Pencil className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Edit Rank</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => setNotificationModalRank(rank)}
              >
                <Bell className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Edit Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => handleToggle(rank.id)}
              >
                <Power
                  className={cn(
                    "h-3.5 w-3.5 mr-2",
                    rank.isActive ? "text-amber-500" : "text-emerald-500",
                  )}
                />
                <span>{rank.isActive ? "Disable Rank" : "Activate Rank"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-xs py-1.5"
                onClick={() => {
                  navigator.clipboard.writeText(rank.id);
                  toast.success("Rank ID copied to clipboard");
                }}
              >
                <Copy className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Copy Rank ID</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        columns={columns}
        data={sortedRanks || []}
        loading={isLoading}
        keyExtractor={(rank) => rank.id}
        emptyTitle="No levels defined"
        emptyDescription="Create community ranks to provide clear progression paths for your members."
        size="sm"
      />

      <RankNotificationModal
        rank={notificationModalRank}
        open={!!notificationModalRank}
        onOpenChange={(open) => !open && setNotificationModalRank(null)}
        onSuccess={() => {
          refetch();
        }}
      />
    </>
  );
}
