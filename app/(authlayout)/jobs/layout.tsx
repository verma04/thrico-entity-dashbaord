"use client";
import * as React from "react";

import { List, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModulePermission } from "@/hooks/use-module-permission";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}
function JobsLayout({ children }: { children: React.ReactNode }) {
  const canCreate = useModulePermission("JOBS", "canCreate");
  const canRead = useModulePermission("JOBS", "canRead");

  const { data: customNameData } = useGetModuleCustomName("jobs");
  const fetchedName = customNameData?.getModuleCustomName;

  const setJobModuleName = useModuleStore((state) => state.setJobModuleName);
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  React.useEffect(() => {
    if (fetchedName) {
      setJobModuleName(fetchedName);
    }
  }, [fetchedName, setJobModuleName]);

  const items = React.useMemo(() => {
    return [
      {
        key: "all",
        label: `All ${moduleName}`,
        icon: <List size={18} />,
        locked: !canRead,
      },
      {
        key: "create",
        label: `Create ${singularName}`,
        icon: <Plus size={18} />,
        locked: !canCreate,
      },
      {
        key: "audit-log",
        label: "Audit Log",
        icon: <List size={18} />,
        locked: !canRead,
      },
    ];
  }, [canCreate, canRead, moduleName]);

  return (
    <>
      <MenuItemsLayout active={"jobs"} items={items}>
        {children}
      </MenuItemsLayout>
    </>
  );
}

export default withSubscriptionCheck(JobsLayout, "jobs");
