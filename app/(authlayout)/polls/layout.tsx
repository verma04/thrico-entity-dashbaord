"use client";

import * as React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { CheckCircle, Plus, User } from "lucide-react";
import NewPoll from "@/components/polls/new-poll";

function PollsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "/create",
      label: "Create Poll",
      icon: <Plus className="h-4 w-4" />,
      path: "/polls/create",
    },
    {
      key: "admin",
      label: "By Admin",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      key: "user",
      label: "By User",
      icon: <User className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout showAdminTabs={false} active="polls" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default PollsLayout;
