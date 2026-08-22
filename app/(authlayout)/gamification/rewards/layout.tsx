"use client";

import * as React from "react";
import {
  Ticket,
  History,
  LayoutDashboard,
  ShieldAlert,
  Plus,
  Network,
  BarChart3,
  Gamepad2,
  Dices,
  RectangleHorizontal,
  RefreshCw,
  Layers,
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";

import { useTabOrder } from "@/hooks/use-tab-order";
import { createLayoutStore } from "@/store/create-layout-store";

const useRewardsLayoutStore = createLayoutStore();

function RewardsLayout({ children }: { children: React.ReactNode }) {
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName);
  const rewardsSingularName = useModuleStore(
    (state) => state.rewardsSingularName,
  );
  const items = [
    {
      key: "",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "pillars",
      label: "Reward Pillars",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      key: "coupons",
      label: `${rewardsModuleName} & Vouchers`,
      icon: <Ticket className="h-4 w-4" />,
      section: "Manage",
    },
    {
      key: "engagement-games",
      label: "Interactions",
      icon: <Gamepad2 className="h-4 w-4" />,
      section: "Games",
    },
    {
      key: "redemptions",
      label: "Redemptions",
      icon: <History className="h-4 w-4" />,
      section: "Reports",
    },
    {
      key: "fraud",
      label: "Fraud Control",
      icon: <ShieldAlert className="h-4 w-4" />,
      section: "Reports",
    },
    {
      key: "settings",
      label: "Partner Network",
      icon: <Network className="h-4 w-4" />,
      section: "Partnerships",
    },
  ];

  const { getOrderedTabs, onReorder } = useTabOrder(
    "REWARDS",
    useRewardsLayoutStore,
    items,
  );
  const orderedItems = getOrderedTabs(items);

  return (
    <MenuItemsLayout
      className="p-0"
      active="gamification/rewards"
      items={orderedItems}
      hideDefaultTabs={true}
      enableReorder={true}
      onReorder={onReorder}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(RewardsLayout, "rewards");
