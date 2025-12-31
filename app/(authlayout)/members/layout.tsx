"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function MembersLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "Members",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout active="members" items={items}>
      <CardContent className="pt-6">{children}</CardContent>
    </MenuItemsLayout>
  );
}

export default MembersLayout;
