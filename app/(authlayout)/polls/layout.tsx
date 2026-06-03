"use client";

import * as React from "react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { CheckCircle, Plus, User, BarChart3, List } from "lucide-react";
import NewPoll from "@/components/polls/new-poll";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function PollsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "all",
      label: "All Polls",
      icon: <List className="h-4 w-4" />,
      path: "/polls/all",
    },
    {
      key: "/create",
      label: "Create Poll",
      icon: <Plus className="h-4 w-4" />,
      path: "/polls/create",
    },
  ];

  return (
    <MenuItemsLayout showAdminTabs={false} active="polls" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(PollsLayout, "polls");
