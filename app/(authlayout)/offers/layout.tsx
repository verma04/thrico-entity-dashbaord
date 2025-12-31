"use client";

import * as React from "react";
import { Tag, Settings, List, FolderTree } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function OffersLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Offers",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "categories",
      label: "Categories",
      icon: <FolderTree className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="offers" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default OffersLayout;
