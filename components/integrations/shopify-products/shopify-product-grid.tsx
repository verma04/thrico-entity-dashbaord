"use client";

import React from "react";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ShopifyProductCardCompact } from "./shopify-product-card-compact";

interface ShopifyProductGridProps {
  products: any[];
  refetch?: () => void;
}

export function ShopifyProductGrid({
  products,
  refetch,
}: ShopifyProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Package className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No Shopify products found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No products synced from your Shopify catalog match your search or filter.
            Click &quot;Sync Products&quot; to fetch the latest catalog items.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {products.map((prod) => (
        <ShopifyProductCardCompact
          key={prod.id || prod.shopifyProductId}
          product={prod}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default ShopifyProductGrid;
