"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Ticket,
  Package,
  History,
  BarChart3,
  ShieldAlert,
  Dices,
  RectangleHorizontal,
  RefreshCw,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function RewardsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "vouchers",
      label: "Vouchers",
      icon: <Ticket className="h-4 w-4" />,
      section: "Modules",
    },
    {
      key: "engagement/spin-wheel",
      label: "Engagement",
      icon: <Dices className="h-4 w-4" />,
      section: "Modules",
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      section: "Management",
    },
    {
      key: "fraud",
      label: "Fraud",
      icon: <ShieldAlert className="h-4 w-4" />,
      section: "Management",
    },
  ];

  return (
    <MenuItemsLayout active="rewards" items={items} showAdminTabs={false}>
      {children}
    </MenuItemsLayout>
  );
}

export default RewardsLayout;
