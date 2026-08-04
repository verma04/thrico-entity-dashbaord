"use client";

import * as React from "react";
import { ClipboardList, Settings, List, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function SurveysLayout({ children }: { children: React.ReactNode }) {
  const setSurveyModuleName = useModuleStore(
    (state) => state.setSurveyModuleName,
  );
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);

  const { data: customNameData } = useGetModuleCustomName("surveys");
  const fetchedName = customNameData?.getModuleCustomName;

  React.useEffect(() => {
    if (fetchedName) {
      setSurveyModuleName(fetchedName);
    }
  }, [fetchedName, setSurveyModuleName]);

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
  ];

  return (
    <MenuItemsLayout active="surveys" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(SurveysLayout, "surveys");
