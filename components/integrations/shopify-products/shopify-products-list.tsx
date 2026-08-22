"use client";

import React from "react";
import { Package, ExternalLink } from "lucide-react";
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
    key: "product",
    header: "Product",
    cell: (row) => {
      const cleanId = (row.shopifyProductId || row.id || "").replace(/\D/g, "");
      const adminUrl =
        shopDomain && cleanId
          ? `https://${shopDomain}/admin/products/${cleanId}`
          : null;

      return (
        <div className="flex items-center gap-2">
          <AdminTableItem
            avatar={row.featuredImage || undefined}
            icon={Package}
            title={row.title || "Untitled Product"}
            subtitle={`ID: ${row.shopifyProductId || row.id}`}
          />
          {adminUrl && (
            <a
              href={adminUrl}
              target="_blank"
              rel="noreferrer"
              title="Open in Shopify Admin"
              className="text-muted-foreground/60 hover:text-foreground inline-flex items-center p-1 hover:bg-muted rounded"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
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
    key: "createdAt",
    header: "Created Date",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "updatedAt",
    header: "Last Synced / Updated",
    cell: (row) => <AdminTableDate date={row.updatedAt || row.createdAt} />,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => (
      <ShopifyProductActions
        product={row}
        shopDomain={shopDomain}
        refetch={refetch}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ShopifyProductsListProps {
  products: any[];
  shopDomain?: string;
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ShopifyProductsList({
  products,
  shopDomain,
  refetch,
  visibleColumns,
  offset = 0,
}: ShopifyProductsListProps) {
  const baseColumns = React.useMemo(
    () => getShopifyProductTableColumns(shopDomain, refetch),
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
