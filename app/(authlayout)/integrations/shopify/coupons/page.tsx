"use client";

import React, { useState } from "react";
import {
  Tag,
  Search,
  RefreshCw,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Zap,
  Percent,
  DollarSign,
  Gift,
  Truck,
  Upload,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  useGetShopifyCoupons,
  useGetShopifyConnection,
  ShopifyCoupon,
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
  AdminTableMetric,
  Pagination,
} from "@/components/shared/admin-table/admin-table";

export default function ShopifyCouponsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: connectionData } = useGetShopifyConnection();
  const shopDomain = connectionData?.shopifyConnection?.shopDomain;

  const { data, loading, refetch } = useGetShopifyCoupons({
    input: { limit, offset },
  });

  const rawCoupons: ShopifyCoupon[] = data?.getShopifyCoupons?.data || [];
  const totalCount = data?.getShopifyCoupons?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };

  const filteredCoupons = React.useMemo(() => {
    return rawCoupons.filter((coupon: ShopifyCoupon) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        coupon.title?.toLowerCase().includes(q) ||
        coupon.code?.toLowerCase().includes(q) ||
        coupon.codes?.some((c) => c.toLowerCase().includes(q)) ||
        coupon.summary?.toLowerCase().includes(q) ||
        coupon.id?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (coupon.status || "ACTIVE").toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [rawCoupons, search, statusFilter]);

  const formatDiscountValue = (coupon: ShopifyCoupon) => {
    if (coupon.discountType === "PERCENTAGE" && coupon.value != null) {
      return `${coupon.value}% OFF`;
    }
    if (coupon.discountType === "FIXED_AMOUNT" && coupon.value != null) {
      return `${coupon.currency || "$"} ${Number(coupon.value).toFixed(2)} OFF`;
    }
    if (coupon.discountType === "FREE_SHIPPING") {
      return "Free Shipping";
    }
    if (coupon.discountType === "BXGY") {
      return "Buy X Get Y";
    }
    return coupon.discountType || "—";
  };

  const columns: AdminTableColumn<ShopifyCoupon>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-10 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
    },
    {
      key: "coupon",
      header: "Coupon",
      cell: (row) => (
        <AdminTableItem
          icon={Tag}
          title={row.title || row.code || "Untitled Coupon"}
          subtitle={row.summary || `ID: ${row.id}`}
          fallbackText={
            row.code
              ? row.code.substring(0, 2).toUpperCase()
              : row.title
              ? row.title.substring(0, 2).toUpperCase()
              : "CP"
          }
        />
      ),
    },
    {
      key: "code",
      header: "Code",
      cell: (row) => {
        if (row.isAutomatic) {
          return (
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-medium"
            >
              <Zap className="h-2.5 w-2.5 mr-1" />
              Automatic
            </Badge>
          );
        }

        const primaryCode = row.code || (row.codes && row.codes[0]);
        if (!primaryCode) {
          return <span className="text-[11px] text-muted-foreground">—</span>;
        }

        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded border border-border/60">
              {primaryCode}
            </span>
            {row.codes && row.codes.length > 1 && (
              <span className="text-[10px] text-muted-foreground">
                +{row.codes.length - 1}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "discount",
      header: "Discount",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-foreground">
            {formatDiscountValue(row)}
          </span>
          {row.minimumRequirement && (
            <span className="text-[10px] text-muted-foreground">
              {row.minimumRequirement.type === "SUBTOTAL" &&
              row.minimumRequirement.greaterThanOrEqualTo != null
                ? `Min. ${row.minimumRequirement.currency || "$"} ${Number(
                    row.minimumRequirement.greaterThanOrEqualTo
                  ).toFixed(2)}`
                : row.minimumRequirement.type === "QUANTITY" &&
                  row.minimumRequirement.greaterThanOrEqualTo != null
                ? `Min. ${row.minimumRequirement.greaterThanOrEqualTo} items`
                : null}
            </span>
          )}
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
      key: "usage",
      header: "Usage",
      cell: (row) => (
        <AdminTableMetric
          value={
            row.usageLimit != null
              ? `${row.timesUsed} / ${row.usageLimit}`
              : `${row.timesUsed || 0}`
          }
          unit={row.usageLimit == null ? "uses" : undefined}
          variant="mono"
        />
      ),
    },
    {
      key: "startsAt",
      header: "Starts At",
      cell: (row) => (
        <AdminTableDate date={row.startsAt} />
      ),
    },
    {
      key: "endsAt",
      header: "Expires At",
      cell: (row) =>
        row.endsAt ? (
          <AdminTableDate date={row.endsAt} />
        ) : (
          <span className="text-[11px] text-muted-foreground">No Expiry</span>
        ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-10 text-right",
      className: "text-right",
      cell: (row) => {
        const primaryCode = row.code || (row.codes && row.codes[0]);
        const numericId = row.id.replace(/\D/g, "");

        return (
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
              <DropdownMenuLabel className="text-[11px]">
                Coupon Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {primaryCode && (
                <DropdownMenuItem
                  className="text-[11px] gap-2 cursor-pointer"
                  onClick={() => copyToClipboard(primaryCode, "Coupon Code")}
                >
                  <Copy className="h-3 w-3 text-muted-foreground" />
                  Copy Code
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-[11px] gap-2 cursor-pointer"
                onClick={() => copyToClipboard(row.id, "Coupon ID")}
              >
                <Copy className="h-3 w-3 text-muted-foreground" />
                Copy ID
              </DropdownMenuItem>
              {shopDomain && (
                <DropdownMenuItem
                  className="text-[11px] gap-2 cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://${shopDomain}/admin/discounts/${numericId}`,
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
        );
      },
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemContainer>
        {/* Header */}
        <EcosystemHeader
          title="Shopify Coupons"
          badgeText="Coupon Sync"
          description={
            loading
              ? "Loading coupons…"
              : `${totalCount} total synced coupons from your Shopify store.`
          }
          icon={Tag}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "Shopify", href: "/integrations/shopify" },
            { label: "Coupons" },
          ]}
        />

        {/* Action / Filter Bar */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search by code, title or summary…"
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
                  <SelectItem
                    value="ALL"
                    className="rounded-md text-[11px] font-semibold py-1"
                  >
                    All Statuses
                  </SelectItem>
                  <SelectItem
                    value="ACTIVE"
                    className="rounded-md text-[11px] font-semibold py-1"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="EXPIRED"
                    className="rounded-md text-[11px] font-semibold py-1"
                  >
                    Expired
                  </SelectItem>
                  <SelectItem
                    value="SCHEDULED"
                    className="rounded-md text-[11px] font-semibold py-1"
                  >
                    Scheduled
                  </SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>

            <EcosystemActionBar.Item>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetch();
                  toast.success("Refreshed Shopify coupons");
                }}
                disabled={loading}
                className="h-8 px-3 rounded-md text-[11px] font-semibold gap-1.5 border-border"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing…" : "Refresh"}
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
            data={filteredCoupons}
            loading={loading}
            size="sm"
            enableColumnToggle
            keyExtractor={(row) => row.id}
            emptyIcon={Tag}
            emptyTitle="No Shopify coupons found"
            emptyDescription="No coupons synced from your store yet. Create discount codes in Shopify or click 'Refresh' to update."
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
          entityName="Shopify coupons"
          description="Export synchronized Shopify discounts and promo coupon rules as CSV."
          totalCount={totalCount}
          matchingCount={(search.trim() || statusFilter !== "ALL") ? filteredCoupons.length : undefined}
          onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
            const rows = filteredCoupons;
            if (rows.length === 0) {
              toast.error("Nothing to export", { description: "No Shopify coupons found." });
              return;
            }
            const csv = buildCsv(rows, [
              { header: "Title", getValue: (c: any) => c.title || "" },
              { header: "Code", getValue: (c: any) => c.code || (c.codes ? c.codes.join(", ") : "") },
              { header: "Discount Type", getValue: (c: any) => c.discountType || "" },
              { header: "Discount Value", getValue: (c: any) => c.value != null ? `${c.value}` : "" },
              { header: "Status", getValue: (c: any) => c.status || "ACTIVE" },
              { header: "Usage Count", getValue: (c: any) => c.asyncUsageCount ?? c.usageCount ?? 0 },
              { header: "Usage Limit", getValue: (c: any) => c.usageLimit ?? "Unlimited" },
              { header: "Starts At", getValue: (c: any) => c.startsAt ? new Date(c.startsAt).toISOString().slice(0, 10) : "" },
              { header: "Ends At", getValue: (c: any) => c.endsAt ? new Date(c.endsAt).toISOString().slice(0, 10) : "" },
            ]);
            downloadCsv(csv, `shopify-coupons-${new Date().toISOString().slice(0, 10)}`, format);
            toast.success("Export ready", { description: `${rows.length} coupon${rows.length !== 1 ? "s" : ""} exported.` });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
