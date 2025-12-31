"use client";

import * as React from "react";
import { Trophy } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function GamificationLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "Gamification",
      icon: <Trophy className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="gamification" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default GamificationLayout;
