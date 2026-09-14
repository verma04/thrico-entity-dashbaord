"use client";

import * as React from "react";
import { List, FolderTree, Settings, Plus, ShieldAlert } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function ForumsLayout({ children }: { children: React.ReactNode }) {
  const canCreate = useModulePermission("FORUMS", "canCreate");
  const canRead = useModulePermission("FORUMS", "canRead");

  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const items = React.useMemo(() => {
    return [
      {
        key: "all",
        label: `All ${moduleName}`,
        icon: <List className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "categories",
        label: "Categories",
        icon: <FolderTree className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "create",
        label: `Create ${singularName}`,
        icon: <Plus className="h-4 w-4" />,
        locked: !canCreate,
      },
      {
        key: "reports",
        label: "Reported Items",
        icon: <ShieldAlert className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        locked: !canRead,
      },
    ];
  }, [canCreate, canRead, moduleName, singularName]);

  return (
    <MenuItemsLayout active="forums" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withSubscriptionCheck(
  withModulePermission(ForumsLayout, "FORUMS", "canRead"),
  "forums",
);
