"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ShopifyOrderCardCompact } from "./shopify-order-card-compact";

interface ShopifyOrderGridProps {
  orders: any[];
  refetch?: () => void;
}

export function ShopifyOrderGrid({ orders, refetch }: ShopifyOrderGridProps) {
  if (!orders || orders.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No Shopify orders found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No orders synced from your Shopify store match your search or filter.
            Click &quot;Sync Orders&quot; to fetch the latest order transactions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {orders.map((order) => (
        <ShopifyOrderCardCompact
          key={order.id || order.shopifyOrderId}
          order={order}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default ShopifyOrderGrid;
