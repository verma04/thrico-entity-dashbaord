"use client";

import * as React from "react";
import { Tag, Settings, List, FolderTree, Plus, Network } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";

function OffersLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);

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
    {
      key: "graph",
      label: "Graph View",
      icon: <Network className="h-4 w-4" />,
    },
    {
      key: "create",
      label: `Create ${singularName}`,
      icon: <Plus className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="offers" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withSubscriptionCheck(
  withModulePermission(OffersLayout, "OFFERS", "canRead"),
  "offers",
);
