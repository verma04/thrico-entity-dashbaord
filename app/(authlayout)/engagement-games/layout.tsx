"use client";

import * as React from "react";
import {
  Dices,
  RectangleHorizontal,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";

function EngagementLayout({ children }: { children: React.ReactNode }) {
  const customName = useModuleStore((state) => state.gamesCenterModuleName);

  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      section: customName,
    },
    {
      key: "spin-wheel",
      label: "Spin Wheel",
      icon: <Dices className="h-4 w-4" />,
      section: customName,
    },
    {
      key: "scratch-card",
      label: "Scratch Card",
      icon: <RectangleHorizontal className="h-4 w-4" />,
      section: customName,
    },
    {
      key: "match-win",
      label: "Match & Win",
      icon: <RefreshCw className="h-4 w-4" />,
      section: customName,
    },
  ];

  return (
    <MenuItemsLayout
      active="engagement-games"
      items={items}
      hideDefaultTabs={true}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(EngagementLayout, "engagement-games");
