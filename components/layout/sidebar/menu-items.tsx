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
  ShoppingBag,
  Calendar,
  Gift,
  Trophy,
  Gamepad2,
  GraduationCap,
  PartyPopper,
  HelpCircle,
  BookOpen,
  Newspaper,
} from "lucide-react";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUser, useCheckEntitySubscription } from "@/graphql/actions";

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
    children: [
      {
        key: "events-manage",
        label: "Manage Events",
        path: "/events",
      },
      {
        key: "events-categories",
        label: "Categories",
        path: "/events/categories",
      },
      {
        key: "events-settings",
        label: "Settings",
        path: "/events/settings",
      },
    ],
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
  {
    key: "listing",
    label: "Marketplace",
    path: "/listing",
    icon: <ShoppingBag size={18} />,
    children: [
      {
        key: "marketplace-listings",
        label: "Manage Listings",
        path: "/listing",
      },
      {
        key: "marketplace-settings",
        label: "Settings",
        path: "/listing/settings",
      },
    ],
  },
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
    key: "feedback",
    label: "Feedback",
    path: "/feedback",
    icon: <BarChart3 size={18} />,
    children: [
      { key: "all-polls", label: "Manage Feedback", path: "/feedback" },
      { key: "polls-settings", label: "Settings", path: "/polls/settings" },
    ],
  },

  {
    key: "mentorship",
    label: "Mentorship",
    path: "/mentorship",
    icon: <GraduationCap size={18} />,
    children: [
      {
        key: "mentorship-programs",
        label: "Manage Programs",
        path: "/mentorship",
      },
      {
        key: "mentorship-settings",
        label: "Settings",
        path: "/mentorship/settings",
      },
    ],
  },
  {
    key: "offers",
    label: "Offers & Deals",
    path: "/offers",
    icon: <Gift size={18} />,
    children: [
      {
        key: "offers-manage",
        label: "Manage Offers",
        path: "/offers",
      },
      {
        key: "offers-settings",
        label: "Settings",
        path: "/offers/settings",
      },
    ],
  },
  {
    key: "wall-of-fame",
    label: "Wall of Fame",
    path: "/wall-of-fame",
    icon: <Trophy size={18} />,
    children: [
      {
        key: "wall-manage",
        label: "Manage Honorees",
        path: "/wall-of-fame",
      },
      {
        key: "wall-settings",
        label: "Settings",
        path: "/wall-of-fame/settings",
      },
    ],
  },
  {
    key: "gamification",
    label: "Gamification",
    path: "/gamification",
    icon: <Gamepad2 size={18} />,
    children: [
      {
        key: "gamification-leaderboard",
        label: "Leaderboards",
        path: "/gamification/leaderboard",
      },
      {
        key: "gamification-badges",
        label: "Badges & Achievements",
        path: "/gamification/badges",
      },
      {
        key: "gamification-settings",
        label: "Settings",
        path: "/gamification/settings",
      },
    ],
  },
  {
    key: "celebrations",
    label: "Celebrations",
    path: "/celebrations",
    icon: <PartyPopper size={18} />,
    children: [
      {
        key: "celebrations-birthdays",
        label: "Birthdays",
        path: "/celebrations/birthdays",
      },
      {
        key: "celebrations-anniversaries",
        label: "Anniversaries",
        path: "/celebrations/anniversaries",
      },
      {
        key: "celebrations-settings",
        label: "Settings",
        path: "/celebrations/settings",
      },
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    path: "/faq",
    icon: <HelpCircle size={18} />,
    children: [
      {
        key: "faq-manage",
        label: "Manage FAQs",
        path: "/faq",
      },
      {
        key: "faq-categories",
        label: "Categories",
        path: "/faq/categories",
      },
      {
        key: "faq-settings",
        label: "Settings",
        path: "/faq/settings",
      },
    ],
  },

  {
    key: "news",
    label: "News",
    path: "/news",
    icon: <Newspaper size={18} />,
    children: [
      {
        key: "news-articles",
        label: "Manage Articles",
        path: "/news",
      },
      {
        key: "news-categories",
        label: "Categories",
        path: "/news/categories",
      },
      {
        key: "news-settings",
        label: "Settings",
        path: "/news/settings",
      },
    ],
  },
];

/**
 * Hook to filter extended menu items based on subscription modules.
 * Only shows menu items where the key matches an enabled module id from subscription.
 */
export const useFilteredExtendedItems = () => {
  const { data, loading } = useCheckEntitySubscription();

  const filteredItems = useMemo(() => {
    const modules = data?.checkEntitySubscription?.modules || [];

    // Normalize module names: lowercase and replace single quotes with underscores
    const enabledModuleIds = new Set(
      modules
        .filter((m) => m.enabled)
        .map((m) => m.name?.toLowerCase().replace(/'/g, "_"))
    );

    // If no modules data yet (loading), return all items if no subscription data
    if (modules.length === 0 && !loading) {
      return extendedItems;
    }

    // Filter extendedItems to only include those with matching enabled module IDs
    return extendedItems.filter((item) =>
      enabledModuleIds.has(item.key?.toLowerCase().replace(/'/g, "_"))
    );
  }, [data?.checkEntitySubscription?.modules, loading]);

  return {
    filteredItems,
    loading,
    allModules: data?.checkEntitySubscription?.modules || [],
  };
};

export const UserAvatar = () => {
  const { data, loading } = useGetUser();
  const user = data?.getUser;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Avatar className="w-6 h-6">
      {user?.profilePicture && (
        <AvatarImage src={user.profilePicture} alt={user?.name || "User"} />
      )}
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
        {getInitials(user?.firstName || user?.lastName)}
      </AvatarFallback>
    </Avatar>
  );
};

export const UserName = () => {
  const { data, loading } = useGetUser();
  return (
    <span>
      {data?.getUser?.firstName + " " + data?.getUser.lastName || "Admin User"}
    </span>
  );
};

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
    label: <UserName />,
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
