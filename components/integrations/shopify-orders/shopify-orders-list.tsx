"use client";

import React from "react";
import { ShoppingCart, Gift } from "lucide-react";
import { ShopifyOrderActions } from "./shopify-order-actions";
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

export const getShopifyOrderTableColumns = (
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
    key: "order",
    header: "Order",
    cell: (row) => (
      <AdminTableItem
        icon={ShoppingCart}
        title={`Order #${row.shopifyOrderId}`}
        subtitle={`ID: ${row.id}`}
      />
    ),
  },
  {
    key: "customer",
    header: "Customer",
    cell: (row) => {
      const user = row.user;
      const displayName = user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Unknown User"
        : row.userId || "—";
      const email = user?.email;
      const initials = displayName
        ? displayName.substring(0, 2).toUpperCase()
        : "U";

      return (
        <AdminTableItem
          avatar={user?.avatar || undefined}
          title={displayName}
          subtitle={email || (row.userId ? `ID: ${row.userId}` : undefined)}
          fallbackText={initials}
        />
      );
    },
  },
  {
    key: "totalPrice",
    header: "Total",
    cell: (row) => (
      <AdminTableMetric
        value={
          row.totalPrice != null
            ? `${Number(row.totalPrice).toFixed(2)} ${row.currency || ""}`
            : "—"
        }
        variant="mono"
      />
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <AdminStatusBadge status={row.status || "PENDING"}>
        {row.status || "Pending"}
      </AdminStatusBadge>
    ),
  },
  {
    key: "reward",
    header: "Reward",
    cell: (row) => {
      const points = row.reward?.pointsEarned;
      if (points != null && points > 0) {
        return (
          <AdminTableMetric
            icon={Gift}
            value={`+${points}`}
            unit="PTS"
            variant="emerald"
          />
        );
      }
      return <span className="text-muted-foreground text-[11px]">—</span>;
    },
  },
  {
    key: "createdAt",
    header: "Created Date",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => <ShopifyOrderActions order={row} refetch={refetch} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ShopifyOrdersListProps {
  orders: any[];
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ShopifyOrdersList({
  orders,
  refetch,
  visibleColumns,
  offset = 0,
}: ShopifyOrdersListProps) {
  const baseColumns = React.useMemo(
    () => getShopifyOrderTableColumns(refetch),
    [refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<any>
        columns={activeColumns}
        data={orders}
        keyExtractor={(o) => o.id || o.shopifyOrderId}
        emptyIcon={ShoppingCart}
        emptyTitle="No Shopify orders found"
        emptyDescription="No orders synced from your store yet. Click 'Sync Orders' to fetch latest orders."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ShopifyOrdersList;
