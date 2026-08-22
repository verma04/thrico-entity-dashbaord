"use client";

import * as React from "react";
import {
  Dices,
  RectangleHorizontal,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { useModuleStore } from "@/store/useModuleStore";
import { useTabOrder } from "@/hooks/use-tab-order";
import { createLayoutStore } from "@/store/create-layout-store";

const useEngagementLayoutStore = createLayoutStore();

export default function EngagementGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gamesCenterModuleName = useModuleStore(
    (state) => state.gamesCenterModuleName,
  );

  const items = [
    {
      key: "",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "spin-wheel",
      label: "Spin Wheel",
      icon: <Dices className="h-4 w-4" />,
    },
    {
      key: "scratch-card",
      label: "Scratch Card",
      icon: <RectangleHorizontal className="h-4 w-4" />,
    },
    {
      key: "match-win",
      label: "Match & Win",
      icon: <RefreshCw className="h-4 w-4" />,
    },
  ];

  const { getOrderedTabs, onReorder } = useTabOrder(
    "ENGAGEMENT_GAMES",
    useEngagementLayoutStore,
    items,
  );
  const orderedItems = getOrderedTabs(items);

  return (
    <MenuItemsLayout
      active="gamification/rewards/engagement-games"
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
