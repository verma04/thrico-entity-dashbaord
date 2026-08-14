import React from "react";
import {
  Plus,
  Mail,
  FileText,
  Calendar,
  Briefcase,
  Users,
  Zap,
  ShoppingCart,
  Star,
  Sparkles,
  Bell,
  LayoutTemplate,
  Gift,
  Trophy,
} from "lucide-react";
import { STARTER_TEMPLATES } from "@/lib/email-templates";

export const STARTER_KEY_MAP: Record<string, keyof typeof STARTER_TEMPLATES> = {
  welcome: "WELCOME",
  newsletter: "NEWSLETTER",
  event_reminder: "EVENT",
  community_digest: "NEWSLETTER",
  announcement: "ANNOUNCEMENT",
  notification: "ANNOUNCEMENT",
  re_engagement: "WELCOME",
  promotional: "ANNOUNCEMENT",
  survey_followup: "NEWSLETTER",
  job_alert: "WELCOME",
};

export interface StarterEntry {
  key: string;
  label: string;
  description: string;
  category: string;
  accentColor: string;
  headerGradient: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: "blue" | "green" | "rose" | "amber" | "purple";
  featured?: boolean;
  wireframe: {
    heroType?: "banner" | "icon" | "minimal" | "split";
    hasNav?: boolean;
    buttonText?: string;
    buttonColor?: string;
    textLines?: number;
  };
}

export const STARTERS: StarterEntry[] = [
  {
    key: "blank",
    label: "Blank Canvas",
    description: "Start completely from scratch with an empty drag-and-drop workspace",
    category: "All",
    accentColor: "#64748b",
    headerGradient: "from-zinc-400 to-zinc-600",
    icon: <Plus size={20} className="text-zinc-500" />,
    wireframe: {
      heroType: "minimal",
      textLines: 2,
    },
  },
  {
    key: "welcome",
    label: "Welcome Onboarding",
    description: "Warm introductory email for new members joining your community",
    category: "Onboarding",
    accentColor: "#6366f1",
    headerGradient: "from-blue-500 via-indigo-500 to-violet-600",
    icon: <Mail size={16} className="text-indigo-500" />,
    badge: "Popular",
    badgeVariant: "blue",
    featured: true,
    wireframe: {
      heroType: "banner",
      buttonText: "Explore Dashboard",
      buttonColor: "#4f46e5",
      textLines: 3,
    },
  },
  {
    key: "newsletter",
    label: "Monthly Newsletter",
    description: "Curated digest of platform highlights, articles, and top stories",
    category: "Newsletter",
    accentColor: "#10b981",
    headerGradient: "from-emerald-400 via-teal-500 to-cyan-600",
    icon: <FileText size={16} className="text-emerald-500" />,
    badge: "Featured",
    badgeVariant: "green",
    featured: true,
    wireframe: {
      heroType: "split",
      hasNav: true,
      buttonText: "Read Edition",
      buttonColor: "#059669",
      textLines: 4,
    },
  },
  {
    key: "event_reminder",
    label: "Event Countdown",
    description: "Upcoming event reminder with calendar invite links and agenda",
    category: "Events",
    accentColor: "#8b5cf6",
    headerGradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    icon: <Calendar size={16} className="text-violet-500" />,
    badge: "Calendar",
    badgeVariant: "purple",
    wireframe: {
      heroType: "banner",
      buttonText: "Join Live Event",
      buttonColor: "#7c3aed",
      textLines: 3,
    },
  },
  {
    key: "promotional",
    label: "Commerce & Rewards",
    description: "Announce shop discounts, voucher drops, or seasonal product sales",
    category: "Shop",
    accentColor: "#ec4899",
    headerGradient: "from-pink-500 via-rose-500 to-red-500",
    icon: <ShoppingCart size={16} className="text-pink-500" />,
    badge: "E-Commerce",
    badgeVariant: "rose",
    wireframe: {
      heroType: "banner",
      buttonText: "Claim Discount",
      buttonColor: "#db2777",
      textLines: 3,
    },
  },
  {
    key: "job_alert",
    label: "Career & Job Matches",
    description: "Alert members about new opportunities matching their skills",
    category: "Jobs",
    accentColor: "#f59e0b",
    headerGradient: "from-amber-400 via-orange-500 to-amber-600",
    icon: <Briefcase size={16} className="text-amber-500" />,
    wireframe: {
      heroType: "split",
      buttonText: "View Open Roles",
      buttonColor: "#d97706",
      textLines: 3,
    },
  },
  {
    key: "community_digest",
    label: "Community Digest",
    description: "Weekly roundup of trending forum topics and active member discussions",
    category: "Communities",
    accentColor: "#0284c7",
    headerGradient: "from-sky-400 via-blue-500 to-indigo-600",
    icon: <Users size={16} className="text-sky-500" />,
    wireframe: {
      heroType: "split",
      hasNav: true,
      buttonText: "Join Discussion",
      buttonColor: "#0284c7",
      textLines: 3,
    },
  },
  {
    key: "announcement",
    label: "Product Announcement",
    description: "Broadcast major platform milestones, feature updates, or notices",
    category: "Marketing",
    accentColor: "#0d9488",
    headerGradient: "from-teal-500 via-emerald-500 to-cyan-600",
    icon: <Sparkles size={16} className="text-teal-500" />,
    badge: "Official",
    badgeVariant: "blue",
    wireframe: {
      heroType: "banner",
      buttonText: "Learn More",
      buttonColor: "#0f766e",
      textLines: 3,
    },
  },
  {
    key: "re_engagement",
    label: "Re-engagement Campaign",
    description: "Win back inactive members with a personalized highlight digest",
    category: "Marketing",
    accentColor: "#f43f5e",
    headerGradient: "from-rose-500 via-red-500 to-orange-500",
    icon: <Zap size={16} className="text-rose-500" />,
    badge: "Retention",
    badgeVariant: "rose",
    wireframe: {
      heroType: "minimal",
      buttonText: "Welcome Back",
      buttonColor: "#e11d48",
      textLines: 3,
    },
  },
  {
    key: "survey_followup",
    label: "Feedback & Survey",
    description: "Gather feedback or share community survey outcomes",
    category: "Surveys",
    accentColor: "#eab308",
    headerGradient: "from-amber-400 via-yellow-500 to-orange-500",
    icon: <Star size={16} className="text-amber-500" />,
    wireframe: {
      heroType: "minimal",
      buttonText: "Take 2-Min Survey",
      buttonColor: "#ca8a04",
      textLines: 3,
    },
  },
  {
    key: "notification",
    label: "Account Notification",
    description: "Clean transactional alert for security, verification, or receipts",
    category: "Transactional",
    accentColor: "#64748b",
    headerGradient: "from-slate-600 to-zinc-800",
    icon: <Bell size={16} className="text-slate-500" />,
    wireframe: {
      heroType: "minimal",
      buttonText: "Review Account",
      buttonColor: "#334155",
      textLines: 2,
    },
  },
];

export const SIDEBAR_CATEGORIES = [
  { key: "All", label: "All Starters", icon: <LayoutTemplate size={14} /> },
  { key: "Onboarding", label: "Onboarding", icon: <Mail size={14} /> },
  { key: "Newsletter", label: "Newsletter", icon: <FileText size={14} /> },
  { key: "Events", label: "Events", icon: <Calendar size={14} /> },
  { key: "Jobs", label: "Jobs & Careers", icon: <Briefcase size={14} /> },
  { key: "Communities", label: "Communities", icon: <Users size={14} /> },
  { key: "Marketing", label: "Marketing", icon: <Zap size={14} /> },
  { key: "Shop", label: "Shop & Commerce", icon: <ShoppingCart size={14} /> },
  { key: "Surveys", label: "Surveys", icon: <Star size={14} /> },
  { key: "Transactional", label: "Transactional", icon: <Bell size={14} /> },
];

export const BADGE_STYLES: Record<string, string> = {
  blue: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
};
