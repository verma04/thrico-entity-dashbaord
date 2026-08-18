"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Loader2,
  ExternalLink,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useDeleteShopProduct } from "@/graphql/actions/shop";
import { useModuleStore } from "@/store/useModuleStore";

export interface ProductActionsProps {
  product: any;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function ProductActions({
  product,
  refetch,
  trigger,
}: ProductActionsProps) {
  const router = useRouter();
  const singularName = useModuleStore((state) => state.shopSingularName);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteProduct, { loading: isDeleting }] = useDeleteShopProduct({
    onCompleted: () => {
      toast.success(`${singularName} deleted successfully`);
      setDeleteOpen(false);
      refetch?.();
    },
    onError: (err) => {
      toast.error(err.message || `Failed to delete ${singularName.toLowerCase()}`);
    },
  });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/shop/${product.id}/manage`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${product.title}"`,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteProduct({ variables: { id: product.id } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          {trigger || (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <MoreHorizontal className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-lg shadow-md border-border p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/shop/${product.id}/manage`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            Edit {singularName}
          </DropdownMenuItem>

          {product.externalLink && (
            <DropdownMenuItem
              onClick={() => window.open(product.externalLink, "_blank")}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              Store Page
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={handleCopyLink}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Link
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete {singularName}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {singularName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{product.title}</strong> and all its variants?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ProductActions;
