"use client";

import * as React from "react";
import { List, Tag, Plus, Network } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useGetModuleCustomName } from "@/graphql/actions";
import { useModuleStore } from "@/store/useModuleStore";

function EventsLayout({ children }: { children: React.ReactNode }) {
  const setEventModuleName = useModuleStore((state) => state.setEventModuleName);
  useGetModuleCustomName("events", setEventModuleName);

  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

  const items = [
    {
      key: "all",
      label: `All ${moduleName}`,
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "categories",
      label: "Categories",
      icon: <Tag className="h-4 w-4" />,
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
    <MenuItemsLayout active="events" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(EventsLayout, "events");
