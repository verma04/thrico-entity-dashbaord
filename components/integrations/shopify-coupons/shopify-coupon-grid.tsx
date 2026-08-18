"use client";

import React from "react";
import { Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ShopifyCouponCardCompact } from "./shopify-coupon-card-compact";

interface ShopifyCouponGridProps {
  coupons: any[];
  shopDomain?: string;
  refetch?: () => void;
}

export function ShopifyCouponGrid({
  coupons,
  shopDomain,
  refetch,
}: ShopifyCouponGridProps) {
  if (!coupons || coupons.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Tag className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No Shopify coupons found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No discounts or coupons synced from your store match your criteria.
            Create discount codes in Shopify or click &quot;Refresh&quot; to fetch latest coupons.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {coupons.map((coupon) => (
        <ShopifyCouponCardCompact
          key={coupon.id}
          coupon={coupon}
          shopDomain={shopDomain}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default ShopifyCouponGrid;
