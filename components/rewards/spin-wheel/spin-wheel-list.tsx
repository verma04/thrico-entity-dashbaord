"use client";

import React from "react";
import {
  Dices,
  Coins,
  Ticket,
  Gift,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Percent,
} from "lucide-react";
import { SpinWheelActions } from "./spin-wheel-actions";
import { WheelSegment } from "./types";
import {
  REWARD_BADGE,
  REWARD_ICON,
  REWARD_LABELS,
} from "./constants";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { Switch } from "@/components/ui/switch";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getSpinWheelTableColumns = (
  onEdit: (segment: WheelSegment) => void,
  onDelete: (id: string) => void,
  onToggleActive: (id: string, isActive: boolean) => Promise<void>,
  currencyName: string = "Points",
): AdminTableColumn<WheelSegment>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "segment",
    header: "Wheel Segment",
    cell: (segment) => {
      const ColorIcon = (
        <div
          className="h-5 w-5 rounded-full border border-white/40 shadow-xs flex items-center justify-center shrink-0"
          style={{ backgroundColor: segment.color || "#4F46E5" }}
        >
          <span className="text-[9px] font-bold text-white font-mono">
            {segment.sortOrder || 1}
          </span>
        </div>
      );

      const subtitle =
        segment.manualBatch?.name
          ? `Batch: ${segment.manualBatch.name}`
          : segment.storeDiscountRule?.title
            ? `Rule: ${segment.storeDiscountRule.title}`
            : segment.digitalCardRule?.title
              ? `Card: ${segment.digitalCardRule.title}`
              : `Sort Order: #${segment.sortOrder || 0}`;

      return (
        <AdminTableItem
          icon={ColorIcon}
          title={segment.label}
          subtitle={subtitle}
          onClick={() => onEdit(segment)}
        />
      );
    },
  },
  {
    key: "rewardType",
    header: "Reward Type",
    cell: (segment) => {
      const getTagVariant = () => {
        switch (segment.rewardType) {
          case "COINS":
            return "amber" as const;
          case "GIFT_CARD":
            return "purple" as const;
          case "ECOMMERCE":
            return "emerald" as const;
          case "INTERNAL_VOUCHER":
          case "VOUCHER":
            return "indigo" as const;
          case "NO_REWARDS":
          default:
            return "muted" as const;
        }
      };

      return (
        <AdminTableTag variant={getTagVariant()}>
          <span className="inline-flex items-center gap-1">
            {REWARD_ICON[segment.rewardType] || <Sparkles className="h-3 w-3 shrink-0" />}
            <span>{REWARD_LABELS[segment.rewardType] || segment.rewardType}</span>
          </span>
        </AdminTableTag>
      );
    },
  },
  {
    key: "value",
    header: "Prize Value",
    cell: (segment) => {
      if (segment.rewardType === "COINS") {
        return (
          <AdminTableMetric
            value={segment.rewardValue?.toLocaleString() || "0"}
            unit={currencyName.toUpperCase()}
            variant="amber"
          />
        );
      }
      if (segment.rewardType === "GIFT_CARD") {
        return (
          <AdminTableMetric
            value={`₹${segment.rewardValue || segment.giftCardDenomination || segment.digitalCardRule?.faceValue || 100}`}
            variant="indigo"
          />
        );
      }
      if (segment.rewardType === "ECOMMERCE") {
        return (
          <AdminTableMetric
            value={`${segment.rewardValue || segment.ecommerceDiscountValue || segment.storeDiscountRule?.discountValue || 20}% OFF`}
            variant="emerald"
          />
        );
      }
      if (segment.rewardType === "INTERNAL_VOUCHER" || segment.rewardType === "VOUCHER") {
        return (
          <AdminTableMetric
            value={
              segment.manualBatch?.name ||
              segment.storeDiscountRule?.title ||
              segment.digitalCardRule?.title ||
              "Voucher"
            }
            variant="default"
          />
        );
      }
      return <span className="text-xs text-muted-foreground font-mono">—</span>;
    },
  },
  {
    key: "probability",
    header: "Win Probability",
    cell: (segment) => {
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(segment.probability, 100)}%`,
                backgroundColor: segment.color || "#4F46E5",
              }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-foreground">
            {segment.probability}%
          </span>
        </div>
      );
    },
  },
  {
    key: "color",
    header: "Slice Color",
    cell: (segment) => (
      <div className="flex items-center gap-1.5">
        <span
          className="h-3.5 w-3.5 rounded-full border border-border shadow-2xs shrink-0"
          style={{ backgroundColor: segment.color || "#4F46E5" }}
        />
        <span className="font-mono text-[11px] text-muted-foreground uppercase">
          {segment.color || "#4F46E5"}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (segment) => {
      return (
        <div className="flex items-center gap-2">
          <AdminStatusBadge status={segment.isActive ? "APPROVED" : "DISABLED"}>
            {segment.isActive ? "Active" : "Inactive"}
          </AdminStatusBadge>
          <Switch
            checked={segment.isActive}
            onCheckedChange={(v) => onToggleActive(segment.id, v)}
            className="scale-75 data-[state=checked]:bg-emerald-600"
          />
        </div>
      );
    },
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (segment) => (
      <SpinWheelActions
        segment={segment}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface SpinWheelListProps {
  segments: WheelSegment[];
  currencyName?: string;
  onEdit: (segment: WheelSegment) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function SpinWheelList({
  segments,
  currencyName = "Points",
  onEdit,
  onDelete,
  onToggleActive,
  visibleColumns,
  offset = 0,
}: SpinWheelListProps) {
  const baseColumns = React.useMemo(
    () =>
      getSpinWheelTableColumns(
        onEdit,
        onDelete,
        onToggleActive,
        currencyName,
      ),
    [onEdit, onDelete, onToggleActive, currencyName],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<WheelSegment>
        columns={activeColumns}
        data={segments}
        keyExtractor={(s) => s.id}
        emptyIcon={Dices}
        emptyTitle="No wheel segments configured"
        emptyDescription="Define your first wheel segment to configure slice point values, vouchers, and winning probability."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default SpinWheelList;
