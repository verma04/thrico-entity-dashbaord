"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Plus, Building2 } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function MembersLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "Members",
      icon: <Users className="h-4 w-4" />,
      href: "/members",
    },
    {
      key: "create",
      label: "Create Member",
      icon: <Plus className="h-4 w-4" />,
      href: "/members/create",
    },
    {
      key: "industries",
      label: "Industries",
      icon: <Building2 className="h-4 w-4" />,
      href: "/members/industries",
    },
    {
      key: "referrals",
      label: "Referrals",
      icon: <Users className="h-4 w-4" />,
      href: "/members/referrals",
    },
  ];

  return (
    <MenuItemsLayout active="members" items={items}>
      <CardContent className="">{children}</CardContent>
    </MenuItemsLayout>
  );
}

export default MembersLayout;
