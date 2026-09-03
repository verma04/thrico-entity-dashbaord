"use client";

import * as React from "react";
import { ClipboardList, Settings, List, Plus, History, Zap } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";
import { useModulePermission } from "@/hooks/use-module-permission";

function SurveysLayout({ children }: { children: React.ReactNode }) {
  const canCreate = useModulePermission("SURVEYS", "canCreate");
  const canRead = useModulePermission("SURVEYS", "canRead");

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

  const items = React.useMemo(() => [
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
      key: "automation",
      label: "Automation",
      icon: <Zap className="h-4 w-4" />,
      locked: !canRead,
    },
    {
      key: "audit-log",
      label: "Audit Log",
      icon: <History className="h-4 w-4" />,
      locked: !canRead,
    },
  ], [canCreate, canRead, moduleName, singularName]);

  return (
    <MenuItemsLayout active="surveys" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withSubscriptionCheck(
  withModulePermission(SurveysLayout, "SURVEYS", "canRead"),
  "surveys",
);

