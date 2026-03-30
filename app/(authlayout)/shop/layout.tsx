"use client";

import * as React from "react";
import { ShoppingBag, Settings, List, Images, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";

function ShopLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Products",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "create",
      label: "Create Product",
      icon: <Plus className="h-4 w-4" />,
    },
    {
      key: "banners",
      label: "Banners",
      icon: <Images className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="shop" items={items}>
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        {children}
      </Card>
    </MenuItemsLayout>
  );
}

export default ShopLayout;
