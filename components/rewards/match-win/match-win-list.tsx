"use client";

import React from "react";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import {
  Sparkles,
  Infinity as InfinityIcon,
  Layers,
} from "lucide-react";
import { MatchWinCombination, REWARD_LABELS, REWARD_ICON } from "./types";
import { MatchWinActions } from "./match-win-actions";

export interface MatchWinListProps {
  combinations: MatchWinCombination[];
  currencyName?: string;
  onEdit?: (combination: MatchWinCombination) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export const getMatchWinTableColumns = (
  onEdit: ((combination: MatchWinCombination) => void) | undefined,
  onDelete: (id: string) => void,
  currencyName: string = "Points",
): AdminTableColumn<MatchWinCombination>[] => [
  {
    key: "serial",
    header: "#",
    cell: (_, index) => (
      <span className="text-xs font-mono font-bold text-muted-foreground">
        {(index ?? 0) + 1}
      </span>
    ),
  },
  {
    key: "combination",
    header: "Reel Pattern & Identifier",
    cell: (combination) => {
      const symbols = [
        combination.symbol1,
        combination.symbol2,
        combination.symbol3,
      ].filter(Boolean);

      const ReelIcon = (
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60">
          {symbols.length > 0 ? (
            symbols.map((sym, idx) => (
              <span
                key={idx}
                className="h-5 w-5 rounded bg-background border border-border/80 flex items-center justify-center text-xs shadow-2xs"
                title={sym?.label}
              >
                {sym?.icon || "❓"}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-mono px-1 text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" /> Loss
            </span>
          )}
        </div>
      );

      const subtitle = `Key: ${combination.key}`;

      return (
        <AdminTableItem
          icon={ReelIcon}
          title={combination.key}
          subtitle={subtitle}
          onClick={onEdit ? () => onEdit(combination) : undefined}
        />
      );
    },
  },
  {
    key: "rewardType",
    header: "Reward Type",
    cell: (combination) => {
      const getTagVariant = () => {
        switch (combination.type) {
          case "COINS":
          case "TC":
            return "amber" as const;
          case "GIFT_CARD":
            return "purple" as const;
          case "ECOMMERCE":
            return "emerald" as const;
          case "INTERNAL_VOUCHER":
          case "VOUCHER":
            return "indigo" as const;
          case "NO_REWARDS":
          case "NOTHING":
          default:
            return "muted" as const;
        }
      };

      return (
        <AdminTableTag variant={getTagVariant()}>
          <span className="inline-flex items-center gap-1">
            {REWARD_ICON[combination.type] || <Sparkles className="h-3 w-3 shrink-0" />}
            <span>{REWARD_LABELS[combination.type] || combination.type}</span>
          </span>
        </AdminTableTag>
      );
    },
  },
  {
    key: "value",
    header: "Prize Value",
    cell: (combination) => {
      if (combination.type === "COINS" || combination.type === "TC") {
        return (
          <AdminTableMetric
            value={combination.value?.toLocaleString() || "0"}
            unit={currencyName.toUpperCase()}
            variant="amber"
          />
        );
      }
      if (combination.type === "GIFT_CARD") {
        return (
          <AdminTableMetric
            value={`₹${combination.value || combination.giftCardDenomination || combination.digitalCardRule?.faceValue || 100}`}
            variant="indigo"
          />
        );
      }
      if (combination.type === "ECOMMERCE") {
        return (
          <AdminTableMetric
            value={`${combination.value || combination.ecommerceDiscountValue || combination.storeDiscountRule?.discountValue || 20}% OFF`}
            variant="emerald"
          />
        );
      }
      if (combination.type === "INTERNAL_VOUCHER" || combination.type === "VOUCHER") {
        return (
          <AdminTableMetric
            value={
              combination.manualBatch?.name ||
              combination.storeDiscountRule?.title ||
              combination.digitalCardRule?.title ||
              "Voucher"
            }
            variant="default"
          />
        );
      }
      return <span className="text-xs text-muted-foreground font-mono">Try Again</span>;
    },
  },
  {
    key: "probability",
    header: "Win Probability",
    cell: (combination) => {
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(combination.probability, 100)}%`,
                backgroundColor: combination.symbol1?.color || "#4F46E5",
              }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-foreground">
            {combination.probability}%
          </span>
        </div>
      );
    },
  },
  {
    key: "maxWins",
    header: "Lifetime Cap",
    cell: (combination) => {
      if (!combination.maxWins) {
        return (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <InfinityIcon className="h-3 w-3" /> Unlimited
          </span>
        );
      }
      return (
        <AdminTableTag variant="sky">
          <span>Max {combination.maxWins} wins</span>
        </AdminTableTag>
      );
    },
  },
  {
    key: "actions",
    header: "Actions",
    cell: (combination) => (
      <div className="flex items-center justify-end">
        <MatchWinActions
          combination={combination}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    ),
  },
];

export function MatchWinList({
  combinations,
  currencyName = "Points",
  onEdit,
  onDelete,
  isLoading = false,
  visibleColumns,
  offset = 0,
}: MatchWinListProps) {
  const baseColumns = React.useMemo(
    () => getMatchWinTableColumns(onEdit, onDelete, currencyName),
    [onEdit, onDelete, currencyName],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<MatchWinCombination>
        columns={activeColumns}
        data={combinations}
        keyExtractor={(c) => c.id || c.key}
        emptyIcon={Sparkles}
        emptyTitle="No winning combinations configured"
        emptyDescription="Define your first 3-reel matching combination to configure prizes, odds, and budget caps."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default MatchWinList;
