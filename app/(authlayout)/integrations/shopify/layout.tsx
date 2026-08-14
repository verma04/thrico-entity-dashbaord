"use client";

import * as React from "react";
import { Users, Package, Gamepad2, LayoutDashboard, ShoppingBag, ShoppingCart } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

export default function ShopifyIntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = [
    {
      key: "user",
      label: "Users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      key: "product",
      label: "Products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      key: "gamification",
      label: "Gamification",
      icon: <Gamepad2 className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout
      active="integrations/shopify"
      items={items}
      showAdminTabs={false}
    >
      {children}
    </MenuItemsLayout>
  );
}
