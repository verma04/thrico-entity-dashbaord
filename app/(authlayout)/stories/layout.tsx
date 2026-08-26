"use client";

import * as React from "react";
import { BookOpen, Settings, List } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";

function StoriesLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Stories",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="stories" items={items}>
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        {children}
      </Card>
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withModulePermission(
  StoriesLayout,
  "STORIES",
  "canRead",
);
