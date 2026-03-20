"use client";

import * as React from "react";
import { Coins, ShieldAlert, ScrollText, List, LayoutDashboard, History } from "lucide-react";
import GamificationMenuLayout from "@/components/gamification/gamification-menu-layout";

function CurrencyLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "economics",
      label: "Economics",
      icon: <Coins className="h-4 w-4" />,
    },
    {
      key: "risk",
      label: "Anti-Abuse",
      icon: <ShieldAlert className="h-4 w-4" />,
    },
    {
      key: "redemption",
      label: "Redemption Logic",
      icon: <ScrollText className="h-4 w-4" />,
    },
    {
      key: "trace",
      label: "Quick Trace",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "audit-log",
      label: "Audit Log",
      icon: <History className="h-4 w-4" />,
    },
  ];

  // Note: MenuItemsLayout already includes Dashboard and Audit Log by default
  // But we need to make sure the "active" prop and key mapping align.
  // MenuItemsLayout active="settings/currency" means:
  // dashboard -> /settings/currency
  // audit-log -> /settings/currency/audit-log
  // economics -> /settings/currency/economics

  return (
    <GamificationMenuLayout basePath="/currency" items={items}>
      {children}
    </GamificationMenuLayout>
  );
}

export default CurrencyLayout;
