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
  Dices,
  GraduationCap,
  PartyPopper,
  HelpCircle,
  BookOpen,
  Newspaper,
  Blocks,
  ClipboardList,
  Shield,
  Store,
  Currency,
  Video,
  History,
} from "lucide-react";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUser, useCheckEntitySubscription } from "@/graphql/actions";
import { useUserStore } from "@/store/store";

const menuLink = (href: string, text: string) => (
  <Link
    href={href}
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    {text}
  </Link>
);

export const playground = [
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
    label: "Members",
    path: "/members",
    icon: <Users size={18} />,
  },
];

export const main = playground;

export const settings = [
  {
    key: "cms",
    label: "Manage Website",
    path: "/app-layout/pages",
    icon: <PaintbrushVerticalIcon size={18} />,
  },
  {
    key: "moderation",
    label: "Moderation",
    path: "/settings/moderation",
    icon: <Shield size={18} />,
  },
  {
    key: "reports",
    label: "Report & Feedback",
    path: "/reports",
    icon: <ClipboardList size={18} />,
  },
  {
    key: "audit-logs",
    label: "Audit Logs",
    path: "/audit-logs",
    icon: <History size={18} />,
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
        key: "communities-reports",
        label: "Reports",
        path: "/communities/reports",
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
    key: "shop",
    label: "Shop",
    path: "/shop",
    icon: <Store size={18} />,
    children: [
      {
        key: "shop-dashboard",
        label: "Dashboard",
        path: "/shop",
      },
      {
        key: "shop-products",
        label: "Products",
        path: "/shop/all",
      },
      {
        key: "shop-banners",
        label: "Banners",
        path: "/shop/banners",
      },
      {
        key: "shop-settings",
        label: "Settings",
        path: "/shop/settings",
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
    key: "surveys",
    label: "Surveys",
    path: "/surveys",
    icon: <ClipboardList size={18} />,
    children: [
      { key: "all-surveys", label: "Manage Surveys", path: "/surveys" },
      { key: "surveys-settings", label: "Settings", path: "/surveys/settings" },
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
    ],
  },
  {
    key: "news",
    label: "News & Blogs",
    path: "/news",
    icon: <Newspaper size={18} />,
    children: [
      { key: "news-manage", label: "Manage Articles", path: "/news" },
      { key: "news-settings", label: "Settings", path: "/news/settings" },
    ],
  },
  {
    key: "stories",
    label: "Stories",
    path: "/stories",
    icon: <Video size={18} />,
    children: [
      { key: "stories-manage", label: "Manage Stories", path: "/stories" },
      { key: "stories-settings", label: "Settings", path: "/stories/settings" },
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    path: "/faq",
    icon: <HelpCircle size={18} />,
    children: [
      { key: "faq-manage", label: "Manage FAQ", path: "/faq" },
      { key: "faq-settings", label: "Settings", path: "/faq/settings" },
    ],
  },
];

export const gamification = [
  {
    key: "gamification",
    label: "Engagement Activities",
    path: "/gamification",
    icon: <Gamepad2 size={18} />,
    children: [
      {
        key: "engagement-points",
        label: "Point Rules",
        path: "/gamification/points",
      },
      {
        key: "engagement-badges",
        label: "Badges",
        path: "/gamification/badges",
      },
      { key: "engagement-ranks", label: "Ranks", path: "/gamification/ranks" },
      {
        key: "engagement-faq",
        label: "Manage FAQ",
        path: "/gamification/settings/faq",
      },
    ],
  },
  {
    key: "games",
    label: "Engagement Games",
    path: "/rewards/engagement/spin-wheel",
    icon: <Dices size={18} />,
    children: [
      {
        key: "game-spin-wheel",
        label: "Spin Wheel",
        path: "/rewards/engagement/spin-wheel",
      },
      {
        key: "game-scratch-card",
        label: "Scratch Card",
        path: "/rewards/engagement/scratch-card",
      },
      {
        key: "game-match-win",
        label: "Match & Win",
        path: "/rewards/engagement/match-win",
      },
    ],
  },
  {
    key: "currency",
    label: "Currency",
    path: "/currency",
    icon: <Currency size={18} />,
  },
  {
    key: "rewards",
    label: "Loyalty & Vouchers",
    path: "/rewards/vouchers/coupons",
    icon: <Gift size={18} />,
    children: [
      {
        key: "vouchers-coupons",
        label: "Manage Coupons",
        path: "/rewards/vouchers/coupons",
      },
      {
        key: "vouchers-inventory",
        label: "Inventory Audit",
        path: "/rewards/vouchers/inventory",
      },
      {
        key: "vouchers-redemptions",
        label: "Audit Ledger",
        path: "/rewards/vouchers/redemptions",
      },
      {
        key: "vouchers-settings",
        label: "Settings",
        path: "/gamification/settings",
      },
    ],
  },
];

/**
 * Hook to filter extended menu items based on subscription AND user module permissions.
 */
export const useFilteredExtendedItems = () => {
  const { data, loading: subLoading } = useCheckEntitySubscription();
  const user = useUserStore((state) => state.user);

  const filterItems = (items: any[]) => {
    const modules = data?.checkEntitySubscription?.modules || [];
    const modulePermissions = user?.modulePermissions || [];
    const isSuperAdmin = user?.isSuperAdmin;
    const isSystemRole = user?.role?.isSystem;

    const enabledModuleIds = new Set(
      modules
        .filter((m) => m.enabled)
        .map((m) => m.name?.toLowerCase().replace(/'/g, "_")),
    );

    return items.filter((item) => {
      const moduleKey = item.key?.toLowerCase().replace(/'/g, "_");

      const isSubscribed =
        moduleKey === "loyalty" ||
        moduleKey === "games" ||
        moduleKey === "rewards_admin" ||
        item.key === "rewards" ||
        item.key === "currency"
          ? enabledModuleIds.has("rewards")
          : enabledModuleIds.has(moduleKey);

      if (!isSubscribed) return false;
      if (isSuperAdmin || isSystemRole) return true;

      return modulePermissions.some(
        (mp: any) => mp.module === item.key?.toUpperCase() && mp.canRead,
      );
    });
  };

  const filteredExtended = useMemo(
    () => filterItems(extendedItems),
    [data?.checkEntitySubscription?.modules, user, subLoading],
  );

  const filteredGamification = useMemo(
    () => filterItems(gamification),
    [data?.checkEntitySubscription?.modules, user, subLoading],
  );

  return {
    extendedItems: filteredExtended,
    gamificationItems: filteredGamification,
    loading: subLoading,
  };
};

/**
 * Hook to filter management menu items based on user system permissions.
 */
export const useFilteredManagementItems = () => {
  const user = useUserStore((state) => state.user);
  const isSuperAdmin = user?.isSuperAdmin;
  const isSystemRole = user?.role?.isSystem;
  const permissions = user?.permissions;

  const filteredItems = useMemo(() => {
    if (isSuperAdmin || isSystemRole) return settings;

    return settings.filter((item) => {
      if (item.key === "cms") return permissions?.website;
      if (item.key === "moderation") return permissions?.moderation;
      if (item.key === "reports") return permissions?.reports;
      if (item.key === "audit-logs") return permissions?.auditLogs;
      return true;
    });
  }, [user, isSuperAdmin, isSystemRole, permissions]);

  return {
    managementItems: filteredItems,
  };
};

const getInitials = (name?: string) => {
  if (!name) return "AU";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const UserAvatar = () => {
  const { data } = useGetUser();
  const user = data?.getUser;

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

export const UserDetails = UserName;

export const profile = [
  {
    key: "sub1",
    icon: <Settings size={18} />,
    label: "Admin Settings",
    children: [
      {
        key: "system-activity",
        label: "System Activity",
        path: "/audit-logs",
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
        path: "/settings/profile",
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
