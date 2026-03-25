"use client";

import * as React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { CheckCircle, User } from "lucide-react";
import NewPoll from "@/components/polls/new-poll";

function PollsLayout({ children }: { children: React.ReactNode }) {
  const items = [
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
      <div className="flex items-center justify-end mb-4">
        <NewPoll />
      </div>
      {children}
    </MenuItemsLayout>
  );
}

export default PollsLayout;
