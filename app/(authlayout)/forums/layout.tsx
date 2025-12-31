"use client";

import * as React from "react";
import { List, FolderTree, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";

function ForumsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Discussion Forum",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "categories",
      label: "Categories",
      icon: <FolderTree className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="forums" items={items}>
      <Card className="border-0 shadow-sm">
        <div className="p-6">{children}</div>
      </Card>
    </MenuItemsLayout>
  );
}

export default ForumsLayout;
