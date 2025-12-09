import {
  Settings,
  CreditCard,
  User2,
  BellDotIcon,
  PaintBucketIcon,
  Rocket,
  LogOutIcon,
  GitPullRequest,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

interface UserDetailsProps {
  name?: string;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ name = "Admin" }) => {
  return <span className="font-medium">{name}</span>;
};

export const UserAvatar: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-xs font-bold">
      A
    </div>
  );
};

const menuLink = (href: string, label: string) => (
  <Link href={href} className="hover:text-sidebar-foreground transition-colors">
    {label}
  </Link>
);

export const profileMenuItems = [
  {
    key: "sub1",
    icon: <Settings size={18} />,
    label: "Admin Settings",
    children: [
      {
        key: "system-activity",
        label: "System Activity",
        icon: <GitPullRequest size={18} />,
      },
      {
        key: "plan",
        label: menuLink("/settings/subscription", "Plan Overview"),
        icon: <CreditCard size={18} />,
      },
      {
        type: "divider",
      },
      {
        key: "settings",
        label: menuLink("/settings", "All Settings"),
        icon: <Settings size={18} />,
      },
    ],
  },
  {
    key: "user",
    icon: <UserAvatar />,
    label: <UserDetails />,
    children: [
      {
        key: "profile",
        icon: <User2 size={18} />,
        label: menuLink("/settings", "Your profile"),
      },
      {
        key: "notifications",
        icon: <BellDotIcon size={18} />,
        label: "Activity & notifications",
      },
      {
        type: "divider",
      },
      {
        key: "theme",
        icon: <PaintBucketIcon size={18} />,
        label: menuLink("/theme", "Theme"),
      },
      {
        type: "divider",
      },
      {
        key: "upgrade",
        icon: <Rocket size={18} />,
        label: menuLink("/settings/subscription", "Upgrade Plan"),
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        icon: <LogOutIcon size={18} />,
        label: menuLink("/logout", "logout"),
      },
    ],
  },
];
