"use client";
import * as React from "react";

import { List, Plus, History } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function ListingLayout({ children }: { children: React.ReactNode }) {
  const canCreate = useModulePermission("LISTING", "canCreate");
  const canRead = useModulePermission("LISTING", "canRead");

  const { data: customNameData } = useGetModuleCustomName("listings");
  const fetchedName = customNameData?.getModuleCustomName;

  const setListingModuleName = useModuleStore((state) => state.setListingModuleName);
  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);

  React.useEffect(() => {
    if (fetchedName) {
      setListingModuleName(fetchedName);
    }
  }, [fetchedName, setListingModuleName]);

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
        key: "audit-logs",
        label: "Audit Log",
        icon: <History className="h-4 w-4" />,
        locked: !canRead,
      },
    ];
  }, [canCreate, canRead, moduleName, singularName]);

  return (
    <MenuItemsLayout active={"listing"} items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(ListingLayout, "listing");
