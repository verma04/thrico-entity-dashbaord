"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCardCompact } from "./product-card-compact";
import { useModuleStore } from "@/store/useModuleStore";

interface ProductGridProps {
  products: any[];
  refetch?: () => void;
}

export function ProductGrid({ products, refetch }: ProductGridProps) {
  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);

  if (!products || products.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No {moduleName.toLowerCase()} found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No {moduleName.toLowerCase()} match your current filter or search criteria.
            Try adjusting filters or add a new {singularName.toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {products.map((product) => (
        <ProductCardCompact
          key={product.id}
          product={product}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
