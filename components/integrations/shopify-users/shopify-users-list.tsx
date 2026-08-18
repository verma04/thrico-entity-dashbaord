"use client";

import React from "react";
import { Mail } from "lucide-react";
import { ShopifyUserActions } from "./shopify-user-actions";
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

export const getShopifyUserTableColumns = (
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
    key: "customer",
    header: "Customer",
    cell: (row) => (
      <AdminTableItem
        title={row.email || "Unknown Customer"}
        subtitle={`ID: ${row.shopifyCustomerId || row.id}`}
        fallbackText={
          row.email ? row.email.substring(0, 2).toUpperCase() : "SC"
        }
      />
    ),
  },
  {
    key: "contact",
    header: "Contact Email",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <Mail className="h-3 w-3 text-muted-foreground/60 shrink-0" />
        <span className="truncate max-w-[200px]">{row.email || "—"}</span>
      </div>
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
    header: "Customer Since",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "lastSyncedAt",
    header: "Last Synced",
    cell: (row) => <AdminTableDate date={row.lastSyncedAt} />,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => (
      <ShopifyUserActions
        customer={row}
        shopDomain={shopDomain}
        refetch={refetch}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ShopifyUsersListProps {
  customers: any[];
  shopDomain?: string;
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ShopifyUsersList({
  customers,
  shopDomain,
  refetch,
  visibleColumns,
  offset = 0,
}: ShopifyUsersListProps) {
  const baseColumns = React.useMemo(
    () => getShopifyUserTableColumns(shopDomain, refetch),
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
        data={customers}
        keyExtractor={(c) => c.id || c.shopifyCustomerId}
        emptyIcon={Mail}
        emptyTitle="No Shopify customers found"
        emptyDescription="No customers synced from your store yet. Click 'Sync Customers' to fetch latest items."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ShopifyUsersList;
