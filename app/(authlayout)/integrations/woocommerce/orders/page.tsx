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
import {
  useGetWooCommerceOrders,
  useSyncWooCommerceOrders,
} from "@/graphql/actions";
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

interface WooCommerceOrderUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  username?: string | null;
  avatar?: string | null;
}

interface WooCommerceOrderReward {
  pointsEarned?: number | null;
  pointHistoryIds?: string[] | null;
  awardedAt?: string | null;
}

interface WooCommerceOrder {
  id: string;
  wooOrderId: string;
  userId?: string | null;
  user?: WooCommerceOrderUser | null;
  totalPrice?: string | null;
  currency?: string | null;
  status: string;
  reward?: any;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export default function WooCommerceOrdersPage() {
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
    [searchParams, pathname, router]
  );

  const page = Number(searchParams.get("page") || "1");
  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  const statusFilter = searchParams.get("status") || "ALL";
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch] = useDebounce(search, 300);
  const [showExportModal, setShowExportModal] = useState(false);

  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, loading, refetch } = useGetWooCommerceOrders({
    input: { limit, offset },
  });
  const [syncOrders, { loading: syncing }] = useSyncWooCommerceOrders();

  const handleSync = async () => {
    try {
      await syncOrders();
      toast.success("Successfully synced WooCommerce orders");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to sync orders");
    }
  };

  const rawOrders: WooCommerceOrder[] =
    data?.getWooCommerceOrders?.data || [];
  const totalCount = data?.getWooCommerceOrders?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const filteredOrders = React.useMemo(() => {
    return rawOrders.filter((order) => {
      const matchesSearch =
        !debouncedSearch.trim() ||
        order.wooOrderId?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        order.user?.username?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        `${order.user?.firstName || ""} ${order.user?.lastName || ""}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [rawOrders, debouncedSearch, statusFilter]);

  const columns: AdminTableColumn<WooCommerceOrder>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-10 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
    },
    {
      key: "orderId",
      header: "Order",
      cell: (row) => (
        <AdminTableItem
          icon={ShoppingCart}
          title={`Order #${row.wooOrderId || row.id}`}
          subtitle={safeFormat(row.createdAt, "MMM d, yyyy • h:mm a", "—")}
        />
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (row) => {
        if (!row.user) {
          return (
            <span className="text-xs text-muted-foreground italic">Guest</span>
          );
        }
        const name =
          `${row.user.firstName || ""} ${row.user.lastName || ""}`.trim() ||
          "Customer";
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={row.user.avatar || undefined} />
              <AvatarFallback className="text-[10px] bg-[#7F54B3]/10 text-[#7F54B3]">
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground truncate">
                {name}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {row.user.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "totalPrice",
      header: "Total",
      cell: (row) => (
        <span className="text-xs font-semibold text-foreground font-mono">
          {row.currency || "$"}
          {row.totalPrice || "0.00"}
        </span>
      ),
    },
    {
      key: "reward",
      header: "Gamified Points",
      cell: (row) => {
        const points = row.reward?.pointsEarned;
        if (!points) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7F54B3] bg-[#7F54B3]/10 px-2 py-0.5 rounded-full">
            <Gift className="h-3 w-3" />
            +{points} pts
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <AdminStatusBadge status={row.status || "COMPLETED"}>
          {row.status || "Completed"}
        </AdminStatusBadge>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      cell: (row) => (
        <AdminTableDate date={row.createdAt} />
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemContainer>
        {/* Header */}
        <EcosystemHeader
          title="WooCommerce Orders"
          badgeText="Order Management"
          description={
            loading
              ? "Loading orders…"
              : `${totalCount} total synced orders from your WooCommerce store.`
          }
          icon={ShoppingCart}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "WooCommerce", href: "/integrations/woocommerce" },
            { label: "Orders" },
          ]}
        />

        {/* Action / Filter Bar */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  updateParams({ search: val || null, page: "1" });
                }}
                placeholder="Search orders by ID, name, email…"
              />
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          {/* Status Filter */}
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item>
              <Select
                value={statusFilter}
                onValueChange={(val) => updateParams({ status: val, page: "1" })}
              >
                <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-[11px] font-semibold text-foreground shadow-none">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
                  <SelectItem
                    value="ALL"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    All Statuses
                  </SelectItem>
                  <SelectItem
                    value="COMPLETED"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    Completed
                  </SelectItem>
                  <SelectItem
                    value="PROCESSING"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    Processing
                  </SelectItem>
                  <SelectItem
                    value="ON-HOLD"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    On Hold
                  </SelectItem>
                  <SelectItem
                    value="CANCELLED"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    Cancelled
                  </SelectItem>
                  <SelectItem
                    value="REFUNDED"
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    Refunded
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
            keyExtractor={(row) => row.id || row.wooOrderId}
            emptyIcon={ShoppingCart}
            emptyTitle="No WooCommerce orders found"
            emptyDescription="No orders synced from your store yet. Click 'Sync Orders' to fetch latest orders."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-end">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalCount}
                pageSize={limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>

        <ExportCsvModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          entityName="WooCommerce orders"
          description="Export synchronized WooCommerce customer purchases and gamification reward logs as CSV."
          totalCount={totalCount}
          matchingCount={
            debouncedSearch.trim() || statusFilter !== "ALL"
              ? filteredOrders.length
              : undefined
          }
          onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
            const rows = filteredOrders;
            if (rows.length === 0) {
              toast.error("Nothing to export", { description: "No WooCommerce orders found." });
              return;
            }
            const csv = buildCsv(rows, [
              { header: "WooCommerce Order ID", getValue: (o: any) => o.wooOrderId || "" },
              { header: "Customer Name", getValue: (o: any) => o.user ? `${o.user.firstName || ""} ${o.user.lastName || ""}`.trim() || o.user.username : "" },
              { header: "Customer Email", getValue: (o: any) => o.user?.email || "" },
              { header: "Total Price", getValue: (o: any) => o.totalPrice || "" },
              { header: "Currency", getValue: (o: any) => o.currency || "USD" },
              { header: "Status", getValue: (o: any) => o.status || "COMPLETED" },
              { header: "Points Earned", getValue: (o: any) => o.reward?.pointsEarned ?? 0 },
              { header: "Order Date", getValue: (o: any) => o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "" },
            ]);
            downloadCsv(csv, `woocommerce-orders-${new Date().toISOString().slice(0, 10)}`, format);
            toast.success("Export ready", { description: `${rows.length} order${rows.length !== 1 ? "s" : ""} exported.` });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
