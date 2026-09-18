"use client";

import * as React from "react";
import { LayoutDashboard, ShieldAlert, Bot, BarChart3, Settings, MessageSquare } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function AILayout({ children }: { children: React.ReactNode }) {
  const defaultItems = React.useMemo(() => {
    return [
      {
        key: "dashboard",
        label: "Overview",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        key: "chat",
        label: "Chat",
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        key: "moderation",
        label: "Moderation",
        icon: <ShieldAlert className="h-4 w-4" />,
      },
      {
        key: "usage",
        label: "Usage & Billing",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ];
  }, []);

  return (
    <MenuItemsLayout
      active="ai"
      items={defaultItems}
      hideDefaultTabs={true}
      showAdminTabs={false}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default AILayout;
