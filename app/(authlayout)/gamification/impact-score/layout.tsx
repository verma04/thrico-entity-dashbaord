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

import { useTabOrder } from "@/hooks/use-tab-order";
import { createLayoutStore } from "@/store/create-layout-store";

const useImpactScoreLayoutStore = createLayoutStore();

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
        label: "Member Scores",
        icon: <Users className="h-4 w-4" />,
      },
      {
        key: "documentation",
        label: "How it works",
        icon: <BookOpen className="h-4 w-4" />,
      },
    ];
  }, []);

  const { getOrderedTabs, onReorder } = useTabOrder("IMPACT_SCORE", useImpactScoreLayoutStore, items);
  const orderedItems = getOrderedTabs(items);

  return (
    <MenuItemsLayout
      active="gamification/impact-score"
      items={orderedItems}
      showAdminTabs={false}
      enableReorder={true}
      onReorder={onReorder}
    >
      <CardContent className="">{children}</CardContent>
    </MenuItemsLayout>
  );
}

import { withModulePermission } from "@/components/hoc/with-module-permission";

export default withSubscriptionCheck(
  withModulePermission(ImpactScoreLayout, "IMPACT_SCORE", "canRead"),
  "GAMIFICATION",
);
