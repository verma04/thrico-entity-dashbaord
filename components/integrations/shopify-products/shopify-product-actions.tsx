"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Copy,
  Package,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export interface ShopifyProductActionsProps {
  product: any;
  shopDomain?: string;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function ShopifyProductActions({
  product,
  shopDomain,
  refetch,
  trigger,
}: ShopifyProductActionsProps) {
  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = product.shopifyProductId || product.id;
    navigator.clipboard.writeText(id);
    toast.success("Shopify Product ID copied to clipboard", {
      description: `ID: ${id}`,
    });
  };

  const handleCopyTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.title || "");
    toast.success("Product title copied to clipboard");
  };

  const handleOpenShopify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shopDomain && (product.shopifyProductId || product.id)) {
      const cleanId = (product.shopifyProductId || product.id).replace(/\D/g, "");
      window.open(`https://${shopDomain}/admin/products/${cleanId}`, "_blank");
    } else {
      toast.info("Store domain not available", {
        description: "Connect your Shopify store to open products directly in Shopify admin.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-lg shadow-md border-border p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
          Product Actions
        </DropdownMenuLabel>

        {shopDomain && (
          <>
            <DropdownMenuItem
              onClick={handleOpenShopify}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-primary focus:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5 text-primary" />
              View in Shopify Admin
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={handleCopyId}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Product ID
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleCopyTitle}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Title
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ShopifyProductActions;
