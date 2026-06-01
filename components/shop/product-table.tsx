"use client";

import React, { useMemo } from "react";
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteShopProduct } from "@/graphql/actions/shop";
import { toast } from "sonner";
import { resolveCdnUrl } from "@/lib/shop-utils";
import Link from "next/link";

import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";

interface ProductTableProps {
  products: any[];
  loading: boolean;
  refetch: () => void;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ProductTable({
  products,
  loading,
  refetch,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ProductTableProps) {
  const [deleteProduct, { loading: isDeleting }] = useDeleteShopProduct({
    onCompleted: () => {
      toast.success("Product deleted successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete product");
    },
  });

  const columns = useMemo<AdminTableColumn<any>[]>(
    () => [
      {
        key: "product",
        header: "Product",
        cell: (row) => {
          const product = row;
          return (
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <AvatarImage
                  src={resolveCdnUrl(product.media?.[0]?.url || product.image)}
                  alt={product.title}
                />
                <AvatarFallback className="bg-indigo-50 text-indigo-200">
                  <ShoppingBag className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground leading-tight truncate max-w-[200px]">
                    {product.title}
                  </span>
                  <Badge
                    variant={product.isOutOfStock ? "destructive" : "outline"}
                    className="h-4 px-1.5 text-[10px] uppercase font-bold shrink-0"
                  >
                    {product.isOutOfStock ? "Out" : "In Stock"}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                  {product.description || "No description"}
                </span>
                <div className="font-mono text-[12px] font-bold text-emerald-600 mt-0.5">
                  {product.currency} {product.price}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        key: "category",
        header: "Category",
        cell: (row) => (
          <Badge
            variant="outline"
            className="font-bold bg-muted border-transparent text-foreground text-[10px] uppercase tracking-tighter"
          >
            {row.category}
          </Badge>
        ),
      },
      {
        key: "variants",
        header: "Variants",
        cell: (row) => (
          <span className="text-[12px] font-bold text-foreground">
            {row.variants?.length || 0}
          </span>
        ),
      },
      {
        key: "externalLink",
        header: "Link",
        cell: (row) => {
          const link = row.externalLink;
          return link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="text-muted-foreground text-[12px]">-</span>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        cell: (row) => <AdminStatusBadge status={row.status} />,
      },
      {
        key: "actions",
        header: "",
        headerClassName: "w-12 text-right",
        className: "text-right",
        cell: (row) => {
          const product = row;
          const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[180px] rounded-xl"
                >
                  <DropdownMenuLabel className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    asChild
                    className="gap-2 cursor-pointer font-medium text-[13px]"
                  >
                    <Link
                      href={`/shop/${product.id}`}
                      className="flex items-center w-full"
                    >
                      <Pencil className="h-4 w-4 text-slate-500" />
                      Edit Product
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(product.id)}
                    className="gap-2 cursor-pointer font-medium text-[13px]"
                  >
                    <Copy className="h-4 w-4 text-slate-500" />
                    Copy ID
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-medium text-[13px]"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <AlertDialogContent className="rounded-2xl border-slate-200/60 shadow-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold text-xl text-slate-900">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-slate-500">
                      This will permanently delete the product{" "}
                      <strong>{product.title}</strong> and all its variants.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-bold">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        deleteProduct({ variables: { id: product.id } })
                      }
                      className="rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-none gap-2"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ],
    [isDeleting, deleteProduct],
  );

  const estimatedPageCount =
    products.length < pageSize ? pageIndex + 1 : pageIndex + 2;

  return (
    <AdminTable<any>
      columns={columns}
      data={products}
      loading={loading}
      keyExtractor={(p) => p.id}
      emptyIcon={ShoppingBag}
      emptyTitle="No products found"
      emptyDescription="Try adjusting your search or filter criteria."
    />
  );
}
