"use client";

import * as React from "react";
import { List, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { Card } from "@/components/ui/card";

function EventsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Events",
      icon: <List className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="events" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default EventsLayout;
