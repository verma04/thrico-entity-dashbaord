"use client";

import * as React from "react";
import { Video, List, PlayCircle } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useGetModuleCustomName, useEntitySettings } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function MomentsLayout({ children }: { children: React.ReactNode }) {
  const setMomentModuleName = useModuleStore(
    (state) => state.setMomentModuleName,
  );
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);

  const { data: customNameData } = useGetModuleCustomName("moments");
  const fetchedName = customNameData?.getModuleCustomName;

  const { data: settingsData } = useEntitySettings();
  const entitySettings = settingsData?.getEntitySettings;
  const customCta = entitySettings?.momentsCtaName;
  const tabNames =
    (entitySettings?.momentsTabNames as Record<string, string>) || {};
  const customCtaPath =
    entitySettings?.momentsCtaPath ||
    tabNames["__cta_path__"] ||
    "/moments/create";

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
      key: "campaigns",
      label: "Campaign Manager",
      icon: <Video className="h-4 w-4" />,
    },
    {
      key: "create",
      label: customCta || `Create ${singularName}`,
      href: "/moments/create",
      icon: <PlayCircle className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="moments" items={items} showAdminTabs>
      {children}
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withSubscriptionCheck(
  withModulePermission(MomentsLayout, "MOMENTS", "canRead"),
  "moments",
);
