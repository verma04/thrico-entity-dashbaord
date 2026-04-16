"use client";

import * as React from "react";
import { LayoutGrid, ListOrdered } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function FeedSettingsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "visibility",
      label: "Visibility",
      icon: <LayoutGrid className="h-4 w-4" />,
    },
    {
      key: "ordering",
      label: "Ordering",
      icon: <ListOrdered className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="feed/settings" items={items} hideDefaultTabs={true}>
      {children}
    </MenuItemsLayout>
  );
}

export default FeedSettingsLayout;
