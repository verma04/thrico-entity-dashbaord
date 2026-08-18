"use client";

import React from "react";
import { Tag, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShopifyCouponActions } from "./shopify-coupon-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableDate,
  AdminTableItem,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getShopifyCouponTableColumns = (
  shopDomain?: string,
  refetch?: () => void,
): AdminTableColumn<any>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "coupon",
    header: "Coupon",
    cell: (row) => (
      <AdminTableItem
        icon={Tag}
        title={row.title || row.code || "Untitled Coupon"}
        subtitle={row.summary || `ID: ${row.id}`}
        fallbackText={
          row.code
            ? row.code.substring(0, 2).toUpperCase()
            : row.title
            ? row.title.substring(0, 2).toUpperCase()
            : "CP"
        }
      />
    ),
  },
  {
    key: "code",
    header: "Code",
    cell: (row) => {
      if (row.isAutomatic) {
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-medium"
          >
            <Zap className="h-2.5 w-2.5 mr-1" />
            Automatic
          </Badge>
        );
      }

      const primaryCode = row.code || (row.codes && row.codes[0]);
      if (!primaryCode) {
        return <span className="text-[11px] text-muted-foreground">—</span>;
      }

      return (
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded border border-border/60">
            {primaryCode}
          </span>
          {row.codes && row.codes.length > 1 && (
            <span className="text-[10px] text-muted-foreground">
              +{row.codes.length - 1}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "discount",
    header: "Discount",
    cell: (row) => {
      let label = row.discountType || "—";
      if (row.discountType === "PERCENTAGE" && row.value != null) {
        label = `${row.value}% OFF`;
      } else if (row.discountType === "FIXED_AMOUNT" && row.value != null) {
        label = `${row.currency || "$"} ${Number(row.value).toFixed(2)} OFF`;
      } else if (row.discountType === "FREE_SHIPPING") {
        label = "Free Shipping";
      } else if (row.discountType === "BXGY") {
        label = "Buy X Get Y";
      }

      return (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-foreground">
            {label}
          </span>
          {row.minimumRequirement && (
            <span className="text-[10px] text-muted-foreground">
              {row.minimumRequirement.type === "SUBTOTAL" &&
              row.minimumRequirement.greaterThanOrEqualTo != null
                ? `Min. ${row.minimumRequirement.currency || "$"} ${Number(
                    row.minimumRequirement.greaterThanOrEqualTo,
                  ).toFixed(2)}`
                : row.minimumRequirement.type === "QUANTITY" &&
                  row.minimumRequirement.greaterThanOrEqualTo != null
                ? `Min. ${row.minimumRequirement.greaterThanOrEqualTo} items`
                : null}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge status={row.status || "ACTIVE"}>
        {row.status || "Active"}
      </AdminStatusBadge>
    ),
  },
  {
    key: "usage",
    header: "Usage",
    cell: (row) => (
      <AdminTableMetric
        value={
          row.usageLimit != null
            ? `${row.timesUsed || 0} / ${row.usageLimit}`
            : `${row.timesUsed || 0}`
        }
        unit={row.usageLimit == null ? "uses" : undefined}
        variant="mono"
      />
    ),
  },
  {
    key: "startsAt",
    header: "Starts At",
    cell: (row) => <AdminTableDate date={row.startsAt} />,
  },
  {
    key: "endsAt",
    header: "Expires At",
    cell: (row) =>
      row.endsAt ? (
        <AdminTableDate date={row.endsAt} />
      ) : (
        <span className="text-[11px] text-muted-foreground">No Expiry</span>
      ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => (
      <ShopifyCouponActions
        coupon={row}
        shopDomain={shopDomain}
        refetch={refetch}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ShopifyCouponsListProps {
  coupons: any[];
  shopDomain?: string;
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ShopifyCouponsList({
  coupons,
  shopDomain,
  refetch,
  visibleColumns,
  offset = 0,
}: ShopifyCouponsListProps) {
  const baseColumns = React.useMemo(
    () => getShopifyCouponTableColumns(shopDomain, refetch),
    [shopDomain, refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<any>
        columns={activeColumns}
        data={coupons}
        keyExtractor={(c) => c.id}
        emptyIcon={Tag}
        emptyTitle="No Shopify coupons found"
        emptyDescription="No coupons synced from your store yet. Click 'Refresh' to fetch latest items."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ShopifyCouponsList;
