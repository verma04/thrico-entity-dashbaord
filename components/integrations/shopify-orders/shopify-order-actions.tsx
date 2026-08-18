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
  ShoppingCart,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

export interface ShopifyOrderActionsProps {
  order: any;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function ShopifyOrderActions({
  order,
  refetch,
  trigger,
}: ShopifyOrderActionsProps) {
  const handleCopyOrderId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.shopifyOrderId || order.id);
    toast.success("Shopify Order ID copied to clipboard", {
      description: `Order #${order.shopifyOrderId || order.id}`,
    });
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (order.user?.email) {
      navigator.clipboard.writeText(order.user.email);
      toast.success("Customer email copied to clipboard");
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

        <DropdownMenuItem
          onClick={handleCopyOrderId}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
          Copy Order ID
        </DropdownMenuItem>

        {order.user?.email && (
          <DropdownMenuItem
            onClick={handleCopyEmail}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Customer Email
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ShopifyOrderActions;
