import Link from "next/link";
import {
  Home,
  BarChartBigIcon as ChartBarIcon,
  Users,
  PaintbrushVerticalIcon,
  Settings,
  GitPullRequest,
  CreditCard,
  User2,
  BellDotIcon,
  PaintBucketIcon,
  Rocket,
  LogOutIcon,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuLink = (href: string, text: string) => (
  <Link
    href={href}
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    {text}
  </Link>
);

export const main = [
  {
    key: "home",
    label: "Home",
    path: "/",
    icon: <Home size={18} />,
  },
  {
    key: "feed",
    label: "Feed",
    path: "/feed",
    icon: <ChartBarIcon size={18} />,
  },
  {
    key: "members",
    label: "Memberships",
    path: "/members",
    icon: <Users size={18} />,
  },
];

export const settings = [
  {
    key: "cms",
    label: "Manage Website",
    path: "/app-layout/pages",
    icon: <PaintbrushVerticalIcon size={18} />,
  },
];

export const extendedItems = [
  {
    key: "forums",
    label: "Forums",
    path: "/forums",
    icon: <MessageSquare size={18} />,
    children: [
      { key: "all-forums", label: "Manage Forums", path: "/forums" },
      { key: "forums-settings", label: "Settings", path: "/forums/settings" },
    ],
  },
  {
    key: "polls",
    label: "Polls",
    path: "/polls",
    icon: <BarChart3 size={18} />,
    children: [
      { key: "all-polls", label: "Manage Polls", path: "/polls" },
      { key: "polls-settings", label: "Settings", path: "/polls/settings" },
    ],
  },
  {
    key: "communities",
    label: "Communities",
    path: "/communities",
    icon: <Users size={18} />,
    children: [
      {
        key: "communities-approval",
        label: "Manage Approvals",
        path: "/communities/all",
      },
      {
        key: "communities-settings",
        label: "Settings",
        path: "/communities/settings",
      },
    ],
  },
  {
    key: "events",
    label: "Events",
    path: "/events",
    icon: <BellDotIcon size={18} />,
  },
  {
    key: "jobs",
    label: "Jobs",
    path: "/jobs",
    icon: <Rocket size={18} />,
    children: [
      { key: "job-approval", label: "Manage Approvals", path: "/jobs" },
      { key: "job-settings", label: "Settings", path: "/jobs/settings" },
    ],
  },
];

export const UserAvatar = () => (
  <Avatar className="w-6 h-6">
    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
      A
    </AvatarFallback>
  </Avatar>
);

export const profile = [
  {
    key: "sub1",
    icon: <Settings size={18} />,
    label: "Admin Settings",
    children: [
      {
        key: "system-activity",
        label: "System Activity",
        path: "/system-activity",
        icon: <GitPullRequest size={18} />,
      },
      {
        key: "plan",
        label: "Plan Overview",
        path: "/settings/subscription",
        icon: <CreditCard size={18} />,
      },
      {
        key: "settings",
        label: "All Settings",
        path: "/settings",
        icon: <Settings size={18} />,
      },
    ],
  },
  {
    key: "user",
    icon: <UserAvatar />,
    label: "Admin User",
    children: [
      {
        key: "profile",
        label: "Your profile",
        path: "/profile",
        icon: <User2 size={18} />,
      },
      {
        key: "notifications",
        label: "Activity & notifications",
        path: "/notifications",
        icon: <BellDotIcon size={18} />,
      },
      {
        key: "theme",
        label: "Theme",
        path: "/theme",
        icon: <PaintBucketIcon size={18} />,
      },
      {
        key: "upgrade",
        label: "Upgrade Plan",
        path: "/settings/subscription",
        icon: <Rocket size={18} />,
      },
      {
        key: "logout",
        label: "Logout",
        path: "/logout",
        icon: <LogOutIcon size={18} />,
        isLogout: true,
      },
    ],
  },
];
