"use client";

import React from "react";
import { Package } from "lucide-react";
import { ShopifyProductActions } from "./shopify-product-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableDate,
  AdminTableItem,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getShopifyProductTableColumns = (
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
    key: "product",
    header: "Product",
    cell: (row) => (
      <AdminTableItem
        icon={Package}
        title={row.title || "Untitled Product"}
        subtitle={`ID: ${row.shopifyProductId || row.id}`}
      />
    ),
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
    key: "createdAt",
    header: "Created Date",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "updatedAt",
    header: "Last Updated",
    cell: (row) => <AdminTableDate date={row.updatedAt} />,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => <ShopifyProductActions product={row} refetch={refetch} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ShopifyProductsListProps {
  products: any[];
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ShopifyProductsList({
  products,
  refetch,
  visibleColumns,
  offset = 0,
}: ShopifyProductsListProps) {
  const baseColumns = React.useMemo(
    () => getShopifyProductTableColumns(refetch),
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
        data={products}
        keyExtractor={(p) => p.id || p.shopifyProductId}
        emptyIcon={Package}
        emptyTitle="No Shopify products found"
        emptyDescription="No products synced from your store yet. Click 'Sync Products' to fetch latest items."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ShopifyProductsList;
