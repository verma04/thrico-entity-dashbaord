"use client";

import React, { useState } from "react";
import {
  Package,
  Search,
  RefreshCw,
  Tag,
  Calendar,
  Layers,
  Upload,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";
import {
  useGetWooCommerceProducts,
  useSyncWooCommerceProducts,
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

export default function WooCommerceProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, loading, refetch } = useGetWooCommerceProducts({
    input: { limit, offset },
  });
  const [syncProducts, { loading: syncing }] = useSyncWooCommerceProducts();

  const handleSync = async () => {
    try {
      await syncProducts();
      toast.success("Successfully synced WooCommerce products");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to sync products");
    }
  };

  const rawProducts = data?.getWooCommerceProducts?.data || [];
  const totalCount = data?.getWooCommerceProducts?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const filteredProducts = React.useMemo(() => {
    if (!search.trim()) return rawProducts;
    const q = search.toLowerCase();
    return rawProducts.filter(
      (prod: any) =>
        prod.title?.toLowerCase().includes(q) ||
        prod.wooProductId?.toLowerCase().includes(q)
    );
  }, [rawProducts, search]);

  const columns: AdminTableColumn<any>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-10 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
    },
    {
      key: "product",
      header: "Product",
      cell: (row) => (
        <AdminTableItem
          icon={Package}
          title={row.title || "Untitled Product"}
          subtitle={`ID: ${row.wooProductId || row.id}`}
        />
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => (
        <span className="text-xs font-semibold text-foreground font-mono">
          {row.price ? `$${row.price}` : "—"}
        </span>
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
          title="WooCommerce Products"
          badgeText="Product Catalog"
          description={
            loading
              ? "Loading products…"
              : `${totalCount} total synced products from your WooCommerce catalog.`
          }
          icon={Package}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "WooCommerce", href: "/integrations/woocommerce" },
            { label: "Products" },
          ]}
        />

        {/* Action / Filter Bar */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search by title or product ID…"
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
                {syncing ? "Syncing…" : "Sync Products"}
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
            data={filteredProducts}
            loading={loading}
            size="sm"
            keyExtractor={(row) => row.id || row.wooProductId}
            emptyIcon={Package}
            emptyTitle="No WooCommerce products found"
            emptyDescription="No products synced from your store yet. Click 'Sync Products' to fetch latest items."
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
          entityName="WooCommerce products"
          description="Export synchronized WooCommerce store catalog items as CSV."
          totalCount={totalCount}
          matchingCount={search.trim() ? filteredProducts.length : undefined}
          onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
            const rows = filteredProducts;
            if (rows.length === 0) {
              toast.error("Nothing to export", { description: "No WooCommerce products found." });
              return;
            }
            const csv = buildCsv(rows, [
              { header: "WooCommerce Product ID", getValue: (p: any) => p.wooProductId || "" },
              { header: "Title", getValue: (p: any) => p.title || "" },
              { header: "Price", getValue: (p: any) => p.price || "" },
              { header: "Status", getValue: (p: any) => p.status || "ACTIVE" },
              { header: "Created At", getValue: (p: any) => p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 10) : "" },
              { header: "Updated At", getValue: (p: any) => p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : "" },
            ]);
            downloadCsv(csv, `woocommerce-products-${new Date().toISOString().slice(0, 10)}`, format);
            toast.success("Export ready", { description: `${rows.length} product${rows.length !== 1 ? "s" : ""} exported.` });
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
