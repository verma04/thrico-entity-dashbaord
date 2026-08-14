"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  RefreshCw,
  Calendar,
  DollarSign,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetShopifyOrders, useSyncShopifyOrders } from "@/graphql/actions";
import { toast } from "sonner";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
  AdminTableMetric,
  AdminTableDate,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { safeFormat } from "@/lib/date-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ShopifyOrderUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatar?: string | null;
}

interface ShopifyOrderReward {
  pointsEarned?: number | null;
  pointHistoryIds?: string[] | null;
  awardedAt?: string | null;
}

interface ShopifyOrder {
  id: string;
  shopifyOrderId: string;
  userId?: string | null;
  user?: ShopifyOrderUser | null;
  totalPrice?: string | null;
  currency?: string | null;
  status: string;
  reward?: ShopifyOrderReward | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export default function ShopifyOrdersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, loading, refetch } = useGetShopifyOrders({
    input: { limit, offset },
  });
  const [syncOrders, { loading: syncing }] = useSyncShopifyOrders();

  const handleSync = async () => {
    try {
      await syncOrders();
      toast.success("Successfully synced Shopify orders");
      refetch();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to sync orders");
    }
  };

  const rawOrders = data?.getShopifyOrders?.data;
  const totalCount = data?.getShopifyOrders?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const filteredOrders = React.useMemo(() => {
    const orders = rawOrders || [];
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (order: ShopifyOrder) =>
        order.shopifyOrderId?.toLowerCase().includes(q) ||
        order.userId?.toLowerCase().includes(q) ||
        order.status?.toLowerCase().includes(q) ||
        order.user?.firstName?.toLowerCase().includes(q) ||
        order.user?.lastName?.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q)
    );
  }, [rawOrders, search]);

  const columns: AdminTableColumn<ShopifyOrder>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-10 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
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
        if (points != null) {
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
      cell: (row) => (
        <AdminTableDate date={row.createdAt} />
      ),
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      cell: (row) => (
        <AdminTableDate date={row.updatedAt} />
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemContainer>
        {/* Header */}
        <EcosystemHeader
          title="Shopify Orders"
          badgeText="Order Management"
          description={
            loading
              ? "Loading orders…"
              : `${totalCount} total synced orders from your Shopify store.`
          }
          icon={ShoppingCart}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "Shopify", href: "/integrations/shopify" },
            { label: "Orders" },
          ]}
        />

        {/* Action / Filter Bar */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search by order ID, customer, or status…"
              />
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
                className="h-8 px-3 rounded-md text-[11px] font-semibold gap-1.5 border-border"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
                />
                {syncing ? "Syncing…" : "Sync Orders"}
              </Button>
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Table Content */}
        <div className="mt-4">
          <AdminTable
            columns={columns}
            data={filteredOrders}
            loading={loading}
            size="sm"
            keyExtractor={(row) => row.id || row.shopifyOrderId}
            emptyIcon={ShoppingCart}
            emptyTitle="No Shopify orders found"
            emptyDescription="No orders synced from your store yet. Click 'Sync Orders' to fetch latest orders."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-end">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                isLoading={loading}
              />
            </div>
          )}
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
