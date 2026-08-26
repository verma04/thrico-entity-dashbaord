"use client";

import * as React from "react";
import { ShoppingBag, Settings, List, Images, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function ShopLayout({ children }: { children: React.ReactNode }) {
  const setShopModuleName = useModuleStore((state) => state.setShopModuleName);
  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);

  const { data: customNameData } = useGetModuleCustomName("shops");
  const fetchedName = customNameData?.getModuleCustomName;

  React.useEffect(() => {
    if (fetchedName) {
      setShopModuleName(fetchedName);
    }
  }, [fetchedName, setShopModuleName]);

  const items = [
    {
      key: "all",
      label: `All ${moduleName}`,
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "create",
      label: `Create ${singularName}`,
      icon: <Plus className="h-4 w-4" />,
    },
    {
      key: "banners",
      label: "Banners",
      icon: <Images className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="shop" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withSubscriptionCheck(
  withModulePermission(ShopLayout, "SHOP", "canRead"),
  "shop",
);
