"use client";

import * as React from "react";
import {
  Coins,
  ShieldAlert,
  ScrollText,
  Activity,
  LayoutDashboard,
  History,
  Wallet,
} from "lucide-react";
import GamificationMenuLayout from "@/components/gamification/gamification-menu-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useTabOrder } from "@/hooks/use-tab-order";
import { createLayoutStore } from "@/store/create-layout-store";

const useCurrencyLayoutStore = createLayoutStore();

function CurrencyLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "dashboard",
      label: "Overview",
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
      key: "trace",
      label: "Quick Trace",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      key: "audit-log",
      label: "Audit Log",
      icon: <History className="h-4 w-4" />,
    },
    {
      key: "member-wallet",
      label: "Member Wallet",
      icon: <Wallet className="h-4 w-4" />,
    },
  ];

  const { getOrderedTabs, onReorder } = useTabOrder("CURRENCY", useCurrencyLayoutStore, items);
  const orderedItems = getOrderedTabs(items);

  return (
    <GamificationMenuLayout 
      basePath="/gamification/currency" 
      items={orderedItems}
      enableReorder={true}
      onReorder={onReorder}
    >
      {children}
    </GamificationMenuLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withSubscriptionCheck(
  withModulePermission(CurrencyLayout, "CURRENCY", "canRead"),
  "currency",
);
