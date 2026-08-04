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
} from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";

function RewardsLayout({ children }: { children: React.ReactNode }) {
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName);
  const rewardsSingularName = useModuleStore((state) => state.rewardsSingularName);
  const items = [
    {
      key: "",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      key: "coupons",
      label: `${rewardsModuleName} & Vouchers`,
      icon: <Ticket className="h-4 w-4" />,
      section: "Manage",
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
    {
      key: "coupons/create",
      label: `Create ${rewardsSingularName}`,
      icon: <Plus className="h-4 w-4" />,
      section: "Actions",
    },
  ];

  return (
    <MenuItemsLayout
      className="p-0"
      active="gamification/rewards"
      items={items}
      hideDefaultTabs={true}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default withSubscriptionCheck(RewardsLayout, "rewards");
