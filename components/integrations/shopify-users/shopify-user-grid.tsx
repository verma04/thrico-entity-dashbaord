"use client";

import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ShopifyUserCardCompact } from "./shopify-user-card-compact";

interface ShopifyUserGridProps {
  customers: any[];
  shopDomain?: string;
  refetch?: () => void;
}

export function ShopifyUserGrid({
  customers,
  shopDomain,
  refetch,
}: ShopifyUserGridProps) {
  if (!customers || customers.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Users className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No Shopify customers found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No customers synced from your Shopify store match your search or filter.
            Click &quot;Sync Customers&quot; to fetch the latest customer directory.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {customers.map((cust) => (
        <ShopifyUserCardCompact
          key={cust.id || cust.shopifyCustomerId}
          customer={cust}
          shopDomain={shopDomain}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default ShopifyUserGrid;
