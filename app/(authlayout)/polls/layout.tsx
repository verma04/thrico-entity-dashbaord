"use client";

import * as React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { CheckCircle, Plus, User, BarChart3, List } from "lucide-react";
import NewPoll from "@/components/polls/new-poll";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";

function PollsLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const singularName = useModuleStore((state) => state.pollSingularName);

  const items = [
    {
      key: "all",
      label: `All ${moduleName}`,
      icon: <List className="h-4 w-4" />,
      path: "/polls/all",
    },
    {
      key: "/create",
      label: `Create ${singularName}`,
      icon: <Plus className="h-4 w-4" />,
      path: "/polls/create",
    },
  ];

  return (
    <MenuItemsLayout showAdminTabs={false} active="polls" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(PollsLayout, "polls");
