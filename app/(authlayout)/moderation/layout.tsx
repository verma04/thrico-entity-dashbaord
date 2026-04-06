"use client";

import { LayoutDashboard, Ban, Link2, Flag, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function ModerationLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
      section: "System",
    },
    {
      key: "reported-content",
      label: "Reports",
      icon: <Flag className="h-4 w-4" />,
      section: "Management",
    },
    {
      key: "banned-words",
      label: "Banned Words",
      icon: <Ban className="h-4 w-4" />,
      section: "Moderation Tools",
    },
    {
      key: "blocked-links",
      label: "Blocked Links",
      icon: <Link2 className="h-4 w-4" />,
      section: "Moderation Tools",
    },
    {
      key: "settings",
      label: "Preferences",
      icon: <Settings className="h-4 w-4" />,
      section: "Management",
    },
  ];

  return (
    <MenuItemsLayout
      items={items}
      active="moderation"
      hideDefaultTabs={true}
      showAdminTabs={false}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default ModerationLayout;
