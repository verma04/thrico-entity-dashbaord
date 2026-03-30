import { LayoutDashboard, Ban, Link2, Flag, Settings } from "lucide-react";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

function ModerationLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "dashboard",
      label: "Overview",
      icon: <LayoutDashboard />,
    },
    {
      key: "banned-words",
      label: "Banned Words",
      icon: <Ban />,
    },
    {
      key: "blocked-links",
      label: "Blocked Links",
      icon: <Link2 />,
    },
    {
      key: "reported-content",
      label: "Reports",
      icon: <Flag />,
    },
    {
      key: "settings",
      label: "Preferences",
      icon: <Settings />,
    },
  ];

  return (
    <MenuItemsLayout 
      items={items} 
      active="settings/moderation" 
      hideDefaultTabs={true}
      showAdminTabs={false}
    >
      {children}
    </MenuItemsLayout>
  );
}

export default ModerationLayout;
