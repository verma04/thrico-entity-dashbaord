"use client";

import * as React from "react";
import { List, Tag, CalendarPlus } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function EventsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Events",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "categories",
      label: "Categories",
      icon: <Tag className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="events" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default EventsLayout;
