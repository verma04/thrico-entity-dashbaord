"use client";

import * as React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { BarChart3, List, Settings } from "lucide-react";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function OpportunitiesLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "Manage Opportunities",
      icon: <List className="h-4 w-4" />,
      path: "/opportunities/all",
    },
    {
      key: "graphs",
      label: "Graph View",
      icon: <BarChart3 className="h-4 w-4" />,
      path: "/opportunities/graph",
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      path: "/opportunities/settings",
    },
  ];

  return (
    <MenuItemsLayout showAdminTabs={false} active="opportunities" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(OpportunitiesLayout, "opportunities");
