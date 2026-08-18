"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductActions } from "./product-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableDate,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { resolveCdnUrl } from "@/lib/shop-utils";
import { useModuleStore } from "@/store/useModuleStore";
import { Badge } from "@/components/ui/badge";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getProductTableColumns = (
  singularName: string,
  refetch?: () => void,
): AdminTableColumn<any>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "product",
    header: singularName,
    cell: (row) => {
      const coverUrl = resolveCdnUrl(row.media?.[0]?.url || row.image);

      return (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <Link href={`/shop/${row.id}/manage`} className="shrink-0">
            <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0 hover:border-primary transition-colors">
              {coverUrl ? (
                <AvatarImage
                  src={coverUrl}
                  alt={row.title}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                <ShoppingBag className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/shop/${row.id}/manage`}
              className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[220px] hover:text-primary hover:underline transition-colors"
              title={row.title}
            >
              {row.title}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground truncate max-w-[200px]">
              <span className="truncate">{row.category || "General"}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    key: "price",
    header: "Price",
    cell: (row) => (
      <span className="font-mono text-[12px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
        {row.currency || "₹"}{Number(row.price || 0).toLocaleString()}
      </span>
    ),
  },
  {
    key: "variants",
    header: "Variants",
    cell: (row) => (
      <span className="text-[12px] font-semibold text-foreground">
        {row.variants?.length || row.numberOfVariants || 0}
      </span>
    ),
  },
  {
    key: "stock",
    header: "Stock",
    cell: (row) => (
      <Badge
        variant={row.isOutOfStock ? "destructive" : "outline"}
        className="h-4 px-1.5 text-[9px] uppercase font-bold shrink-0"
      >
        {row.isOutOfStock ? "Out of Stock" : "In Stock"}
      </Badge>
    ),
  },
  {
    key: "views",
    header: "Views",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={Eye}
        value={row.numberOfViews || 0}
        variant="indigo"
      />
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status || "DRAFT"} />,
  },
  {
    key: "link",
    header: "Store Link",
    cell: (row) => {
      return row.externalLink ? (
        <a
          href={row.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1 text-[11px] font-medium"
        >
          <span>Link</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-muted-foreground text-[11px]">—</span>
      );
    },
  },
  {
    key: "created",
    header: "Created",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => <ProductActions product={row} refetch={refetch} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductsListProps {
  products: any[];
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ProductsList({
  products,
  refetch,
  visibleColumns,
  offset = 0,
}: ProductsListProps) {
  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);

  const baseColumns = React.useMemo(
    () => getProductTableColumns(singularName, refetch),
    [singularName, refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<any>
        columns={activeColumns}
        data={products}
        keyExtractor={(p) => p.id}
        emptyIcon={ShoppingBag}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ProductsList;
