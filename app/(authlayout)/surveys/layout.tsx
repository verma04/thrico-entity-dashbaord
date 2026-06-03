"use client";

import * as React from "react";
import { ClipboardList, Settings, List, Plus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function SurveysLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Surveys",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "create",
      label: "Create Survey",
      icon: <Plus className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="surveys" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(SurveysLayout, "surveys");
