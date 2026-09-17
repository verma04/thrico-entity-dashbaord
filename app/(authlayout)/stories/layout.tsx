"use client";

import * as React from "react";
import { List } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function StoriesLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Stories",
      icon: <List className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout showAdminTabs={false} active="stories" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withModulePermission(
  StoriesLayout,
  "STORIES",
  "canRead",
);
