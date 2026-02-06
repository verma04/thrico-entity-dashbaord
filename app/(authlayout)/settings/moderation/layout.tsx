import { LayoutDashboard, Ban, Link2, Flag, Settings } from "lucide-react";
import ModerationMenuLayout from "@/components/moderation/moderation-menu-layout";

function ModerationLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      key: "banned-words",
      label: "Banned Words",
      icon: <Ban className="h-4 w-4" />,
    },
    {
      key: "blocked-links",
      label: "Blocked Links",
      icon: <Link2 className="h-4 w-4" />,
    },
    {
      key: "reported-content",
      label: "Reported Content",
      icon: <Flag className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return <ModerationMenuLayout items={items}>{children}</ModerationMenuLayout>;
}

export default ModerationLayout;
