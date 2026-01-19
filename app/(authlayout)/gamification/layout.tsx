import {
  Trophy,
  Swords,
  Medal,
  BarChart2,
  Coins,
  Crown,
  Settings,
  LayoutDashboard,
  History,
} from "lucide-react";
import GamificationMenuLayout from "@/components/gamification/gamification-menu-layout";

function GamificationLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
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
  ];

  return (
    <GamificationMenuLayout items={items}>{children}</GamificationMenuLayout>
  );
}

export default GamificationLayout;
