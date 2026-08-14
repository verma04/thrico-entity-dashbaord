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
} from "lucide-react";
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
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { safeFormat } from "@/lib/date-utils";

export default function ShopifyUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
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
      headerClassName: "w-12 text-center",
      className: "text-center text-xs font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
    },
    {
      key: "customer",
      header: "Customer",
      cell: (row) => {
        const initials = row.email
          ? row.email.substring(0, 2).toUpperCase()
          : "SC";
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 rounded-lg border border-border/60 shrink-0">
              <AvatarFallback className="rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 max-w-[240px]">
              <p className="text-[13px] font-semibold text-foreground leading-tight truncate">
                {row.email || "Unknown Customer"}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground leading-tight mt-0.5 truncate">
                ID: {row.shopifyCustomerId}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "contact",
      header: "Contact Email",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-[12px] text-foreground/80">
          <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
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
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
          <span>
            {row.createdAt
              ? safeFormat(row.createdAt, "dd MMM yyyy")
              : "—"}
          </span>
        </div>
      ),
    },
    {
      key: "lastSyncedAt",
      header: "Last Synced",
      cell: (row) => (
        <div className="text-[11px] text-muted-foreground">
          {row.lastSyncedAt
            ? safeFormat(row.lastSyncedAt, "dd MMM yyyy, HH:mm")
            : "—"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "w-16 text-right",
      className: "text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">Customer Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {row.email && (
              <DropdownMenuItem
                className="text-xs gap-2 cursor-pointer"
                onClick={() => copyToClipboard(row.email, "email")}
              >
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                Copy Email
              </DropdownMenuItem>
            )}
            {row.shopifyCustomerId && (
              <DropdownMenuItem
                className="text-xs gap-2 cursor-pointer"
                onClick={() => copyToClipboard(row.shopifyCustomerId, "Customer ID")}
              >
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                Copy Customer ID
              </DropdownMenuItem>
            )}
            {shopDomain && row.shopifyCustomerId && (
              <DropdownMenuItem
                className="text-xs gap-2 cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://${shopDomain}/admin/customers/${row.shopifyCustomerId.replace(/\D/g, "")}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
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
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Table Content */}
        <div className="mt-4">
          <AdminTable
            columns={columns}
            data={filteredCustomers}
            loading={loading}
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
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}



