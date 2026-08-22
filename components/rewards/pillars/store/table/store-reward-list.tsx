"use client";

import React from "react";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import {
  ShoppingBag,
  MoreVertical,
  Zap,
  ShieldCheck,
  Tag,
  Percent,
  Truck,
  Sparkles,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StoreRewardItem, StoreDiscountType } from "../types";
import { safeFormat } from "@/lib/date-utils";
import { toast } from "sonner";

export const getStoreRewardTableColumns = (
  onSimulateWin?: (reward: StoreRewardItem) => void,
  onEdit?: (reward: StoreRewardItem) => void,
  onDelete?: (rewardId: string) => void
): AdminTableColumn<StoreRewardItem>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "offer",
    header: "Store Offer",
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
              <ShoppingBag className="h-4 w-4 text-indigo-600" />
            ) : undefined
          }
          title={reward.title}
          subtitle={reward.description || `Prefix: ${reward.codePrefix}`}
        />
      );
    },
  },
  {
    key: "discount",
    header: "Discount Value",
    cell: (reward) => {
      let label = `₹${reward.discountValue} OFF`;
      if (reward.discountType === StoreDiscountType.PERCENTAGE) {
        label = `${reward.discountValue}% OFF`;
      } else if (reward.discountType === StoreDiscountType.FREE_SHIPPING) {
        label = "Free Shipping";
      } else if (reward.discountType === StoreDiscountType.BUY_X_GET_Y) {
        label = "BOGO Special";
      }

      return (
        <span className="font-bold text-xs text-foreground font-mono">
          {label}
        </span>
      );
    },
  },
  {
    key: "mechanism",
    header: "Emission Rule",
    cell: () => (
      <AdminTableTag variant="sky">
        On-Demand Win
      </AdminTableTag>
    ),
  },
  {
    key: "minCart",
    header: "Min. Cart Spend",
    cell: (reward) => (
      <span className="text-xs text-muted-foreground">
        {reward.minCartSubtotal ? `₹${reward.minCartSubtotal}` : "No Minimum"}
      </span>
    ),
  },
  {
    key: "validity",
    header: "Validity",
    cell: (reward) => (
      <span className="text-xs text-muted-foreground">
        {reward.validityDays ? `${reward.validityDays} Days` : "30 Days"}
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
              const code = `${reward.codePrefix}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
              navigator.clipboard.writeText(code);
              toast.success(`Copied "${code}"`);
            }}
            className="text-xs gap-2 cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Code Sample
          </DropdownMenuItem>
          {onEdit && (
            <DropdownMenuItem
              onClick={() => onEdit(reward)}
              className="text-xs gap-2 cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Rule Config
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {onDelete && (
            <DropdownMenuItem
              onClick={() => onDelete(reward.id)}
              className="text-xs gap-2 text-red-600 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Rule
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface StoreRewardListProps {
  rewards: StoreRewardItem[];
  loading?: boolean;
  visibleColumns?: Record<string, boolean>;
  onSimulateWin?: (reward: StoreRewardItem) => void;
  onEdit?: (reward: StoreRewardItem) => void;
  onDelete?: (rewardId: string) => void;
}

export function StoreRewardList({
  rewards,
  loading = false,
  visibleColumns,
  onSimulateWin,
  onEdit,
  onDelete,
}: StoreRewardListProps) {
  const allColumns = React.useMemo(
    () => getStoreRewardTableColumns(onSimulateWin, onEdit, onDelete),
    [onSimulateWin, onEdit, onDelete]
  );

  const filteredColumns = React.useMemo(() => {
    if (!visibleColumns) return allColumns;
    return allColumns.filter((col) => {
      if (col.key === "serial" || col.key === "actions" || col.key === "offer") {
        return true;
      }
      return visibleColumns[col.key] !== false;
    });
  }, [allColumns, visibleColumns]);

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
      <AdminTable
        columns={filteredColumns}
        data={rewards}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyTitle="No Store Reward Rules Found"
        emptyDescription="Configure on-demand Shopify store discount rules to incentivize members."
      />
    </div>
  );
}
