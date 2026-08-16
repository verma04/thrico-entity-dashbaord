"use client";

import React, { useState } from "react";
import {
  Tag,
  Search,
  RefreshCw,
  MoreHorizontal,
  Copy,
  ExternalLink,
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
  useGetWooCommerceCoupons,
  useGetWooCommerceConnection,
  WooCommerceCoupon,
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

export default function WooCommerceCouponsPage() {
  const [search, setSearch] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: connectionData } = useGetWooCommerceConnection();
  const siteUrl = connectionData?.wooCommerceConnection?.siteUrl;

  const { data, loading, refetch } = useGetWooCommerceCoupons({
    input: { limit, offset },
  });

  const rawCoupons: WooCommerceCoupon[] =
    data?.getWooCommerceCoupons?.data || [];
  const totalCount = data?.getWooCommerceCoupons?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };

  const filteredCoupons = React.useMemo(() => {
    return rawCoupons.filter((coupon) => {
      const matchesSearch =
        !search.trim() ||
        coupon.code?.toLowerCase().includes(search.toLowerCase()) ||
        coupon.description?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        discountTypeFilter === "ALL" ||
        coupon.discountType?.toLowerCase() === discountTypeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [rawCoupons, search, discountTypeFilter]);

  const columns: AdminTableColumn<WooCommerceCoupon>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-10 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
    },
    {
      key: "code",
      header: "Discount Code",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-7 px-2 rounded bg-muted/60 border border-border/60 flex items-center font-mono text-xs font-semibold text-foreground">
            {row.code || "NO CODE"}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => copyToClipboard(row.code, "Discount Code")}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      key: "description",
      header: "Details",
      cell: (row) => (
        <AdminTableItem
          icon={Tag}
          title={row.code}
          subtitle={
            row.description ||
            `${row.discountType || "Standard"} discount on store purchases`
          }
        />
      ),
    },
    {
      key: "amount",
      header: "Discount Amount",
      cell: (row) => {
        const isPercent =
          row.discountType?.toLowerCase().includes("percent") ||
          row.discountType === "percent";
        return (
          <span className="text-xs font-semibold text-foreground font-mono">
            {isPercent
              ? `${row.amount}% OFF`
              : `${row.currency || "$"}${row.amount} OFF`}
          </span>
        );
      },
    },
    {
      key: "usage",
      header: "Redemptions",
      cell: (row) => (
        <span className="text-xs font-medium text-foreground">
          {row.usageCount || 0} / {row.usageLimit ? row.usageLimit : "∞"}
        </span>
      ),
    },
    {
      key: "expires",
      header: "Expiry Date",
      cell: (row) => (
        <AdminTableDate date={row.dateExpires} />
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
              Coupon Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => copyToClipboard(row.code, "Coupon Code")}
              className="text-[11px] gap-2 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5 opacity-70" />
              Copy Code
            </DropdownMenuItem>
            {siteUrl && (
              <DropdownMenuItem asChild className="text-[11px] gap-2 cursor-pointer">
                <a
                  href={`${siteUrl}/wp-admin/edit.php?post_type=shop_coupon`}
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
          title="WooCommerce Coupons"
          badgeText="Coupon Sync"
          description={
            loading
              ? "Loading coupons…"
              : `${totalCount} total synced coupons from your WooCommerce store.`
          }
          icon={Tag}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "WooCommerce", href: "/integrations/woocommerce" },
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
                placeholder="Search by code or description…"
              />
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          {/* Type Filter */}
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item>
              <Select
                value={discountTypeFilter}
                onValueChange={setDiscountTypeFilter}
              >
                <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-[11px] font-semibold text-foreground shadow-none">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border shadow-lg p-1">
                  <SelectItem value="ALL" className="rounded-md text-[11px] font-semibold py-1">
                    All Types
                  </SelectItem>
                  <SelectItem value="percent" className="rounded-md text-[11px] font-semibold py-1">
                    Percentage
                  </SelectItem>
                  <SelectItem value="fixed_cart" className="rounded-md text-[11px] font-semibold py-1">
                    Fixed Cart
                  </SelectItem>
                  <SelectItem value="fixed_product" className="rounded-md text-[11px] font-semibold py-1">
                    Fixed Product
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
                  toast.success("Refreshed WooCommerce coupons");
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
            keyExtractor={(row) => row.id || row.code}
            emptyIcon={Tag}
            emptyTitle="No WooCommerce coupons found"
            emptyDescription="No coupons synced from your store yet. Create discount codes in WooCommerce or click 'Refresh' to update."
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
          entityName="WooCommerce coupons"
          description="Export synchronized WooCommerce discounts and promo coupon rules as CSV."
          totalCount={totalCount}
          matchingCount={search.trim() ? filteredCoupons.length : undefined}
          onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
            const rows = filteredCoupons;
            if (rows.length === 0) {
              toast.error("Nothing to export", { description: "No WooCommerce coupons found." });
              return;
            }
            const csv = buildCsv(rows, [
              { header: "Code", getValue: (c: any) => c.code || "" },
              { header: "Discount Type", getValue: (c: any) => c.discountType || "" },
              { header: "Amount", getValue: (c: any) => c.amount || "" },
              { header: "Description", getValue: (c: any) => c.description || "" },
              { header: "Usage Count", getValue: (c: any) => c.usageCount ?? 0 },
              { header: "Usage Limit", getValue: (c: any) => c.usageLimit ?? "Unlimited" },
              { header: "Expires", getValue: (c: any) => c.dateExpires ? new Date(c.dateExpires).toISOString().slice(0, 10) : "Never" },
            ]);
            downloadCsv(csv, `woocommerce-coupons-${new Date().toISOString().slice(0, 10)}`, format);
            toast.success("Export ready", { description: `${rows.length} coupon${rows.length !== 1 ? "s" : ""} exported.` });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
