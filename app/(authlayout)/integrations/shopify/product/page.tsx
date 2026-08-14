"use client";

import React, { useState } from "react";
import {
  Package,
  Search,
  RefreshCw,
  Tag,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetShopifyProducts, useSyncShopifyProducts } from "@/graphql/actions";
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

export default function ShopifyProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, loading, refetch } = useGetShopifyProducts({
    input: { limit, offset },
  });
  const [syncProducts, { loading: syncing }] = useSyncShopifyProducts();

  const handleSync = async () => {
    try {
      await syncProducts();
      toast.success("Successfully synced Shopify products");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to sync products");
    }
  };

  const rawProducts = data?.getShopifyProducts?.data || [];
  const totalCount = data?.getShopifyProducts?.total ?? 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const filteredProducts = React.useMemo(() => {
    if (!search.trim()) return rawProducts;
    const q = search.toLowerCase();
    return rawProducts.filter(
      (prod: any) =>
        prod.title?.toLowerCase().includes(q) ||
        prod.shopifyProductId?.toLowerCase().includes(q)
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
          subtitle={`ID: ${row.shopifyProductId}`}
        />
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
          title="Shopify Products"
          badgeText="Product Catalog"
          description={
            loading
              ? "Loading products…"
              : `${totalCount} total synced products from your Shopify catalog.`
          }
          icon={Package}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "Shopify", href: "/integrations/shopify" },
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
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Table Content */}
        <div className="mt-4">
          <AdminTable
            columns={columns}
            data={filteredProducts}
            loading={loading}
            size="sm"
            keyExtractor={(row) => row.id || row.shopifyProductId}
            emptyIcon={Package}
            emptyTitle="No Shopify products found"
            emptyDescription="No products synced from your store yet. Click 'Sync Products' to fetch latest items."
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


