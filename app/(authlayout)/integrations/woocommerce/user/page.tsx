"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Store,
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
import {
  useGetWooCommerceCustomers,
  useSyncWooCommerceCustomers,
  useGetWooCommerceConnection,
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
  AdminTableDate,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { safeFormat } from "@/lib/date-utils";

export default function WooCommerceUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: connectionData } = useGetWooCommerceConnection();
  const siteUrl = connectionData?.wooCommerceConnection?.siteUrl;

  const { data, loading, refetch } = useGetWooCommerceCustomers({
    input: { limit, offset },
  });
  const [syncCustomers, { loading: syncing }] = useSyncWooCommerceCustomers();

  const handleSync = async () => {
    try {
      await syncCustomers();
      toast.success("Successfully synced WooCommerce customers");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to sync customers");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };

  const rawCustomers = data?.getWooCommerceCustomers?.data || [];
  const totalCount = data?.getWooCommerceCustomers?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const filteredCustomers = React.useMemo(() => {
    return rawCustomers.filter((cust: any) => {
      const matchesSearch =
        !search.trim() ||
        cust.email?.toLowerCase().includes(search.toLowerCase()) ||
        cust.wooCustomerId?.toLowerCase().includes(search.toLowerCase());

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
      cell: (row) => {
        const displayName = row.email || "WooCommerce Customer";
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7 rounded-full">
              <AvatarFallback className="text-[10px] bg-[#7F54B3]/10 text-[#7F54B3] font-semibold">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">
                {displayName}
              </div>
              <div className="text-[11px] text-muted-foreground truncate font-mono">
                ID: {row.wooCustomerId || row.id}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3 w-3 opacity-60 shrink-0" />
          <span className="truncate">{row.email || "No email"}</span>
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
      header: "Joined Date",
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
          <DropdownMenuContent align="end" className="w-48 text-xs">
            <DropdownMenuLabel className="text-[11px] text-muted-foreground">
              Customer Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                copyToClipboard(
                  row.wooCustomerId || row.id,
                  "Customer ID"
                )
              }
              className="text-[11px] gap-2 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5 opacity-70" />
              Copy WooCommerce ID
            </DropdownMenuItem>
            {row.email && (
              <DropdownMenuItem
                onClick={() => copyToClipboard(row.email, "Email")}
                className="text-[11px] gap-2 cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 opacity-70" />
                Copy Email
              </DropdownMenuItem>
            )}
            {siteUrl && (
              <DropdownMenuItem asChild className="text-[11px] gap-2 cursor-pointer">
                <a
                  href={`${siteUrl}/wp-admin/user-edit.php?user_id=${row.wooCustomerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  View in WordPress
                </a>
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
          title="WooCommerce Customers"
          badgeText="Customers & Contacts"
          description={
            loading
              ? "Loading customers…"
              : `${totalCount} total synced customers from your WooCommerce store.`
          }
          icon={Users}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "WooCommerce", href: "/integrations/woocommerce" },
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
                placeholder="Search by name, email, or ID…"
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
                  <SelectItem value="INACTIVE" className="rounded-md text-[11px] font-semibold py-1">
                    Inactive
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
            keyExtractor={(row) => row.id || row.wooCustomerId}
            emptyIcon={Users}
            emptyTitle="No WooCommerce customers found"
            emptyDescription="No customers synced from your store yet. Click 'Sync Customers' to fetch latest customers."
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

        {/* Export Modal */}
        <ExportCsvModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          entityName="WooCommerce customers"
          description="Export synchronized WooCommerce customer accounts as CSV."
          totalCount={totalCount}
          matchingCount={(search.trim() || statusFilter !== "ALL") ? filteredCustomers.length : undefined}
          onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
            const rows = filteredCustomers;
            if (rows.length === 0) {
              toast.error("Nothing to export", { description: "No WooCommerce customers found." });
              return;
            }
            const csv = buildCsv(rows, [
              { header: "WooCommerce Customer ID", getValue: (c: any) => c.wooCustomerId || "" },
              { header: "Email", getValue: (c: any) => c.email || "" },
              { header: "Status", getValue: (c: any) => c.status || "ACTIVE" },
              { header: "Customer Since", getValue: (c: any) => c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : "" },
              { header: "Last Synced", getValue: (c: any) => c.lastSyncedAt ? new Date(c.lastSyncedAt).toISOString().slice(0, 10) : "" },
            ]);
            downloadCsv(csv, `woocommerce-customers-${new Date().toISOString().slice(0, 10)}`, format);
            toast.success("Export ready", { description: `${rows.length} customer${rows.length !== 1 ? "s" : ""} exported.` });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
