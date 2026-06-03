"use client";
import * as React from "react";

import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Command } from "lucide-react";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function RootLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "Feed",
      icon: <Command className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <MenuItemsLayout active="feed" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(RootLayout, "feed");
