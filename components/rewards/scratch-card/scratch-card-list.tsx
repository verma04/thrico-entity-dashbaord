"use client";

import React from "react";
import {
  RectangleHorizontal,
  Coins,
  Ticket,
  Gift,
  ShoppingBag,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { ScratchCardActions } from "./scratch-card-actions";
import {
  ScratchRewardTier,
  REWARD_BADGE,
  REWARD_ICON,
  REWARD_LABELS,
} from "./types";
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

export const getScratchCardTableColumns = (
  onEdit: (tier: ScratchRewardTier) => void,
  onDelete: (id: string) => void,
  onToggleActive: (id: string, isActive: boolean) => Promise<void>,
  currencyName: string = "Points",
): AdminTableColumn<ScratchRewardTier>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "tier",
    header: "Reward Prize",
    cell: (tier) => {
      const getIcon = () => {
        switch (tier.rewardType) {
          case "COINS":
            return <Coins className="h-4 w-4 text-amber-500" />;
          case "GIFT_CARD":
            return <Gift className="h-4 w-4 text-purple-500" />;
          case "ECOMMERCE":
            return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
          case "INTERNAL_VOUCHER":
          case "VOUCHER":
            return <Ticket className="h-4 w-4 text-blue-500" />;
          case "NO_REWARDS":
          default:
            return <RotateCcw className="h-4 w-4 text-muted-foreground" />;
        }
      };

      const subtitle =
        tier.tryAgainMessage ||
        (tier.storeDiscountRule?.title
          ? `Rule: ${tier.storeDiscountRule.title}`
          : tier.manualBatch?.name
            ? `Batch: ${tier.manualBatch.name}`
            : tier.digitalCardRule?.title
              ? `Card: ${tier.digitalCardRule.title}`
              : `ID: ${tier.id.slice(0, 8)}...`);

      return (
        <AdminTableItem
          icon={getIcon()}
          title={tier.label}
          subtitle={subtitle}
          onClick={() => onEdit(tier)}
        />
      );
    },
  },
  {
    key: "rewardType",
    header: "Reward Type",
    cell: (tier) => {
      const getTagVariant = () => {
        switch (tier.rewardType) {
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
            {REWARD_ICON[tier.rewardType] || <Sparkles className="h-3 w-3 shrink-0" />}
            <span>{REWARD_LABELS[tier.rewardType] || tier.rewardType}</span>
          </span>
        </AdminTableTag>
      );
    },
  },
  {
    key: "value",
    header: "Prize Value",
    cell: (tier) => {
      if (tier.rewardType === "COINS") {
        return (
          <AdminTableMetric
            value={tier.rewardValue?.toLocaleString() || "0"}
            unit={currencyName.toUpperCase()}
            variant="amber"
          />
        );
      }
      if (tier.rewardType === "GIFT_CARD") {
        return (
          <AdminTableMetric
            value={`₹${tier.rewardValue || tier.giftCardDenomination || 100}`}
            variant="indigo"
          />
        );
      }
      if (tier.rewardType === "ECOMMERCE") {
        return (
          <AdminTableMetric
            value={`${tier.rewardValue || tier.ecommerceDiscountValue || 20}% OFF`}
            variant="emerald"
          />
        );
      }
      if (tier.rewardType === "INTERNAL_VOUCHER" || tier.rewardType === "VOUCHER") {
        return (
          <AdminTableMetric
            value={tier.reward?.title || "Voucher"}
            variant="default"
          />
        );
      }
      return <span className="text-xs text-muted-foreground font-mono">—</span>;
    },
  },
  {
    key: "eligibility",
    header: "Eligibility & Rules",
    cell: (tier) => {
      const eligibility =
        tier.eligibility?.memberEligibility || "ALL";

      const hasGate = tier.minAccountAge > 0 || tier.minActivity > 0;

      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <AdminTableTag variant={eligibility === "ALL" ? "default" : "purple"}>
            {eligibility.replace(/_/g, " ")}
          </AdminTableTag>
          {tier.minAccountAge > 0 && (
            <span className="text-[10px] text-muted-foreground font-medium">
              &gt;{tier.minAccountAge}d
            </span>
          )}
          {tier.minActivity > 0 && (
            <span className="text-[10px] text-muted-foreground font-medium">
              &gt;{tier.minActivity}act
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    cell: (tier) => {
      const isActive = tier.isActive !== false;
      return (
        <div className="flex items-center gap-2">
          <AdminStatusBadge status={isActive ? "APPROVED" : "DISABLED"}>
            {isActive ? "Active" : "Inactive"}
          </AdminStatusBadge>
          <Switch
            checked={isActive}
            onCheckedChange={(v) => onToggleActive(tier.id, v)}
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
    cell: (tier) => (
      <ScratchCardActions
        tier={tier}
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

export interface ScratchCardListProps {
  tiers: ScratchRewardTier[];
  currencyName?: string;
  onEdit: (tier: ScratchRewardTier) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ScratchCardList({
  tiers,
  currencyName = "Points",
  onEdit,
  onDelete,
  onToggleActive,
  visibleColumns,
  offset = 0,
}: ScratchCardListProps) {
  const baseColumns = React.useMemo(
    () =>
      getScratchCardTableColumns(
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
      <AdminTable<ScratchRewardTier>
        columns={activeColumns}
        data={tiers}
        keyExtractor={(t) => t.id}
        emptyIcon={RectangleHorizontal}
        emptyTitle="No scratch card tiers configured"
        emptyDescription="Define your first scratch card reward tier to configure point amounts, vouchers, and member odds."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ScratchCardList;
