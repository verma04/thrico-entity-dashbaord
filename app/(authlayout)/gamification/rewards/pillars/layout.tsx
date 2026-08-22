"use client";

import * as React from "react";
import {
  Layers,
  Coins,
  ShoppingBag,
  Gift,
  LayoutDashboard,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { useTabOrder } from "@/hooks/use-tab-order";
import { createLayoutStore } from "@/store/create-layout-store";

const usePillarsLayoutStore = createLayoutStore();

export default function RewardPillarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = [
    {
      key: "",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "manual",
      label: "Manual / Internal",
      icon: <Coins className="h-4 w-4" />,
    },
    {
      key: "store",
      label: "E-Commerce",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      key: "gift-cards",
      label: "Digital Gift Cards",
      icon: <Gift className="h-4 w-4" />,
    },
  ];

  const { getOrderedTabs, onReorder } = useTabOrder(
    "REWARD_PILLARS",
    usePillarsLayoutStore,
    items,
  );
  const orderedItems = getOrderedTabs(items);

  return (
    <MenuItemsLayout
      active="gamification/rewards/pillars"
      items={orderedItems}
      hideDefaultTabs={true}
      enableReorder={true}
      onReorder={onReorder}
      className="p-0"
    >
      {children}
    </MenuItemsLayout>
  );
}
