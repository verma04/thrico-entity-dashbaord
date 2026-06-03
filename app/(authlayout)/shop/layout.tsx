"use client";

import * as React from "react";
import { ShoppingBag, Settings, List, Images, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

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
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(ShopLayout, "shop");
