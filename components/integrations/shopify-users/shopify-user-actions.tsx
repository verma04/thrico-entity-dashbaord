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
  Mail,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export interface ShopifyUserActionsProps {
  customer: any;
  shopDomain?: string;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function ShopifyUserActions({
  customer,
  shopDomain,
  refetch,
  trigger,
}: ShopifyUserActionsProps) {
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (customer.email) {
      navigator.clipboard.writeText(customer.email);
      toast.success("Customer email copied to clipboard");
    }
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (customer.shopifyCustomerId) {
      navigator.clipboard.writeText(customer.shopifyCustomerId);
      toast.success("Shopify Customer ID copied to clipboard", {
        description: `ID: ${customer.shopifyCustomerId}`,
      });
    }
  };

  const handleOpenShopify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shopDomain && customer.shopifyCustomerId) {
      const cleanId = customer.shopifyCustomerId.replace(/\D/g, "");
      window.open(`https://${shopDomain}/admin/customers/${cleanId}`, "_blank");
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

        {customer.email && (
          <DropdownMenuItem
            onClick={handleCopyEmail}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Email
          </DropdownMenuItem>
        )}

        {customer.shopifyCustomerId && (
          <DropdownMenuItem
            onClick={handleCopyId}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Customer ID
          </DropdownMenuItem>
        )}

        {shopDomain && customer.shopifyCustomerId && (
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

export default ShopifyUserActions;
