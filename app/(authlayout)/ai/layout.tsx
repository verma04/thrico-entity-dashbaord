"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldAlert, BarChart3, Settings, MessageSquare, Sparkles } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function AILayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFilterStudio = pathname?.startsWith("/ai/filter-studio");

  const defaultItems = React.useMemo(() => {
    return [
      {
        key: "dashboard",
        label: "Overview",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        key: "filter-studio",
        label: "AR Filter Studio",
        icon: <Sparkles className="h-4 w-4" />,
        href: "/ai/filter-studio",
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
      hideTabs={isFilterStudio}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default AILayout;
