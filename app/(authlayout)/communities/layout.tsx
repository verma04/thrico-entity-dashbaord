"use client";

import * as React from "react";
import { List, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function CommunitiesLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Communities",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "create",
      label: "Create Community",
      icon: <Plus className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="communities" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(CommunitiesLayout, "communities");
