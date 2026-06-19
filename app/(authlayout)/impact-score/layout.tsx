"use client";

import * as React from "react";
import { CardContent } from "@/components/ui/card";
import {
  Layers,
  Settings,
  Shield,
  Activity,
  Users,
  BookOpen,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function ImpactScoreLayout({ children }: { children: React.ReactNode }) {
  const items = React.useMemo(() => {
    return [
      {
        key: "rules",
        label: "Rules",
        icon: <Layers className="h-4 w-4" />,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        key: "audit-log",
        label: "Audit Log",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        key: "activity-log",
        label: "Activity Log",
        icon: <Activity className="h-4 w-4" />,
      },
      {
        key: "members",
        label: "Check Score",
        icon: <Users className="h-4 w-4" />,
      },
      {
        key: "documentation",
        label: "How it works",
        icon: <BookOpen className="h-4 w-4" />,
      },
    ];
  }, []);

  return (
    <MenuItemsLayout active="impact-score" items={items} showAdminTabs={false}>
      <CardContent className="">{children}</CardContent>
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(ImpactScoreLayout, "GAMIFICATION");
