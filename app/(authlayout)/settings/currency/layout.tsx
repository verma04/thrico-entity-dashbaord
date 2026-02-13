"use client";

import * as React from "react";
import { Coins, ShieldAlert, ScrollText, List } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function CurrencyLayout({ children }: { children: React.ReactNode }) {
  const items = [
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
  ];

  // Note: MenuItemsLayout already includes Dashboard and Audit Log by default
  // But we need to make sure the "active" prop and key mapping align.
  // MenuItemsLayout active="settings/currency" means:
  // dashboard -> /settings/currency
  // audit-log -> /settings/currency/audit-log
  // economics -> /settings/currency/economics

  return (
    <MenuItemsLayout active="settings/currency" items={items}>
      {children}
    </MenuItemsLayout>
  );
}

export default CurrencyLayout;
