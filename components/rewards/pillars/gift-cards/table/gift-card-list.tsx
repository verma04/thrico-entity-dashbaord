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
  Gift,
  ShoppingBag,
  MoreVertical,
  Zap,
  ShieldCheck,
  Edit,
  Trash2,
  Copy,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GiftCardRuleItem } from "../types";
import { safeFormat } from "@/lib/date-utils";
import { toast } from "sonner";

export const getGiftCardTableColumns = (
  onEdit?: (reward: GiftCardRuleItem) => void,
  onDelete?: (rewardId: string) => void
): AdminTableColumn<GiftCardRuleItem>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "offer",
    header: "Brand & Reward Offer",
    cell: (reward) => (
      <AdminTableItem
        icon={<Gift className="h-4 w-4 text-violet-600" />}
        title={reward.title}
        subtitle={`${reward.brand} • ${reward.category}`}
      />
    ),
  },
  {
    key: "denomination",
    header: "Card Value",
    cell: (reward) => (
      <span className="font-bold text-xs text-foreground font-mono">
        ₹{reward.denomination}
      </span>
    ),
  },
  {
    key: "cost",
    header: "Cost Per Win",
    cell: (reward) => (
      <div className="text-xs font-mono">
        <span className="font-bold text-foreground">₹{reward.totalCostPerWin}</span>
        <span className="text-[10px] text-muted-foreground ml-1">
          (₹{reward.denomination} + ₹{reward.serviceFee} fee)
        </span>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    cell: (reward) => (
      <AdminTableTag variant="purple">
        {reward.category}
      </AdminTableTag>
    ),
  },
  {
    key: "issued",
    header: "Total Issued",
    cell: (reward) => (
      <span className="text-xs font-mono font-semibold text-foreground">
        {reward.totalIssued} winners
      </span>
    ),
  },
  {
    key: "validity",
    header: "Validity",
    cell: (reward) => (
      <span className="text-xs text-muted-foreground">
        {reward.validityMonths} Months
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
          {onEdit && (
            <DropdownMenuItem
              onClick={() => onEdit(reward)}
              className="text-xs gap-2 cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Offer Config
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {onDelete && (
            <DropdownMenuItem
              onClick={() => onDelete(reward.id)}
              className="text-xs gap-2 text-red-600 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Offer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface GiftCardListProps {
  rewards: GiftCardRuleItem[];
  loading?: boolean;
  visibleColumns?: Record<string, boolean>;
  onEdit?: (reward: GiftCardRuleItem) => void;
  onDelete?: (rewardId: string) => void;
}

export function GiftCardList({
  rewards,
  loading = false,
  visibleColumns,
  onEdit,
  onDelete,
}: GiftCardListProps) {
  const allColumns = React.useMemo(
    () => getGiftCardTableColumns(onEdit, onDelete),
    [onEdit, onDelete]
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
        emptyTitle="No Digital Gift Card Offers Found"
        emptyDescription="Configure brand gift cards to incentivize minigame players."
      />
    </div>
  );
}
