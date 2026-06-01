"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ShoppingBag, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { resolveCdnUrl } from "@/lib/shop-utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";
import React from "react";
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
import { Loader2 } from "lucide-react";
import { useDeleteShopProduct } from "@/graphql/actions/shop";
import { toast } from "sonner";

interface ProductCardProps {
  product: any;
  refetch: () => void;
}

export function ProductCard({ product, refetch }: ProductCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  const [deleteProduct, { loading: isDeleting }] = useDeleteShopProduct({
    onCompleted: () => {
      toast.success("Product deleted successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete product");
    },
  });

  const imageUrl = resolveCdnUrl(product.media?.[0]?.url || product.image);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group flex flex-col h-full relative">
        {/* Top Actions Menu */}
        <div className="absolute right-3 top-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white/20 hover:bg-white text-slate-700">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
              <DropdownMenuLabel className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem asChild className="gap-2 cursor-pointer font-medium text-[13px]">
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
        </div>

        <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-50 to-indigo-100/50">
              <ShoppingBag className="h-16 w-16 text-indigo-200" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute bottom-3 left-3 z-20 flex gap-2">
            <Badge 
              variant={product.isOutOfStock ? "destructive" : "secondary"} 
              className={cn(
                "font-bold backdrop-blur-md shadow-sm border",
                product.isOutOfStock 
                  ? "bg-rose-500/90 text-white border-rose-400" 
                  : "bg-white/90 text-slate-900 border-white/20"
              )}
            >
              {product.isOutOfStock ? "Out of Stock" : "In Stock"}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge
              variant="outline"
              className="gap-1.5 font-semibold text-[10px] uppercase border-transparent bg-slate-100 text-slate-600"
            >
              {product.category || "Uncategorized"}
            </Badge>
            
            <div className="font-mono text-lg font-black text-emerald-600">
              {product.currency} {product.price}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="font-black text-lg text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-grow flex flex-col">
          <p className="text-sm text-slate-500 font-medium line-clamp-2 min-h-[40px] leading-relaxed mb-4">
            {product.description || "No description provided."}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-4">
             <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                   <Layers className="h-3 w-3" /> Variants
                </div>
                <p className="text-sm font-black text-slate-800">{product.variants?.length || 0}</p>
             </div>
             
             {product.externalLink ? (
               <a href={product.externalLink} target="_blank" rel="noopener noreferrer" className="bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors block text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                     <ExternalLink className="h-3 w-3" /> External
                  </div>
                  <p className="text-sm font-black text-blue-600 truncate">Store Link</p>
               </a>
             ) : (
               <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 opacity-50">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                     <ExternalLink className="h-3 w-3" /> External
                  </div>
                  <p className="text-sm font-black text-slate-500">-</p>
               </div>
             )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-slate-50 p-5 py-4 bg-slate-50/30">
          <div className="scale-90 origin-left">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wide font-bold",
                product.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"
              )}
            >
              {product.status || "DRAFT"}
            </span>
          </div>
          <Link href={`/shop/${product.id}`}>
            <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              Edit Details
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Delete Dialog */}
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
              This will permanently delete the product <strong>{product.title}</strong> and all its variants. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
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
    </motion.div>
  );
}
