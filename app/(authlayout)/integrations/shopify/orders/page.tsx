"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  ShoppingCart,
  RefreshCw,
  Calendar,
  DollarSign,
  Gift,
  Upload,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "0"
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const page = Number(searchParams.get("page") || "1");
  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  const statusFilter = searchParams.get("status") || "ALL";

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  // Sync debounced search to URL
  React.useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const [showExportModal, setShowExportModal] = useState(false);
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
    return orders.filter((order: ShopifyOrder) => {
      const q = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.shopifyOrderId?.toLowerCase().includes(q) ||
        order.userId?.toLowerCase().includes(q) ||
        order.status?.toLowerCase().includes(q) ||
        order.user?.firstName?.toLowerCase().includes(q) ||
        order.user?.lastName?.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [rawOrders, debouncedSearch, statusFilter]);

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

          {/* Primary filters & actions */}
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item>
              <Select
                value={statusFilter}
                onValueChange={(v) => updateParams({ status: v, page: null })}
              >
                <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
                  <SelectItem
                    value="ALL"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    All Statuses
                  </SelectItem>
                  <SelectItem
                    value="PAID"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    Paid
                  </SelectItem>
                  <SelectItem
                    value="PENDING"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    Pending
                  </SelectItem>
                  <SelectItem
                    value="REFUNDED"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    Refunded
                  </SelectItem>
                  <SelectItem
                    value="CANCELLED"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>

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

            <EcosystemActionBar.Item>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(true)}
                className="h-8 px-2.5 rounded-md text-[11px] font-medium gap-1.5 bg-card border-border shadow-2xs text-foreground"
              >
                <Upload className="h-3.5 w-3.5" />
                Export
              </Button>
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            <EcosystemActionBar.Status active={filteredOrders.length > 0}>
              Showing {filteredOrders.length} of {totalCount} Orders
            </EcosystemActionBar.Status>
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

        <ExportCsvModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          entityName="Shopify orders"
          description="Export synchronized Shopify customer purchases and gamification reward logs as CSV."
          totalCount={totalCount}
          matchingCount={
            debouncedSearch.trim() || statusFilter !== "ALL"
              ? filteredOrders.length
              : undefined
          }
          onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
            const rows = filteredOrders;
            if (rows.length === 0) {
              toast.error("Nothing to export", { description: "No Shopify orders found." });
              return;
            }
            const csv = buildCsv(rows, [
              { header: "Shopify Order ID", getValue: (o: any) => o.shopifyOrderId || "" },
              { header: "Customer Name", getValue: (o: any) => o.user ? `${o.user.firstName || ""} ${o.user.lastName || ""}`.trim() : "" },
              { header: "Customer Email", getValue: (o: any) => o.user?.email || "" },
              { header: "Total Price", getValue: (o: any) => o.totalPrice || "" },
              { header: "Currency", getValue: (o: any) => o.currency || "USD" },
              { header: "Status", getValue: (o: any) => o.status || "COMPLETED" },
              { header: "Points Earned", getValue: (o: any) => o.reward?.pointsEarned ?? 0 },
              { header: "Order Date", getValue: (o: any) => o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "" },
            ]);
            downloadCsv(csv, `shopify-orders-${new Date().toISOString().slice(0, 10)}`, format);
            toast.success("Export ready", { description: `${rows.length} order${rows.length !== 1 ? "s" : ""} exported.` });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
