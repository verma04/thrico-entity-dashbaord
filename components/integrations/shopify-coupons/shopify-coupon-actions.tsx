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
  Tag,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export interface ShopifyCouponActionsProps {
  coupon: any;
  shopDomain?: string;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function ShopifyCouponActions({
  coupon,
  shopDomain,
  refetch,
  trigger,
}: ShopifyCouponActionsProps) {
  const primaryCode = coupon.code || (coupon.codes && coupon.codes[0]);
  const numericId = coupon.id?.replace(/\D/g, "");

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (primaryCode) {
      navigator.clipboard.writeText(primaryCode);
      toast.success("Coupon code copied to clipboard", {
        description: `Code: ${primaryCode}`,
      });
    }
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.id);
    toast.success("Coupon ID copied to clipboard");
  };

  const handleOpenShopify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shopDomain && numericId) {
      window.open(`https://${shopDomain}/admin/discounts/${numericId}`, "_blank");
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
        className="w-48 rounded-lg shadow-md border-border p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
          Actions
        </DropdownMenuLabel>

        {primaryCode && (
          <DropdownMenuItem
            onClick={handleCopyCode}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Code
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={handleCopyId}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Coupon ID
        </DropdownMenuItem>

        {shopDomain && (
          <>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={handleOpenShopify}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              View in Shopify
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ShopifyCouponActions;
