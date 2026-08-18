"use client";

import * as React from "react";
import { LayoutDashboard, Radio, History, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function FeedRootLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "all",
      label: "Community Feed",
      icon: <Radio className="h-4 w-4" />,
    },
    {
      key: "reports",
      label: "Reports",
      icon: <History className="h-4 w-4" />,
    },
    {
      key: "settings/visibility",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="feed" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(FeedRootLayout, "feed");
