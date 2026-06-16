"use client";

import * as React from "react";
import { List, FolderTree, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function ForumsLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const items = [
    {
      key: "all",
      label: `All ${moduleName}`,
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
