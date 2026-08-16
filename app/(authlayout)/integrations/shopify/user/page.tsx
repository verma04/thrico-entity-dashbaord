"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  ShoppingBag,
  ExternalLink,
  Calendar,
  Layers,
  MoreHorizontal,
  Copy,
  Check,
  Filter,
  Upload,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetShopifyCustomers, useSyncShopifyCustomers, useGetShopifyConnection } from "@/graphql/actions";
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
  AdminTableDate,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { safeFormat } from "@/lib/date-utils";

export default function ShopifyUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: connectionData } = useGetShopifyConnection();
  const shopDomain = connectionData?.shopifyConnection?.shopDomain;

  const { data, loading, refetch } = useGetShopifyCustomers({
    input: { limit, offset },
  });
  const [syncCustomers, { loading: syncing }] = useSyncShopifyCustomers();

  const handleSync = async () => {
    try {
      await syncCustomers();
      toast.success("Successfully synced Shopify customers");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to sync customers");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };

  const rawCustomers = data?.getShopifyCustomers?.data || [];
  const totalCount = data?.getShopifyCustomers?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const filteredCustomers = React.useMemo(() => {
    return rawCustomers.filter((cust: any) => {
      const matchesSearch =
        !search.trim() ||
        cust.email?.toLowerCase().includes(search.toLowerCase()) ||
        cust.shopifyCustomerId?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (cust.status || "ACTIVE").toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [rawCustomers, search, statusFilter]);

  const columns: AdminTableColumn<any>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-10 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
    },
    {
      key: "customer",
      header: "Customer",
      cell: (row) => (
        <AdminTableItem
          title={row.email || "Unknown Customer"}
          subtitle={`ID: ${row.shopifyCustomerId}`}
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
      cell: (row) => (
        <AdminTableDate date={row.createdAt} />
      ),
    },
    {
      key: "lastSyncedAt",
      header: "Last Synced",
      cell: (row) => (
        <AdminTableDate date={row.lastSyncedAt} />
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-10 text-right",
      className: "text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-[11px]">Customer Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {row.email && (
              <DropdownMenuItem
                className="text-[11px] gap-2 cursor-pointer"
                onClick={() => copyToClipboard(row.email, "email")}
              >
                <Copy className="h-3 w-3 text-muted-foreground" />
                Copy Email
              </DropdownMenuItem>
            )}
            {row.shopifyCustomerId && (
              <DropdownMenuItem
                className="text-[11px] gap-2 cursor-pointer"
                onClick={() => copyToClipboard(row.shopifyCustomerId, "Customer ID")}
              >
                <Copy className="h-3 w-3 text-muted-foreground" />
                Copy Customer ID
              </DropdownMenuItem>
            )}
            {shopDomain && row.shopifyCustomerId && (
              <DropdownMenuItem
                className="text-[11px] gap-2 cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://${shopDomain}/admin/customers/${row.shopifyCustomerId.replace(/\D/g, "")}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                View in Shopify
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemContainer>
        {/* Header */}
        <EcosystemHeader
          title="Shopify Customers"
          badgeText="Customer Sync"
          description={
            loading
              ? "Loading customers…"
              : `${totalCount} total synced customers from your Shopify store.`
          }
          icon={Users}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "Shopify", href: "/integrations/shopify" },
            { label: "Users" },
          ]}
        />

        {/* Action / Filter Bar */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search by email or Shopify ID…"
              />
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          {/* Status Filter */}
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-[11px] font-semibold text-foreground shadow-none">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border shadow-lg p-1">
                  <SelectItem value="ALL" className="rounded-md text-[11px] font-semibold py-1">
                    All Statuses
                  </SelectItem>
                  <SelectItem value="ACTIVE" className="rounded-md text-[11px] font-semibold py-1">
                    Active
                  </SelectItem>
                  <SelectItem value="DISABLED" className="rounded-md text-[11px] font-semibold py-1">
                    Disabled
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
                {syncing ? "Syncing…" : "Sync Customers"}
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
        </EcosystemActionBar>

        {/* Table Content */}
        <div className="mt-4">
          <AdminTable
            columns={columns}
            data={filteredCustomers}
            loading={loading}
            size="sm"
            enableColumnToggle
            keyExtractor={(row) => row.id || row.shopifyCustomerId}
            emptyIcon={Users}
            emptyTitle="No Shopify customers found"
            emptyDescription="No customers synced from your store yet. Click 'Sync Customers' to fetch latest customers."
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
          entityName="Shopify customers"
          description="Export synchronized Shopify customer accounts as CSV."
          totalCount={totalCount}
          matchingCount={(search.trim() || statusFilter !== "ALL") ? filteredCustomers.length : undefined}
          onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
            const rows = filteredCustomers;
            if (rows.length === 0) {
              toast.error("Nothing to export", { description: "No Shopify customers found." });
              return;
            }
            const csv = buildCsv(rows, [
              { header: "Shopify Customer ID", getValue: (c: any) => c.shopifyCustomerId || "" },
              { header: "Email", getValue: (c: any) => c.email || "" },
              { header: "First Name", getValue: (c: any) => c.firstName || "" },
              { header: "Last Name", getValue: (c: any) => c.lastName || "" },
              { header: "Status", getValue: (c: any) => c.status || "ACTIVE" },
              { header: "Customer Since", getValue: (c: any) => c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : "" },
              { header: "Last Synced", getValue: (c: any) => c.lastSyncedAt ? new Date(c.lastSyncedAt).toISOString().slice(0, 10) : "" },
            ]);
            downloadCsv(csv, `shopify-customers-${new Date().toISOString().slice(0, 10)}`, format);
            toast.success("Export ready", { description: `${rows.length} customer${rows.length !== 1 ? "s" : ""} exported.` });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}



