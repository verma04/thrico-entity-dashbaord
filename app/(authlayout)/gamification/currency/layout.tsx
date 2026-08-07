"use client";

import * as React from "react";
import {
  Coins,
  ShieldAlert,
  ScrollText,
  Activity,
  LayoutDashboard,
  History,
} from "lucide-react";
import GamificationMenuLayout from "@/components/gamification/gamification-menu-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

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
  ];

  return (
    <GamificationMenuLayout basePath="/gamification/currency" items={items}>
      {children}
    </GamificationMenuLayout>
  );
}

export default withSubscriptionCheck(CurrencyLayout, "currency");
