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
  Contact2,
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
  Smartphone,
  Images,
  UserPlus,
  Network,
  Share2,
  Bot,
  BrainCircuit,
  BarChart2,
  Link2,
  Wand2,
  Plus,
  List,
  Clock,
  Award,
  Medal,
  TrendingUp,
  ListOrdered,
  PlayCircle,
  Puzzle,
  Waypoints,
  Tags,
  PlusCircle,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetUser,
  useCheckEntitySubscription,
  useHasAnyIntegration,
} from "@/graphql/actions";
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
];

// --- 1b. AI ---
export const aiStudioItems = [
  {
    key: "ai-ask",
    label: "Ask or Create",
    path: "/ai-agent",
    icon: <Wand2 size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-analytics",
    label: "Analytics",
    path: "/ai-agent",
    icon: <BarChart2 size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-skills",
    label: "Skills",
    path: "/ai-agent",
    icon: <BrainCircuit size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-connections",
    label: "Connectors",
    path: "/ai-agent",
    icon: <Link2 size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-onboarding",
    label: "Onboarding Assistant",
    path: "/ai-agent",
    icon: <Rocket size={18} />,
    badge: "Beta",
  },
];

export const aiSuperAgentsItems = [
  {
    key: "ai-create-agent",
    label: "Create Agent",
    path: "/ai-agent",
    icon: <Plus size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-all-agents",
    label: "All Agents",
    path: "/ai-agent",
    icon: <List size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-my-agents",
    label: "My Agents",
    path: "/ai-agent",
    icon: <User2 size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-recent-super-agents",
    label: "Recent Super Agents",
    path: "/ai-agent",
    icon: <Clock size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-communities-agent",
    label: "Communities Agent",
    path: "/ai-agent",
    icon: <Users size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-survey-agent",
    label: "Survey Agent",
    path: "/ai-agent",
    icon: <ClipboardList size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-membership-manager-agent",
    label: "Membership Manager Agent",
    path: "/ai-agent",
    icon: <UserCog size={18} />,
    badge: "Beta",
  },
];

export const aiChatItems = [
  {
    key: "ai-recent-chats",
    label: "Recent Chats",
    path: "/ai-agent/chat/recent",
    icon: <Clock size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-all-chats",
    label: "All Chats",
    path: "/ai-agent/chat/all",
    icon: <List size={18} />,
    badge: "Beta",
  },
  {
    key: "ai-new-conversation",
    label: "New Conversation",
    path: "/ai-agent/chat/new",
    icon: <Plus size={18} />,
    badge: "Beta",
  },
];

// --- 2. MEMBERS ---
export const membersIntelligence = [
  {
    key: "members-dash",
    label: "Dashboard",
    path: "/members",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "members-manage",
    label: "Manage Members",
    path: "/members/all",
    icon: <Users size={18} />,
  },
  {
    key: "members-create",
    label: "Create New Members",
    path: "/members/create",
    icon: <UserPlus size={18} />,
  },
  {
    key: "members-referrals",
    label: "Referrals",
    path: "/members/referrals",
    icon: <Share2 size={18} />,
  },
  {
    key: "members-tiers",
    label: "Membership Tiers",
    path: "/members/tiers",
    icon: <Award size={18} />,
  },
  {
    key: "members-graph",
    label: "Network Graph",
    path: "/members/graph",
    icon: <Network size={18} />,
  },
  {
    key: "members-classifications",
    label: "Classifications",
    path: "/members/classification",
    icon: <Tag size={18} />,
  },
  {
    key: "members-reported",
    label: "Reported Items",
    path: "/members/reports",
    icon: <ShieldAlert size={18} />,
  },
  {
    key: "members-audit",
    label: "Audit Log",
    path: "/members/audit-log",
    icon: <History size={18} />,
  },
  {
    key: "members-settings",
    label: "Settings",
    path: "/members/settings",
    icon: <Settings size={18} />,
  },
];

// --- 2. MODERATION ---
export const feedItems = [
  {
    key: "feed-dash",
    label: "Dashboard",
    path: "/feed",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "feed-overall",
    label: "Overall Posts",
    path: "/feed/all",
    icon: <Rss size={18} />,
  },
  {
    key: "feed-pinned",
    label: "Pinned Post",
    path: "/feed/pinned",
    icon: <CheckSquare size={18} />,
  },
  {
    key: "feed-admin",
    label: "Admin Posts",
    path: "/feed/admin",
    icon: <UserCog size={18} />,
  },
  {
    key: "feed-moments",
    label: "Moments (Videos)",
    path: "/feed/moments",
    isMobileOnly: true,
    icon: <Video size={18} />,
  },
  {
    key: "feed-jobs",
    label: "Jobs",
    path: "/feed/jobs",
    isMobileOnly: true,
    icon: <Briefcase size={18} />,
  },
  {
    key: "feed-listings",
    label: "Listings",
    path: "/feed/listing",
    isMobileOnly: true,
    icon: <ClipboardList size={18} />,
  },
  {
    key: "feed-reported",
    label: "Reported Items",
    path: "/feed/reports",
    icon: <ShieldAlert size={18} />,
  },
  {
    key: "feed-settings",
    label: "Settings",
    path: "/feed/settings",
    icon: <Settings size={18} />,
  },
];

export const moderationItems = [
  {
    key: "mod-dashboard",
    label: "Dashboard",
    path: "/moderation",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "mod-moderation",
    label: "AI Moderation",
    path: "/moderation/settings",
    icon: <ShieldCheck size={18} />,
  },
  {
    key: "mod-banned",
    label: "Banned words",
    path: "/moderation/banned-words",
    icon: <Undo2 size={18} />,
  },
  {
    key: "mod-links",
    label: "Blocked Links",
    path: "/moderation/blocked-links",
    icon: <Globe size={18} />,
  },
];

export const reportedItems = [
  {
    key: "mod-reported",
    label: "Reported Items",
    path: "/reports",
    icon: <ShieldAlert size={18} />,
  },
];

// --- 3. REWARDS & GAMES ---
export const gamificationEngine = [
  {
    key: "engagement-activities",
    label: "Points & Badges",
    path: "/gamification/points-and-badges",
    isMobileOnly: true,
    icon: <Target size={18} />,
    children: [
      {
        key: "eng-dash",
        label: "Dashboard",
        path: "/gamification/points-and-badges",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "eng-points",
        label: "Points",
        path: "/gamification/points-and-badges/points",
        icon: <Coins size={18} />,
      },
      {
        key: "eng-badges",
        label: "Badges",
        path: "/gamification/points-and-badges/badges",
        icon: <Medal size={18} />,
      },
      {
        key: "eng-ranks",
        label: "Ranks",
        path: "/gamification/points-and-badges/ranks",
        icon: <TrendingUp size={18} />,
      },
      {
        key: "eng-leaderboard",
        label: "Leaderboard",
        path: "/gamification/points-and-badges/leaderboard",
        icon: <ListOrdered size={18} />,
      },
      {
        key: "eng-log",
        label: "Activity Log",
        path: "/gamification/points-and-badges/activity-log",
        icon: <History size={18} />,
      },
      {
        key: "eng-settings",
        label: "Settings",
        path: "/gamification/points-and-badges/settings",
        icon: <Settings size={18} />,
      },
    ],
  },
  {
    key: "engagement-games",
    label: "Member Games",
    path: "/gamification/engagement-games",
    isMobileOnly: true,
    icon: <Gamepad2 size={18} />,
    children: [
      {
        key: "game-dash",
        label: "Dashboard",
        path: "/gamification/engagement-games",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "game-spin",
        label: "Spin Wheel",
        path: "/gamification/engagement-games/spin-wheel",
        icon: <PlayCircle size={18} />,
      },
      {
        key: "game-scratch",
        label: "Scratch Card",
        path: "/gamification/engagement-games/scratch-card",
        icon: <Ticket size={18} />,
      },
      {
        key: "game-match",
        label: "Match & Win",
        path: "/gamification/engagement-games/match-win",
        icon: <Puzzle size={18} />,
      },
      {
        key: "game-settings",
        label: "Settings",
        path: "/gamification/engagement-games/settings",
        icon: <Settings size={18} />,
      },
    ],
  },
  {
    key: "rewards",
    label: "Rewards",
    path: "/gamification/rewards",
    isMobileOnly: true,
    icon: <Gift size={18} />,
    children: [
      {
        key: "rew-dash",
        label: "Dashboard",
        path: "/gamification/rewards",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "rcoupons",
        label: "Rewards & Vouchers",
        path: "/gamification/rewards/coupons",
        icon: <Tags size={18} />,
      },
      {
        key: "rew-coupons",
        label: "Create Reward",
        path: "/gamification/rewards/coupons/create",
        icon: <PlusCircle size={18} />,
      },
      {
        key: "redemptions",
        label: "Redemption",
        path: "/gamification/rewards/redemptions",
        icon: <CheckCircle size={18} />,
      },
      {
        key: "rew-fraud",
        label: "Fraud",
        path: "/gamification/rewards/fraud",
        icon: <AlertTriangle size={18} />,
      },
      {
        key: "rew-settings",
        label: "Settings",
        path: "/gamification/rewards/settings",
        icon: <Settings size={18} />,
      },
    ],
  },
  {
    key: "currency",
    label: "Currency",
    path: "/gamification/currency",
    isMobileOnly: true,
    icon: <Coins size={18} />,
    children: [
      {
        key: "cur-dash",
        label: "Dashboard",
        path: "/gamification/currency",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "cur-economics",
        label: "Economics",
        path: "/gamification/currency/economics",
        icon: <LineChart size={18} />,
      },
      {
        key: "cur-abuse",
        label: "Anti-Abuse",
        path: "/gamification/currency/risk",
        icon: <ShieldAlert size={18} />,
      },
      {
        key: "cur-trace",
        label: "Quick Trace",
        path: "/gamification/currency/trace",
        icon: <Waypoints size={18} />,
      },
      {
        key: "cur-audit",
        label: "Audit Log",
        path: "/gamification/currency/audit-log",
        icon: <History size={18} />,
      },
      {
        key: "cur-settings",
        label: "Settings",
        path: "/gamification/currency/settings",
        icon: <Settings size={18} />,
      },
    ],
  },

  {
    key: "impact-score",
    label: "Impact Score",
    path: "/gamification/impact-score",
    isMobileOnly: true,
    icon: <Trophy size={18} />,
    badge: "Beta",
    children: [
      {
        key: "imp-dash",
        label: "Dashboard",
        path: "/gamification/impact-score",
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: "imp-rules",
        label: "Rules",
        path: "/gamification/impact-score/rules",
        icon: <Scale size={18} />,
      },
      {
        key: "imp-audit",
        label: "Activity Log",
        path: "/gamification/impact-score/activity-log",
        icon: <History size={18} />,
      },
      {
        key: "imp-members",
        label: "Member Scores",
        path: "/gamification/impact-score/members",
        icon: <Users size={18} />,
      },
      {
        key: "imp-docs",
        label: "Documentation",
        path: "/gamification/impact-score/documentation",
        icon: <BookOpen size={18} />,
      },
      {
        key: "imp-settings",
        label: "Settings",
        path: "/gamification/impact-score/settings",
        icon: <Settings size={18} />,
      },
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
    key: "opportunities",
    label: "Opportunities",
    path: "/opportunities",
    isMobileOnly: true,
    icon: <Target size={18} />,
    children: [
      { key: "opp-dash", label: "Dashboard", path: "/opportunities" },
      {
        key: "opp-manage",
        label: "Manage Opportunities",
        path: "/opportunities/all",
      },
      {
        key: "opp-settings",
        label: "Settings",
        path: "/opportunities/settings",
      },
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
  {
    key: "sponsors",
    label: "Sponsors",
    path: "/sponsors",
    isMobileOnly: true,
    icon: <Users size={18} />,
    children: [
      { key: "sponsors-dash", label: "Dashboard", path: "/sponsors" },
      {
        key: "sponsors-manage",
        label: "Manage Sponsors",
        path: "/sponsors/all",
      },
      {
        key: "sponsors-create",
        label: "Create Sponsor",
        path: "/sponsors/create",
      },
    ],
  },
  {
    key: "Media Gallery",
    label: "Media Gallery",
    path: "/media-gallery",
    isMobileOnly: true,
    icon: <Images size={18} />,
    children: [
      {
        key: "mg-albums",
        label: "Albums",
        path: "/media-gallery",
      },
      {
        key: "mg-settings",
        label: "Settings",
        path: "/media-gallery/settings",
      },
    ],
  },
];

// --- 5. ADMIN SETTINGS ---
export const billingAndTeamItems = [
  {
    key: "acc-plan",
    label: "Subscription & Plan",
    path: "/settings/subscription",
    icon: <Wallet size={18} />,
  },
  {
    key: "account",
    label: "Account",
    icon: <CreditCard size={18} />,
    children: [
      { key: "acc-bill", label: "Billing History", path: "/settings/billing" },
      {
        key: "acc-bill-details",
        label: "Billing Details",
        path: "/settings/billing/details",
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
];

export const setupAndDesignItems = [
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
    ],
  },
  {
    key: "cust-dom",
    label: "Setup Domain",
    path: "/settings/domains",
    icon: <Globe size={18} />,
  },
  {
    key: "cust-mod",
    label: "Setup Modules",
    path: "/settings/modules",
    icon: <Blocks size={18} />,
  },
  {
    key: "cust-int",
    label: "Setup Integrations",
    path: "/settings/integrations#setup",
    icon: <Zap size={18} />,
  },
];

export const supportAndLegalItems = [
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
    key: "cust-support",
    label: "Contact Support",
    path: "/settings/contact",
    icon: <LifeBuoy size={18} />,
  },
  {
    key: "acc-audit",
    label: "Audit Log",
    path: "/audit-log",
    icon: <ClipboardList size={18} />,
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

// --- 7. WEBSITE BUILDER ---
export const websiteItems = [
  {
    key: "web-pages",
    label: "Pages",
    path: "/app-layout",
    icon: <FileText size={18} />,
  },
  {
    key: "web-create-page",
    label: "Create Page",
    path: "/app-layout/create",
    icon: <PaintbrushVerticalIcon size={18} />,
  },
  {
    key: "web-navigation",
    label: "Navigation",
    path: "/app-layout/navigation",
    icon: <Globe size={18} />,
  },
  {
    key: "web-footer",
    label: "Footer",
    path: "/app-layout/footer",
    icon: <Box size={18} />,
  },
  {
    key: "web-settings",
    label: "Settings",
    path: "/app-layout/settings",
    icon: <Settings size={18} />,
  },
];

// --- Legacy exports for compatibility while refactoring sidebar.tsx ---
export const main = homeItems;
export const settings = [
  ...billingAndTeamItems,
  ...setupAndDesignItems,
  ...supportAndLegalItems,
];
export const extendedItems = modules;
export const gamification = gamificationEngine;

export const emailItems = [
  {
    key: "email-dash",
    label: "Usage Dashboard",
    path: "/email/usage",
    icon: <BarChart3 size={18} />,
  },
  {
    key: "email-templates",
    label: "Manage Templates",
    path: "/email/templates",
    icon: <FileText size={18} />,
  },

  {
    key: "email-settings",
    label: "Email Settings",
    path: "/email/settings",
    icon: <Settings size={18} />,
  },
];

export const integrationsItems = [
  {
    key: "int-dashboard",
    label: "App Integrations",
    path: "/settings/integrations",
    icon: <Zap size={18} />,
  },
  {
    key: "int-crm",
    label: "CRM Hub",
    path: "/integrations/crm",
    icon: <Contact2 size={18} />,
  },
  {
    key: "int-shopify",
    label: "Shopify",
    path: "/integrations/shopify/user",
    icon: <ShoppingBag size={18} />,
  },
  {
    key: "int-woocommerce",
    label: "WooCommerce",
    path: "/integrations/woocommerce/user",
    icon: <Store size={18} />,
  },
];


export const mobileAppItems = [
  {
    key: "ma-android",
    label: "Android App",
    path: "/mobile-app/android",
    icon: <Smartphone size={18} />,
  },
  {
    key: "ma-ios",
    label: "iOS App",
    path: "/mobile-app/ios",
    icon: <Smartphone size={18} />,
  },
];

/**
 * Hook to filter menu items based on subscription AND user module permissions.
 */
export const useFilteredExtendedItems = () => {
  const { data, loading: subLoading } = useCheckEntitySubscription();
  const { data: integrationsData, loading: integrationsLoading } =
    useHasAnyIntegration();
  const user = useUserStore((state) => state.user);

  const filterItems = (
    items: any[],
    isHome: boolean = false,
    isModules: boolean = false,
  ) => {
    const modulesSub = data?.checkEntitySubscription?.modules || [];
    const modulePermissions = user?.modulePermissions || [];
    const isSuperAdmin = user?.isSuperAdmin;
    const isSystemRole = user?.role?.isSystem;

    const hasModulePermission = (
      moduleName: string,
      action: string = "canRead",
    ) => {
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
        if (
          !hasModulePermission("MODERATION") &&
          !hasModulePermission("AI_MODERATION")
        )
          return acc;
      }
      if (item.key.startsWith("int-")) {
        if (!integrationsData?.hasAnyIntegration) return acc;
        if (!hasModulePermission("INTEGRATIONS")) return acc;
      }

      // 2. Home items and Dashboard should always be visible (or conditionally)
      if (
        isHome ||
        item.key === "home-dashboard" ||
        item.key === "trust-center" ||
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
            if (child.key === "mod-moderation")
              return hasModulePermission("AI_MODERATION");
            if (child.key === "mod-banned" || child.key === "mod-links")
              return hasModulePermission("MODERATION");
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
      if (item.key === "engagement-activities") {
        subKey = "points & badges";
      } else if (item.key === "engagement-games") {
        subKey = "games center";
      }

      const matchingModule =
        modulesSub.find(
          (m: any) =>
            m.name?.toLowerCase().replace(/'/g, "_") === subKey &&
            m.canRename !== false,
        ) ||
        modulesSub.find(
          (m: any) => m.name?.toLowerCase().replace(/'/g, "_") === subKey,
        );
      const isSubscribed = enabledModuleIds.has(subKey);
      let mappedChildren = item.children;
      if (isModules && matchingModule?.customName && mappedChildren) {
        mappedChildren = mappedChildren.map((child: any) => {
          if (child.label.includes(item.label)) {
            return {
              ...child,
              label: child.label.replace(item.label, matchingModule.customName),
            };
          }
          return child;
        });
      }

      const mappedItem = {
        ...item,
        label:
          isModules && matchingModule?.customName
            ? matchingModule.customName
            : item.label,
        children: mappedChildren,
        isLocked: !isSubscribed,
        sortNumber: matchingModule?.showInWebNavigationSortNumber ?? 999,
      };

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

    return filteredList.sort((a: any, b: any) => {
      if (a.isLocked !== b.isLocked) {
        return a.isLocked ? 1 : -1;
      }
      const sortA = a.sortNumber ?? 999;
      const sortB = b.sortNumber ?? 999;
      return sortA - sortB;
    });
  };

  const filteredHome = useMemo(
    () => filterItems(homeItems, true),
    [data, user],
  );
  const filteredAiStudio = useMemo(
    () => filterItems(aiStudioItems, true),
    [data, user],
  );
  const filteredAiSuperAgents = useMemo(
    () => filterItems(aiSuperAgentsItems, true),
    [data, user],
  );
  const filteredAiChat = useMemo(
    () => filterItems(aiChatItems, true),
    [data, user],
  );
  const filteredMembers = useMemo(
    () => filterItems(membersIntelligence, true),
    [data, user],
  );
  const filteredFeed = useMemo(
    () => filterItems(feedItems, true),
    [data, user],
  );
  const filteredModeration = useMemo(
    () => filterItems(moderationItems, true),
    [data, user],
  );
  const filteredReported = useMemo(
    () => filterItems(reportedItems, true),
    [data, user],
  );
  const filteredGamification = useMemo(
    () => filterItems(gamificationEngine, false, true),
    [data, user],
  );
  const filteredModules = useMemo(
    () => filterItems(modules, false, true),
    [data, user],
  );
  const filteredIntegrations = useMemo(
    () => filterItems(integrationsItems, true),
    [data, user, integrationsData],
  );

  return {
    homeItems: filteredHome,
    aiStudioItems: filteredAiStudio,
    aiSuperAgentsItems: filteredAiSuperAgents,
    aiChatItems: filteredAiChat,
    membersIntelligence: filteredMembers,
    feedItems: filteredFeed as any[],
    moderationItems: filteredModeration as any[],
    reportedItems: filteredReported as any[],
    gamificationEngine: filteredGamification as any[],
    modules: filteredModules as any[],
    integrationsItems: filteredIntegrations as any[],
    loading: subLoading || integrationsLoading,
  };
};

/**
 * Hook to filter management menu items based on user system permissions.
 */
export const useFilteredManagementItems = () => {
  const user = useUserStore((state) => state.user);
  const isSuperAdmin = user?.isSuperAdmin;
  const isSystemRole = user?.role?.isSystem;

  const hasModulePermission = (
    moduleName: string,
    action: string = "canRead",
  ) => {
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

  const filterSettingsGroup = (group: any[]) => {
    if (isSuperAdmin || isSystemRole) return group;

    return group
      .map((section) => {
        const filteredSection = { ...section };

        // Top level section permission checks
        if (
          section.key === "customisation" ||
          section.key === "cust-dom" ||
          section.key === "cust-mod" ||
          section.key === "cust-int"
        ) {
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

        if (
          section.key === "account" ||
          section.key === "acc-plan" ||
          section.key === "acc-audit"
        ) {
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

        if (section.key === "cust-support") {
          if (
            !hasModulePermission("CONTACT_SUPPORT") &&
            !hasModulePermission("FEEDBACK")
          )
            return null;
        }

        // Filter children if they exist
        if (filteredSection.children) {
          filteredSection.children = filteredSection.children.filter(
            (child: any) => {
              if (child.key === "cust-logo" || child.key === "cust-brand")
                return hasModulePermission("APPEARANCE");
              if (child.key === "cust-dom")
                return hasModulePermission("DOMAIN");
              if (child.key === "cust-mod")
                return hasModulePermission("PLATFORM_FEATURES");
              if (child.key === "cust-lang")
                return hasModulePermission("LANGUAGES");
              if (child.key === "cust-int")
                return hasModulePermission("INTEGRATIONS");
              if (child.key === "cust-support")
                return hasModulePermission("CONTACT_SUPPORT");
              if (child.key === "team-users")
                return (
                  hasModulePermission("USERS_AND_PERMISSIONS") ||
                  hasModulePermission("ADMIN_USERS")
                );
              if (child.key === "acc-bill")
                return hasModulePermission("BILLING");
              if (child.key === "acc-plan")
                return hasModulePermission("SUBSCRIPTION");
              if (child.key === "acc-audit")
                return hasModulePermission("AUDIT_LOGS");
              if (child.key === "pol-privacy")
                return hasModulePermission("CUSTOMER_PRIVACY");
              if (child.key === "pol-terms")
                return hasModulePermission("POLICIES");
              if (child.key === "pol-taxes")
                return hasModulePermission("TAXES_AND_DUTIES");
              if (child.key === "sup-manager")
                return hasModulePermission("CONTACT_SUPPORT");

              return true;
            },
          );

          if (
            filteredSection.children.length === 0 &&
            section.children &&
            section.children.length > 0
          ) {
            return null;
          }
        }

        return filteredSection;
      })
      .filter(Boolean);
  };

  const filteredBillingAndTeam = useMemo(
    () => filterSettingsGroup(billingAndTeamItems),
    [user, isSuperAdmin, isSystemRole],
  );
  const filteredSetupAndDesign = useMemo(
    () => filterSettingsGroup(setupAndDesignItems),
    [user, isSuperAdmin, isSystemRole],
  );
  const filteredSupportAndLegal = useMemo(
    () => filterSettingsGroup(supportAndLegalItems),
    [user, isSuperAdmin, isSystemRole],
  );

  return {
    billingAndTeamItems: filteredBillingAndTeam,
    setupAndDesignItems: filteredSetupAndDesign,
    supportAndLegalItems: filteredSupportAndLegal,
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
