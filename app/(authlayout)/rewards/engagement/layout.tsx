"use client";

import * as React from "react";
import { Dices, RectangleHorizontal, RefreshCw } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function EngagementLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "spin-wheel",
      label: "Spin Wheel",
      icon: <Dices className="h-4 w-4" />,
      section: "Engagement",
    },
    {
      key: "scratch-card",
      label: "Scratch Card",
      icon: <RectangleHorizontal className="h-4 w-4" />,
      section: "Engagement",
    },
    {
      key: "match-win",
      label: "Match & Win",
      icon: <RefreshCw className="h-4 w-4" />,
      section: "Engagement",
    },
  ];

  return (
    <MenuItemsLayout active="rewards/engagement" items={items} hideDefaultTabs={true}>
      {children}
    </MenuItemsLayout>
  );
}

export default EngagementLayout;
