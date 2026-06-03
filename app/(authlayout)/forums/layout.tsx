"use client";

import * as React from "react";
import { List, FolderTree, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

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
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(ForumsLayout, "forums");
