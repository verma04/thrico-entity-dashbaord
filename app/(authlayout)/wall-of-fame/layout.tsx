"use client";

import * as React from "react";
import { Trophy, Settings, Users, FolderTree } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";

function WallOfFameLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "analytics",
      label: "Analytics",
      icon: <Trophy className="h-4 w-4" />,
      href: "/wall-of-fame",
    },
    {
      key: "all",
      label: "All Entries",
      icon: <Users className="h-4 w-4" />,
      href: "/wall-of-fame/all",
    },
    {
      key: "categories",
      label: "Categories",
      icon: <FolderTree className="h-4 w-4" />,
      href: "/wall-of-fame/categories",
    },
  ];

  return (
    <MenuItemsLayout active="wall-of-fame" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withModulePermission(
  WallOfFameLayout,
  "WALL_OF_FAME",
  "canRead",
);
