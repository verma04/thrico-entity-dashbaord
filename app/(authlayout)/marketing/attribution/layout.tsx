"use client";

import React, { useMemo } from "react";
import { Compass, Flag } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function AttributionReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = useMemo(
    () => [
      {
        key: "first-touch",
        label: "First-Touch Attribution",
        icon: <Compass className="h-4 w-4" />,
      },
      {
        key: "last-touch",
        label: "Last-Touch Attribution",
        icon: <Flag className="h-4 w-4" />,
      },
    ],
    []
  );

  return (
    <MenuItemsLayout
      active="marketing/attribution"
      items={items}
      hideDefaultTabs={true}
      showAdminTabs={false}
      className="mt-0 bg-transparent dark:bg-transparent border-t-0"
    >
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(AttributionReportsLayout, "NETWORK");
