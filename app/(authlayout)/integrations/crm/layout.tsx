"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  GitMerge,
  ShieldCheck,
  FileText,
  Settings,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

export default function CRMIntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = [
    {
      key: "members",
      label: "Members",
      icon: <Users className="h-4 w-4" />,
    },
    {
      key: "mappings",
      label: "Field Mappings",
      icon: <GitMerge className="h-4 w-4" />,
    },
    {
      key: "rules",
      label: "Community Rules",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      key: "logs",
      label: "Sync Logs",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <MenuItemsLayout
      active="integrations/crm"
      items={items}
      showAdminTabs={false}
    >
      {children}
    </MenuItemsLayout>
  );
}
