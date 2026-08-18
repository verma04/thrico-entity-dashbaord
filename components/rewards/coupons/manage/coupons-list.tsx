"use client";

import React from "react";
import { Ticket, Coins, Package } from "lucide-react";
import { CouponActions } from "./coupon-actions";
import { getMechanismBadge } from "../utils";
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

export const getRewardTableColumns = (
  onOpenUploadForReward: (rewardId: string) => void,
  onManageVouchers: (rewardId: string) => void,
): AdminTableColumn<any>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "reward",
    header: "Reward Offer",
    cell: (reward) => {
      const coverUrl = reward.image
        ? reward.image.startsWith("http")
          ? reward.image
          : `https://cdn.thrico.network/${reward.image}`
        : "";

      return (
        <AdminTableItem
          avatar={coverUrl}
          icon={
            !coverUrl ? (
              <Ticket className="h-4 w-4 text-muted-foreground" />
            ) : undefined
          }
          title={reward.title}
          subtitle={reward.description || `ID: ${reward.id.slice(0, 8)}...`}
        />
      );
    },
  },
  {
    key: "mechanism",
    header: "Mechanism",
    cell: (reward) => {
      const mechanisms = Array.isArray(reward.rewardMechanism)
        ? reward.rewardMechanism
        : [reward.rewardMechanism || "COUPON"];
      const primaryMech = getMechanismBadge(mechanisms[0] || "COUPON");
      return (
        <AdminTableTag variant="indigo">
          {primaryMech.label}
        </AdminTableTag>
      );
    },
  },
  {
    key: "cost",
    header: "Point Cost",
    cell: (reward) => (
      <AdminTableMetric
        value={reward.tcCost?.toLocaleString() || "0"}
        unit="PTS"
        variant="mono"
      />
    ),
  },
  {
    key: "inventory",
    header: "Inventory",
    cell: (reward) => (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Package className="h-3 w-3 text-muted-foreground/70" />
        <span>
          {reward.inventoryRequired
            ? `${reward.inventoryCount ?? 0} available`
            : "Unlimited"}
        </span>
      </div>
    ),
  },
  {
    key: "redeemed",
    header: "Redeemed",
    cell: (reward) => (
      <span className="font-mono font-semibold text-foreground text-xs">
        {reward.redeemedCount ?? 0}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (reward) => (
      <AdminStatusBadge status={reward.isActive ? "APPROVED" : "DISABLED"}>
        {reward.isActive ? "Active" : "Inactive"}
      </AdminStatusBadge>
    ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (reward) => (
      <CouponActions
        reward={reward}
        onOpenUploadForReward={onOpenUploadForReward}
        onManageVouchers={onManageVouchers}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface CouponsListProps {
  rewards: any[];
  onOpenUploadForReward: (rewardId: string) => void;
  onManageVouchers: (rewardId: string) => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function CouponsList({
  rewards,
  onOpenUploadForReward,
  onManageVouchers,
  visibleColumns,
  offset = 0,
}: CouponsListProps) {
  const baseColumns = React.useMemo(
    () => getRewardTableColumns(onOpenUploadForReward, onManageVouchers),
    [onOpenUploadForReward, onManageVouchers],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<any>
        columns={activeColumns}
        data={rewards}
        keyExtractor={(r) => r.id}
        emptyTitle="No rewards in collection"
        emptyDescription="Define your first master reward offer or coupon to begin the redemption lifecycle for your members."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default CouponsList;
