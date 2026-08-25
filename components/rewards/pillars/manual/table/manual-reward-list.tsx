"use client";

import React from "react";
import {
  Ticket,
  Coins,
  Layers,
  Users,
  Package,
  Copy,
  Check,
  MoreVertical,
  Zap,
  Edit,
} from "lucide-react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
} from "@/components/shared/admin-table/admin-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { safeFormat } from "@/lib/date-utils";
import { ManualRewardItem } from "./manual-reward-card";
import { ManualCouponType } from "@/graphql/actions/rewards/manual";

export const getManualRewardTableColumns = (
  currencyName?: string,
  onSimulateWin?: (reward: ManualRewardItem) => void,
  onManagePool?: (reward: ManualRewardItem) => void,
  onEdit?: (reward: ManualRewardItem) => void
): AdminTableColumn<ManualRewardItem>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "reward",
    header: "Voucher Offer",
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
              <Ticket className="h-4 w-4 text-emerald-600" />
            ) : undefined
          }
          title={reward.title}
          subtitle={reward.description || `ID: ${reward.id.slice(0, 8)}...`}
        />
      );
    },
  },
  {
    key: "architecture",
    header: "Architecture",
    cell: (reward) => {
      const isOneToOne =
        reward.couponType === ManualCouponType.ONE_TO_ONE ||
        reward.couponType === "ONE_TO_ONE";

      return (
        <AdminTableTag variant={isOneToOne ? "emerald" : "sky"}>
          {isOneToOne ? "1:1 Serial Pool" : "1:N Shared Promo"}
        </AdminTableTag>
      );
    },
  },
  {
    key: "code",
    header: "Code / Template",
    cell: (reward) => {
      const isOneToOne =
        reward.couponType === ManualCouponType.ONE_TO_ONE ||
        reward.couponType === "ONE_TO_ONE";
      const displayCode = isOneToOne
        ? `${reward.codePrefix || "VCH"}-XXXXX`
        : reward.couponCode || "PROMO";

      return (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
          <span>{displayCode}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(displayCode);
              toast.success(`Copied "${displayCode}" to clipboard!`);
            }}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Copy"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      );
    },
  },
  {
    key: "inventory",
    header: "Pool Capacity",
    cell: (reward) => {
      const isOneToOne =
        reward.couponType === ManualCouponType.ONE_TO_ONE ||
        reward.couponType === "ONE_TO_ONE";
      const total = reward.totalInventory || 50;
      const remaining =
        reward.remainingCount ??
        Math.max(0, total - (reward.redeemedCount || 0));

      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Package className="h-3 w-3 text-muted-foreground/70" />
          <span>
            {isOneToOne ? `${remaining} / ${total} available` : "Shared Global"}
          </span>
        </div>
      );
    },
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
    key: "validity",
    header: "Validity",
    cell: (reward) => (
      <span className="text-xs text-muted-foreground">
        {reward.validityDays ? `${reward.validityDays} Days` : "No Expiry"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (reward) => (
      <AdminStatusBadge status={reward.isActive ? "APPROVED" : "DISABLED"}>
        {reward.isActive ? "Active" : "Draft"}
      </AdminStatusBadge>
    ),
  },
  {
    key: "created",
    header: "Created",
    cell: (reward) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {safeFormat(reward.createdAt, "dd MMM yyyy", "Recently")}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "w-14 text-center",
    className: "text-center",
    isFixedRight: true,
    cell: (reward) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md cursor-pointer">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => {
              const isOneToOne =
                reward.couponType === ManualCouponType.ONE_TO_ONE ||
                reward.couponType === "ONE_TO_ONE";
              const code = isOneToOne
                ? `${reward.codePrefix || "VCH"}-XXXXX`
                : reward.couponCode || "PROMO";
              navigator.clipboard.writeText(code);
              toast.success(`Copied "${code}"`);
            }}
            className="text-xs gap-2"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Code
          </DropdownMenuItem>
          {onSimulateWin && (
            <DropdownMenuItem
              onClick={() => onSimulateWin(reward)}
              className="text-xs gap-2 text-emerald-600 font-medium cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" />
              Simulate Voucher Claim
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem
              onClick={() => onEdit(reward)}
              className="text-xs gap-2 cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Campaign Config
            </DropdownMenuItem>
          )}
          {onManagePool && (
            <DropdownMenuItem
              onClick={() => onManagePool(reward)}
              className="text-xs gap-2 cursor-pointer"
            >
              <Package className="h-3.5 w-3.5" />
              Inspect Voucher Pool
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface ManualRewardListProps {
  rewards: ManualRewardItem[];
  loading: boolean;
  currencyName?: string;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
  onSimulateWin?: (reward: ManualRewardItem) => void;
  onManagePool?: (reward: ManualRewardItem) => void;
  onEdit?: (reward: ManualRewardItem) => void;
  onCreateClick?: () => void;
}

export function ManualRewardList({
  rewards,
  loading,
  currencyName,
  visibleColumns,
  offset = 0,
  onSimulateWin,
  onManagePool,
  onEdit,
  onCreateClick,
}: ManualRewardListProps) {
  const allColumns = React.useMemo(
    () =>
      getManualRewardTableColumns(currencyName, onSimulateWin, onManagePool, onEdit),
    [currencyName, onSimulateWin, onManagePool, onEdit]
  );

  const columns = React.useMemo(() => {
    if (!visibleColumns) return allColumns;
    return allColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [allColumns, visibleColumns]);

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
      <AdminTable<ManualRewardItem>
        columns={columns}
        data={rewards}
        loading={loading}
        keyExtractor={(row) => row.id}
        emptyIcon={Ticket}
        emptyTitle="No Internal Vouchers Found"
        emptyDescription="No manual vouchers match your current filters or query."
        enableColumnToggle
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

