import React from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShopHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
}

export function ShopHeader({
  search,
  onSearchChange,
  onAddProduct,
}: ShopHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your shop products and variants.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAddProduct}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
