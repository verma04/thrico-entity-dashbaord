"use client";

import * as React from "react";
import { List, Plus, History, Network } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";

import { useModuleStore } from "@/store/useModuleStore";

function CommunitiesLayout({ children }: { children: React.ReactNode }) {
  const canCreate = useModulePermission("COMMUNITIES", "canCreate");
  const canRead = useModulePermission("COMMUNITIES", "canRead");

  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const items = React.useMemo(() => {
    return [
      {
        key: "all",
        label: `All ${moduleName}`,
        icon: <List className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "create",
        label: `Create ${singularName}`,
        icon: <Plus className="h-4 w-4" />,
        locked: !canCreate,
      },
      {
        key: "audit-log",
        label: "Audit Log",
        icon: <History className="h-4 w-4" />,
        locked: !canRead,
      },
      {
        key: "graph",
        label: `${moduleName} Graph`,
        icon: <Network className="h-4 w-4" />,
        locked: !canRead,
      },
    ];
  }, [canCreate, canRead, moduleName]);

  return (
    <MenuItemsLayout active="communities" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(CommunitiesLayout, "communities");
