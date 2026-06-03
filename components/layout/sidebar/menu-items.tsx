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
  LayoutDashboard,
  Rss,
  Cpu,
  Layers,
  UserCog,
  ShieldAlert,
  Key,
  Globe,
  Languages,
  BadgeCheck,
  Target,
  LineChart,
  Wallet,
  Coins,
  ShieldCheck,
  Undo2,
  Search,
  FileSearch,
  Ticket,
  Percent,
  Box,
  CheckCircle,
  Megaphone,
  Briefcase,
  FileText,
  BarChart4,
  CheckSquare,
  UserCheck,
  Zap,
  Tag,
  Info,
  LifeBuoy,
  LogOut,
  Bell,
  Mail,
  Sparkles,
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

// --- 1. HOME ---
export const homeItems = [
  {
    key: "home-dashboard",
    label: "Dashboard",
    path: "/",
    icon: <Home size={18} />,
  },
  // {
  //   key: "ai-agent",
  //   label: "AI Agent Studio",
  //   path: "/ai-agent",
  //   icon: <Sparkles size={18} />,
  //   badge: "New",
  // },
  // {
  //   key: "chat",
  //   label: "AI Assistant",
  //   path: "/chat",
  //   icon: <MessageSquare size={18} />,
  // },
];

// --- 2. COMMUNITY ---
export const communityIntelligence = [
  {
    key: "members",
    label: "Members",
    path: "/members",
    isMobileOnly: true,
    icon: <Users size={18} />,
    children: [
      { key: "members-dash", label: "Dashboard", path: "/members" },
      { key: "members-manage", label: "Manage Members", path: "/members/all" },
      {
        key: "members-create",
        label: "Add New Member",
        path: "/members/create",
      },
      {
        key: "members-classifications",
        label: "Classifications",
        path: "/members/classifications",
      },
      {
        key: "members-reported",
        label: "Reported Items",
        path: "/members/reports",
      },
      { key: "members-settings", label: "Settings", path: "/members/settings" },
      { key: "members-audit", label: "Audit Log", path: "/members/audit-log" },
    ],
  },
];

// --- 2. MODERATION ---
export const contentModeration = [
  {
    key: "mod-dashboard",
    label: "Dashboard",
    path: "/moderation",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "feed",
    label: "Feed (Posts, Photos, Videos)",
    path: "/feed",
    icon: <Rss size={18} />,
    children: [
      { key: "feed-dash", label: "Dashboard", path: "/feed" },
      { key: "feed-overall", label: "Overall Posts", path: "/feed/all" },
      { key: "feed-pinned", label: "Pinned Post", path: "/feed/pinned" },
      { key: "feed-admin", label: "Admin Posts", path: "/feed/admin" },
      {
        key: "feed-moments",
        label: "Moments (Videos)",
        path: "/feed/moments",
        isMobileOnly: true,
      },
      {
        key: "feed-jobs",
        label: "Jobs",
        path: "/feed/jobs",
        isMobileOnly: true,
      },
      {
        key: "feed-listings",
        label: "Listings",
        path: "/feed/listing",
        isMobileOnly: true,
      },
      { key: "feed-reported", label: "Reported Items", path: "/feed/reports" },
      { key: "feed-settings", label: "Settings", path: "/feed/settings" },
    ],
  },
  {
    key: "mod-reported",
    label: "Reported Items",
    path: "/reports",
    icon: <ShieldAlert size={18} />,
  },
  {
    key: "mod-manual",
    label: "Moderation Settings",
    icon: <Settings size={18} />,
    children: [
      {
        key: "mod-moderation",
        label: "Ai Moderation",
        path: "/moderation/settings",
      },
      {
        key: "mod-banned",
        label: "Banned words",
        path: "/moderation/banned-words",
      },
      {
        key: "mod-links",
        label: "Blocked Links",
        path: "/moderation/blocked-links",
      },
    ],
  },
  {
    key: "trust-center",
    label: "Trust Center",
    path: "/trust-center",
    icon: <ShieldCheck size={18} />,
    badge: "Active",
  },
];

// --- 3. REWARDS & GAMES ---
export const gamificationEngine = [
  {
    key: "engagement-activities",
    label: "Points & Badges",
    path: "/gamification",
    isMobileOnly: true,
    icon: <Target size={18} />,
    children: [
      { key: "eng-dash", label: "Dashboard", path: "/gamification" },
      { key: "eng-points", label: "Points", path: "/gamification/points" },
      { key: "eng-badges", label: "Badges", path: "/gamification/badges" },
      { key: "eng-ranks", label: "Ranks", path: "/gamification/ranks" },
      {
        key: "eng-leaderboard",
        label: "Leaderboard",
        path: "/gamification/leaderboard",
      },
      {
        key: "eng-log",
        label: "Activity Log",
        path: "/gamification/activity-log",
      },
    ],
  },
  {
    key: "engagement-games",
    label: "Member Games",
    path: "/engagement-games",
    isMobileOnly: true,
    icon: <Gamepad2 size={18} />,
    children: [
      {
        key: "game-dash",
        label: "Dashboard",
        path: "/engagement-games",
      },
      {
        key: "game-spin",
        label: "Spin Wheel",
        path: "/engagement-games/spin-wheel",
      },
      {
        key: "game-scratch",
        label: "Scratch Card",
        path: "/engagement-games/scratch-card",
      },
      {
        key: "game-match",
        label: "Match & Win",
        path: "/engagement-games/match-win",
      },
    ],
  },
  {
    key: "currency",
    label: "Currency",
    path: "/currency",
    isMobileOnly: true,
    icon: <Coins size={18} />,
    children: [
      { key: "cur-dash", label: "Dashboard", path: "/currency" },
      { key: "cur-economics", label: "Economics", path: "/currency/economics" },
      { key: "cur-abuse", label: "Anti-Abuse", path: "/currency/anti-abuse" },
      {
        key: "cur-redemption",
        label: "Redeem Rules",
        path: "/currency/redemption",
      },
      { key: "cur-trace", label: "Quick Trace", path: "/currency/trace" },
      { key: "cur-audit", label: "Audit Log", path: "/currency/audit-log" },
    ],
  },
  {
    key: "rewards",
    label: "Rewards",
    path: "/rewards",
    isMobileOnly: true,
    icon: <Gift size={18} />,
    children: [
      { key: "rew-dash", label: "Dashboard", path: "/rewards" },

      {
        key: "rcoupons",
        label: "Rewards & Vouchers",
        path: "/rewards/coupons",
      },
      ,
      {
        key: "rew-coupons",
        label: "Create Reward",
        path: "/rewards/coupons/create",
      },

      {
        key: "redemptions",
        label: "Redemption",
        path: "/rewards/Redemptions",
      },
      { key: "rew-fraud", label: "Fraud", path: "/rewards/fraud" },
    ],
  },
];

// --- 4. MODULES ---
export const modules = [
  {
    key: "communities",
    label: "Communities",
    path: "/communities",
    isMobileOnly: true,
    icon: <Users size={18} />,
    children: [
      { key: "com-dash", label: "Dashboard", path: "/communities" },
      {
        key: "com-create",
        label: "Create Communities",
        path: "/communities/create",
      },
      {
        key: "com-manage",
        label: "Manage Communities",
        path: "/communities/all",
      },
      {
        key: "com-reported",
        label: "Reported Items",
        path: "/communities/reports",
      },
      { key: "com-settings", label: "Settings", path: "/communities/settings" },
    ],
  },
  {
    key: "events",
    label: "Events",
    path: "/events",
    icon: <Calendar size={18} />,
    children: [
      { key: "ev-dash", label: "Dashboard", path: "/events" },
      { key: "ev-create", label: "Create Events", path: "/events/create" },
      { key: "ev-manage", label: "Manage Events", path: "/events/all" },
      {
        key: "ev-cats",
        label: "Manage Categories",
        path: "/events/categories",
      },
      { key: "ev-reported", label: "Reported Items", path: "/events/reports" },
      { key: "ev-settings", label: "Settings", path: "/events/settings" },
    ],
  },
  {
    key: "jobs",
    label: "Jobs",
    path: "/jobs",
    isMobileOnly: true,
    icon: <Briefcase size={18} />,
    children: [
      { key: "job-dash", label: "Dashboard", path: "/jobs" },
      { key: "job-create", label: "Create Jobs", path: "/jobs/create" },
      { key: "job-manage", label: "Manage Jobs", path: "/jobs/all" },
      { key: "job-reported", label: "Reported Items", path: "/jobs/reports" },
      { key: "job-settings", label: "Settings", path: "/jobs/settings" },
    ],
  },
  {
    key: "listing",
    label: "Marketplace",
    path: "/listing",
    isMobileOnly: true,
    icon: <ShoppingBag size={18} />,
    children: [
      { key: "market-dash", label: "Dashboard", path: "/listing" },
      {
        key: "market-create",
        label: "Create Listings",
        path: "/listing/create",
      },
      { key: "market-manage", label: "Manage Listings", path: "/listing/all" },
      {
        key: "market-reported",
        label: "Reported Items",
        path: "/listing/reports",
      },
      { key: "market-settings", label: "Settings", path: "/listing/settings" },
      { key: "market-audit", label: "Audit Log", path: "/listing/audit-logs" },
    ],
  },

  {
    key: "moments",
    label: "Moments",
    path: "/moments",
    isMobileOnly: true,
    icon: <Video size={18} />,
    children: [
      { key: "mom-dash", label: "Dashboard", path: "/moments" },
      {
        key: "mom-create",
        label: "Create Moments",
        path: "/moments/create",
      },
      {
        key: "mom-manage",
        label: "Manage Moments",
        path: "/moments/all",
      },
      {
        key: "mom-reported",
        label: "Reported Items",
        path: "/moments/reports",
      },
      { key: "mom-settings", label: "Settings", path: "/moments/settings" },
    ],
  },
  {
    key: "shop",
    label: "Shop",
    path: "/shop",
    icon: <Store size={18} />,
    children: [
      { key: "shop-dash", label: "Dashboard", path: "/shop" },
      { key: "shop-create", label: "Create Products", path: "/shop/create" },
      { key: "shop-banners", label: "Manage Banners", path: "/shop/banners" },
      { key: "shop-reported", label: "Reported Items", path: "/shop/reports" },
      { key: "shop-settings", label: "Settings", path: "/shop/settings" },
    ],
  },
  {
    key: "forums",
    label: "Forums",
    path: "/forums",
    icon: <MessageSquare size={18} />,
    children: [
      { key: "for-dash", label: "Dashboard", path: "/forums" },
      {
        key: "for-topics",
        label: "Create Topics",
        path: "/forums/topics/create",
      },
      { key: "for-posts", label: "Create Posts", path: "/forums/posts/create" },
      { key: "for-manage", label: "Manage Forums", path: "/forums/all" },
      {
        key: "for-cats",
        label: "Manage Categories",
        path: "/forums/categories",
      },
      { key: "for-reported", label: "Reported Items", path: "/forums/reports" },
      { key: "for-settings", label: "Settings", path: "/forums/settings" },
      { key: "for-audit", label: "Audit Log", path: "/forums/audit-log" },
    ],
  },
  {
    key: "polls",
    label: "Polls",
    path: "/polls",
    icon: <BarChart3 size={18} />,
    children: [
      { key: "poll-dash", label: "Dashboard", path: "/polls" },
      { key: "poll-create", label: "Create Polls", path: "/polls/create" },
      { key: "poll-manage", label: "Manage Polls", path: "/polls/all" },
      { key: "poll-settings", label: "Settings", path: "/polls/settings" },
    ],
  },
  {
    key: "surveys",
    label: "Surveys",
    path: "/surveys",
    icon: <ClipboardList size={18} />,
    children: [
      { key: "sur-dash", label: "Dashboard", path: "/surveys" },

      { key: "sur-create", label: "Create Surveys", path: "/surveys/create" },
      { key: "sur-manage", label: "Manage Surveys", path: "/surveys/all" },

      {
        key: "sur-reported",
        label: "Reported Items",
        path: "/surveys/reports",
      },
      { key: "sur-settings", label: "Settings", path: "/surveys/settings" },
    ],
  },
  {
    key: "mentorship",
    label: "Mentorship",
    path: "/mentorship",
    icon: <GraduationCap size={18} />,
    children: [
      { key: "ment-dash", label: "Dashboard", path: "/mentorship" },
      { key: "ment-manage", label: "Manage Programs", path: "/mentorship/all" },
      {
        key: "ment-requests",
        label: "User Requests",
        path: "/mentorship/requests",
      },
      {
        key: "ment-cats",
        label: "Manage Categories",
        path: "/mentorship/categories",
      },
      {
        key: "ment-skills",
        label: "Manage Skills",
        path: "/mentorship/skills",
      },
      {
        key: "ment-reported",
        label: "Reported Items",
        path: "/mentorship/reports",
      },
      { key: "ment-settings", label: "Settings", path: "/mentorship/settings" },
    ],
  },
  {
    key: "offers",
    label: "Offers",
    path: "/offers",
    isMobileOnly: true,
    icon: <Tag size={18} />,
    children: [
      { key: "off-dash", label: "Dashboard", path: "/offers" },
      { key: "off-manage", label: "Manage Offers", path: "/offers/all" },
      {
        key: "off-cats",
        label: "Manage Categories",
        path: "/offers/categories",
      },
      { key: "off-reported", label: "Reported Items", path: "/offers/reports" },
      { key: "off-settings", label: "Settings", path: "/offers/settings" },
    ],
  },
];

// --- 5. ADMIN SETTINGS ---
export const adminSettings = [
  {
    key: "customisation",
    label: "Design & Style",
    icon: <PaintBucketIcon size={18} />,
    children: [
      {
        key: "cust-logo",
        label: "Setup Logo",
        path: "/settings/branding",
      },
      {
        key: "cust-brand",
        label: "Brand Look",
        path: "/settings/appearance",
      },
      {
        key: "cust-dom",
        label: "Setup Domain",
        path: "/settings/domains",
      },
      {
        key: "cust-web",
        label: "Website Layout",
        path: "/app-layout",
      },
      {
        key: "cust-mod",
        label: "Setup Modules",
        path: "/settings/modules#setup",
      },
      {
        key: "cust-lang",
        label: "Setup Languages",
        path: "/settings/languages#setup",
      },
      {
        key: "cust-int",
        label: "Setup Integrations",
        path: "/settings/integrations#setup",
      },
    ],
  },

  {
    key: "branded-email",
    label: "Email",
    path: "/email/usage",
    icon: <Mail size={18} />,
    children: [
      { key: "email-dash", label: "Usage Dashboard", path: "/email/usage" },
      {
        key: "email-templates",
        label: "Manage Templates",
        path: "/email/templates",
      },
      {
        key: "email-campaigns",
        label: "Automation Campaigns",
        path: "/email/automation",
      },
      {
        key: "email-settings",
        label: "Email Settings",
        path: "/email/settings",
      },
    ],
  },

  {
    key: "team",
    label: "Team",
    icon: <UserCog size={18} />,
    children: [
      {
        key: "team-users",
        label: "Users & Permissions",
        path: "/settings/users",
      },
    ],
  },
  {
    key: "account",
    label: "Account",
    icon: <CreditCard size={18} />,
    children: [
      { key: "acc-bill", label: "Billing Info", path: "/settings/billing" },
      {
        key: "acc-plan",
        label: "Subscription & Plan",
        path: "/settings/subscription",
      },
      // { key: "acc-inv", label: "Invoices", path: "/settings/invoices" },
      { key: "acc-audit", label: "Audit Log", path: "/audit-log" },
      // { key: "acc-export", label: "Export Data", path: "/settings/export" },
    ],
  },
  {
    key: "policies",
    label: "Policies & Terms",
    icon: <ShieldCheck size={18} />,
    children: [
      {
        key: "pol-privacy",
        label: "Privacy Policy",
        path: "/settings/privacy",
      },
      {
        key: "pol-terms",
        label: "Terms of Use",
        path: "/settings/policies",
      },
      { key: "pol-taxes", label: "Taxes & Duties", path: "/settings/taxes" },
    ],
  },
  {
    key: "learnings",
    label: "Help Guides",
    path: "/learnings",
    icon: <BookOpen size={18} />,
  },
  {
    key: "support",
    label: "Contact Support",
    icon: <LifeBuoy size={18} />,
    children: [
      { key: "sup-feed", label: "Feedback", path: "/feedback" },
      {
        key: "sup-manager",
        label: "Dedicated Account Manager",
        path: "/settings/contact",
      },
    ],
  },
];

// --- 6. PROFILE ---
export const profile = (userName: string = "Deepak Rai") => [
  {
    key: "user-profile-root",
    label: userName,
    icon: <UserAvatar />,
    children: [
      {
        key: "prof-settings",
        label: "Profile Settings",
        path: "/settings/profile",
        icon: <User2 size={16} />,
      },
      {
        key: "prof-notif",
        label: "Activity & Notifications",
        icon: <Bell size={16} />,
        children: [
          { key: "notif-list", label: "Notifications", path: "/notifications" },
        ],
      },
      {
        key: "logout",
        label: "Logout",
        path: "/logout",
        icon: <LogOut size={16} />,
        isLogout: true,
      },
    ],
  },
];

// --- Legacy exports for compatibility while refactoring sidebar.tsx ---
export const main = homeItems;
export const settings = adminSettings;
export const extendedItems = modules;
export const gamification = gamificationEngine;

/**
 * Hook to filter menu items based on subscription AND user module permissions.
 */
export const useFilteredExtendedItems = () => {
  const { data, loading: subLoading } = useCheckEntitySubscription();
  const user = useUserStore((state) => state.user);

  const filterItems = (items: any[], isHome: boolean = false) => {
    const modulesSub = data?.checkEntitySubscription?.modules || [];
    const modulePermissions = user?.modulePermissions || [];
    const isSuperAdmin = user?.isSuperAdmin;
    const isSystemRole = user?.role?.isSystem;

    const hasModulePermission = (moduleName: string, action: string = "canRead") => {
      if (!user) return false;
      if (user.isSuperAdmin || user.role?.isSystem) return true;
      if (user.permissions && moduleName in user.permissions) {
        return !!user.permissions[moduleName as keyof typeof user.permissions];
      }
      const modulePermission = user.modulePermissions?.find(
        (m) => m.module.toUpperCase() === moduleName.toUpperCase(),
      );
      // @ts-ignore
      return !!modulePermission?.[action];
    };

    const enabledModuleIds = new Set(
      modulesSub
        .filter((m) => m.enabled)
        .map((m) => m.name?.toLowerCase().replace(/'/g, "_")),
    );

    const filteredList = items.reduce((acc, item) => {
      // 1. Super admin and system roles can see everything that is subscribed (or core)
      const isSuperAdmin = user?.isSuperAdmin;
      const isSystemRole = user?.role?.isSystem;

      // Check moderation items
      if (item.key === "mod-dashboard" || item.key === "mod-reported") {
        if (!hasModulePermission("MODERATION")) return acc;
      }
      if (item.key === "mod-manual" || item.key === "mod-ai") {
        if (!hasModulePermission("MODERATION") && !hasModulePermission("AI_MODERATION")) return acc;
      }

      // 2. Home items and Dashboard should always be visible (or conditionally)
      if (
        isHome ||
        item.key === "home-dashboard" ||
        item.key === "trust-center" ||
        item.key === "community-intelligence" ||
        item.key === "mod-dashboard" ||
        item.key === "mod-reported" ||
        item.key === "mod-manual" ||
        item.key === "mod-ai"
      ) {
        // If it's a mod item, we already returned early if no permission.
        // For mod-manual children, filter them based on exact permission
        if (item.key === "mod-manual" && item.children) {
          const mappedItem = { ...item };
          mappedItem.children = mappedItem.children.filter((child: any) => {
            if (child.key === "mod-moderation") return hasModulePermission("AI_MODERATION");
            if (child.key === "mod-banned" || child.key === "mod-links") return hasModulePermission("MODERATION");
            return true;
          });
          if (mappedItem.children.length > 0) acc.push(mappedItem);
          return acc;
        }

        acc.push(item);
        return acc;
      }

      const moduleKey = item.key?.toLowerCase().replace(/'/g, "_");

      // Special cases for mapping keys to module names in subscription
      let subKey = moduleKey;
      if (
        item.key === "rewards" ||
        item.key === "currency" ||
        item.key === "engagement-games" ||
        item.key === "engagement-activities"
      ) {
        subKey = "rewards";
      }

      const isSubscribed = enabledModuleIds.has(subKey);
      const mappedItem = { ...item, isLocked: !isSubscribed };

      if (isSuperAdmin || isSystemRole) {
        acc.push(mappedItem);
        return acc;
      }

      // 3. Regular users need explicit module permissions
      const hasPermission = modulePermissions.some(
        (mp: any) => mp.module === item.key?.toUpperCase() && mp.canRead,
      );

      if (hasPermission) {
        acc.push(mappedItem);
      }
      return acc;
    }, []);

    return filteredList.sort((a, b) => {
      if (a.isLocked === b.isLocked) return 0;
      if (a.isLocked) return 1;
      return -1;
    });
  };

  const filteredHome = useMemo(
    () => filterItems(homeItems, true),
    [data, user],
  );
  const filteredCommunity = useMemo(
    () => filterItems(communityIntelligence, true),
    [data, user],
  );
  const filteredModeration = useMemo(
    () => filterItems(contentModeration),
    [data, user],
  );
  const filteredGamification = useMemo(
    () => filterItems(gamificationEngine),
    [data, user],
  );
  const filteredModules = useMemo(() => filterItems(modules), [data, user]);

  return {
    homeItems: filteredHome,
    communityIntelligence: filteredCommunity,
    contentModeration: filteredModeration as any[],
    gamificationEngine: filteredGamification as any[],
    modules: filteredModules as any[],
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

  const hasModulePermission = (moduleName: string, action: string = "canRead") => {
    if (!user) return false;
    if (user.isSuperAdmin || user.role?.isSystem) return true;
    if (user.permissions && moduleName in user.permissions) {
      return !!user.permissions[moduleName as keyof typeof user.permissions];
    }
    const modulePermission = user.modulePermissions?.find(
      (m) => m.module.toUpperCase() === moduleName.toUpperCase(),
    );
    // @ts-ignore
    return !!modulePermission?.[action];
  };

  const filteredItems = useMemo(() => {
    if (isSuperAdmin || isSystemRole) return adminSettings;

    return adminSettings
      .map((section) => {
        // Deep copy the section to avoid mutating original
        const filteredSection = { ...section };

        // Top level section permission checks
        if (section.key === "customisation") {
          const canSeeAny =
            hasModulePermission("APPEARANCE") ||
            hasModulePermission("DOMAIN") ||
            hasModulePermission("PLATFORM_FEATURES") ||
            hasModulePermission("LANGUAGES") ||
            hasModulePermission("INTEGRATIONS");
          if (!canSeeAny) return null;
        }

        if (section.key === "team") {
          const canSeeAny =
            hasModulePermission("ADMIN_USERS") ||
            hasModulePermission("USERS_AND_PERMISSIONS") ||
            hasModulePermission("PERMISSIONS");
          if (!canSeeAny) return null;
        }

        if (section.key === "account") {
          const canSeeAny =
            hasModulePermission("BILLING") ||
            hasModulePermission("SUBSCRIPTION") ||
            hasModulePermission("AUDIT_LOGS");
          if (!canSeeAny) return null;
        }

        if (section.key === "policies") {
          const canSeeAny =
            hasModulePermission("POLICIES") ||
            hasModulePermission("CUSTOMER_PRIVACY") ||
            hasModulePermission("TAXES_AND_DUTIES");
          if (!canSeeAny) return null;
        }

        if (section.key === "support") {
          if (!hasModulePermission("CONTACT_SUPPORT") && !hasModulePermission("FEEDBACK")) return null;
        }

        // Filter children if they exist
        if (filteredSection.children) {
          filteredSection.children = filteredSection.children.filter((child) => {
            if (child.key === "cust-logo" || child.key === "cust-brand") return hasModulePermission("APPEARANCE");
            if (child.key === "cust-dom") return hasModulePermission("DOMAIN");
            if (child.key === "cust-mod") return hasModulePermission("PLATFORM_FEATURES");
            if (child.key === "cust-lang") return hasModulePermission("LANGUAGES");
            if (child.key === "cust-int") return hasModulePermission("INTEGRATIONS");
            if (child.key === "team-users") return hasModulePermission("USERS_AND_PERMISSIONS") || hasModulePermission("ADMIN_USERS");
            if (child.key === "acc-bill") return hasModulePermission("BILLING");
            if (child.key === "acc-plan") return hasModulePermission("SUBSCRIPTION");
            if (child.key === "acc-audit") return hasModulePermission("AUDIT_LOGS");
            if (child.key === "pol-privacy") return hasModulePermission("CUSTOMER_PRIVACY");
            if (child.key === "pol-terms") return hasModulePermission("POLICIES");
            if (child.key === "pol-taxes") return hasModulePermission("TAXES_AND_DUTIES");
            if (child.key === "sup-manager") return hasModulePermission("CONTACT_SUPPORT");
            
            // Allow default access for others if parent is allowed
            return true;
          });

          // If all children were filtered out, don't show the section (unless it's supposed to be empty)
          if (filteredSection.children.length === 0 && section.children && section.children.length > 0) {
            return null;
          }
        }

        return filteredSection;
      })
      .filter(Boolean) as typeof adminSettings;
  }, [user, isSuperAdmin, isSystemRole]);

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
      <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-[10px] font-bold">
        {getInitials(user?.firstName || user?.lastName)}
      </AvatarFallback>
    </Avatar>
  );
};

export const UserName = () => {
  const { data } = useGetUser();
  const user = data?.getUser;
  return (
    <span>{user ? `${user.firstName} ${user.lastName}` : "Deepak Rai"}</span>
  );
};

export const UserDetails = UserName;
