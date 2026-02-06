"use client";

import React from "react";
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Loader2,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
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

  const columns: ColumnDef<any>[] = [
    // ... existing columns (product, category, variants, externalLink, status)
    {
      id: "product",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-4 py-1">
            <Avatar className="h-12 w-12 rounded-lg border shrink-0">
              <AvatarImage
                src={resolveCdnUrl(product.media?.[0]?.url || product.image)}
                alt={product.title}
              />
              <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">
                IMG
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 gap-0.5">
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
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">
                {product.description || "No description"}
              </p>
              <div className="font-mono text-[13px] font-bold text-emerald-600">
                {product.currency} {product.price}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "variants",
      header: "Variants",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.variants?.length || 0}
        </span>
      ),
    },
    {
      accessorKey: "externalLink",
      header: "Link",
      cell: ({ row }) => {
        const link = row.original.externalLink;
        return link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status === "APPROVED" ? "default" : "secondary"}
            className={
              status === "APPROVED" ? "bg-green-500 hover:bg-green-600" : ""
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild className="gap-2">
                  <Link
                    href={`/shop/${product.id}`}
                    className="flex items-center w-full"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(product.id)}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-destructive"
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
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the product {}
                    <strong>{product.title}</strong> and all its variants. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteProduct({ variables: { id: product.id } })
                    }
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
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
  ];

  // Estimate page count: if we got fewer items than pageSize, we're on the last page
  // Otherwise, assume there might be more pages
  const estimatedPageCount =
    products.length < pageSize ? pageIndex + 1 : pageIndex + 2;

  console.log("[ProductTable Debug]", {
    productsCount: products.length,
    pageSize,
    pageIndex,
    estimatedPageCount,
  });

  const handlePageChange = (page: number) => {
    console.log("[ProductTable] Page change requested:", page);
    onPageChange(page);
  };

  const handlePageSizeChange = (size: number) => {
    console.log("[ProductTable] Page size change requested:", size);
    onPageSizeChange(size);
  };

  return (
    <DataTable
      columns={columns}
      data={products}
      isLoading={loading}
      manualPagination={true}
      pageIndex={pageIndex}
      pageSize={pageSize}
      pageCount={estimatedPageCount}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
