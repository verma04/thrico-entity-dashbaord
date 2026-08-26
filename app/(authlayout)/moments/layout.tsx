"use client";

import * as React from "react";
import { Video, Settings, List, PlayCircle } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function MomentsLayout({ children }: { children: React.ReactNode }) {
  const setMomentModuleName = useModuleStore((state) => state.setMomentModuleName);
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);

  const { data: customNameData } = useGetModuleCustomName("moments");
  const fetchedName = customNameData?.getModuleCustomName;

  React.useEffect(() => {
    if (fetchedName) {
      setMomentModuleName(fetchedName);
    }
  }, [fetchedName, setMomentModuleName]);

  const items = [
    {
      key: "all",
      label: `All ${moduleName}`,
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "create",
      label: `Create ${singularName}`,
      icon: <PlayCircle className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="moments" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withSubscriptionCheck(
  withModulePermission(MomentsLayout, "MOMENTS", "canRead"),
  "moments",
);
