"use client";

import {
  Trophy,
  Medal,
  BarChart2,
  Coins,
  Crown,
  Settings,
  LayoutDashboard,
  History,
  Flame,
  Swords,
} from "lucide-react";
import GamificationMenuLayout from "@/components/gamification/gamification-menu-layout";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useTabOrder } from "@/hooks/use-tab-order";
import { createLayoutStore } from "@/store/create-layout-store";

const usePointsAndBadgesStore = createLayoutStore();

function GamificationLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "dashboard",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "points",
      label: "Points",
      icon: <Coins className="h-4 w-4" />,
    },
    {
      key: "badges",
      label: "Badges",
      icon: <Medal className="h-4 w-4" />,
    },
    {
      key: "ranks",
      label: "Ranks",
      icon: <Crown className="h-4 w-4" />,
    },
    {
      key: "leaderboard",
      label: "Leaderboard",
      icon: <BarChart2 className="h-4 w-4" />,
    },
    {
      key: "activity-log",
      label: "Activity Log",
      icon: <History className="h-4 w-4" />,
    },

    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const { getOrderedTabs, onReorder } = useTabOrder("POINTS_AND_BADGES", usePointsAndBadgesStore, items);
  const orderedItems = getOrderedTabs(items);

  return (
    <GamificationMenuLayout
      basePath="/gamification/points-and-badges"
      items={orderedItems}
      enableReorder={true}
      onReorder={onReorder}
    >
      {children}
    </GamificationMenuLayout>
  );
}

export default withSubscriptionCheck(GamificationLayout, "gamification");
