"use client";

import * as React from "react";
import { Video, Settings, List, PlayCircle } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";

function MomentsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Moments",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "create",
      label: "Create Moment",
      icon: <PlayCircle className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="moments" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default MomentsLayout;
