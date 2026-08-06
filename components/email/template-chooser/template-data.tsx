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
  accentColor: string; // hex/HSL for thumbnail accent
  headerGradient: string; // tailwind gradient classes
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: "blue" | "green" | "rose" | "amber";
  featured?: boolean;
  // Thumbnail detail lines
  lines?: Array<{ w: string; opacity?: number }>;
}

export const STARTERS: StarterEntry[] = [
  {
    key: "blank",
    label: "Blank Canvas",
    description: "Start completely from scratch with an empty layout",
    category: "All",
    accentColor: "#94a3b8",
    headerGradient: "",
    icon: <Plus size={20} className="text-slate-400" />,
    lines: [],
  },
  {
    key: "welcome",
    label: "Welcome Email",
    description: "Warm onboarding email for new members joining your platform",
    category: "Onboarding",
    accentColor: "#4f46e5",
    headerGradient: "from-blue-500 via-indigo-500 to-violet-600",
    icon: <Mail size={16} className="text-primary" />,
    badge: "Popular",
    badgeVariant: "blue",
    featured: true,
    lines: [
      { w: "w-3/5" },
      { w: "w-full", opacity: 50 },
      { w: "w-4/5", opacity: 50 },
      { w: "w-2/3", opacity: 50 },
    ],
  },
  {
    key: "newsletter",
    label: "Monthly Newsletter",
    description: "Curated digest of top platform activity and highlights",
    category: "Newsletter",
    accentColor: "#10b981",
    headerGradient: "from-emerald-400 via-teal-500 to-cyan-600",
    icon: <FileText size={16} className="text-primary" />,
    badge: "Popular",
    badgeVariant: "green",
    featured: true,
    lines: [
      { w: "w-1/2" },
      { w: "w-full", opacity: 50 },
      { w: "w-full", opacity: 50 },
      { w: "w-3/4", opacity: 50 },
    ],
  },
  {
    key: "event_reminder",
    label: "Event Reminder",
    description: "Remind attendees 24 hours before their upcoming event",
    category: "Events",
    accentColor: "#7c3aed",
    headerGradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    icon: <Calendar size={16} className="text-primary" />,
    lines: [
      { w: "w-2/3" },
      { w: "w-full", opacity: 50 },
      { w: "w-5/6", opacity: 50 },
    ],
  },
  {
    key: "job_alert",
    label: "Job Match Alert",
    description: "Notify candidates about relevant new job openings",
    category: "Jobs",
    accentColor: "#d97706",
    headerGradient: "from-amber-400 via-orange-400 to-orange-500",
    icon: <Briefcase size={16} className="text-primary" />,
    lines: [
      { w: "w-3/5" },
      { w: "w-full", opacity: 50 },
      { w: "w-4/5", opacity: 50 },
      { w: "w-1/2", opacity: 50 },
    ],
  },
  {
    key: "community_digest",
    label: "Community Digest",
    description: "Weekly highlights from your most active communities",
    category: "Communities",
    accentColor: "#0ea5e9",
    headerGradient: "from-cyan-400 via-sky-500 to-blue-600",
    icon: <Users size={16} className="text-primary" />,
    lines: [
      { w: "w-1/2" },
      { w: "w-full", opacity: 50 },
      { w: "w-3/4", opacity: 50 },
    ],
  },
  {
    key: "re_engagement",
    label: "Re-engagement",
    description: "Win back inactive members with a personalized message",
    category: "Marketing",
    accentColor: "#e11d48",
    headerGradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    icon: <Zap size={16} className="text-primary" />,
    badge: "New",
    badgeVariant: "rose",
    lines: [
      { w: "w-2/3" },
      { w: "w-full", opacity: 50 },
      { w: "w-5/6", opacity: 50 },
    ],
  },
  {
    key: "promotional",
    label: "Promotional Offer",
    description: "Announce deals, launches, or limited-time shop offers",
    category: "Shop",
    accentColor: "#a855f7",
    headerGradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    icon: <ShoppingCart size={16} className="text-primary" />,
    lines: [
      { w: "w-3/4" },
      { w: "w-full", opacity: 50 },
      { w: "w-2/3", opacity: 50 },
      { w: "w-full", opacity: 50 },
    ],
  },
  {
    key: "survey_followup",
    label: "Survey Follow-up",
    description: "Thank users and share key results from your survey",
    category: "Surveys",
    accentColor: "#ca8a04",
    headerGradient: "from-yellow-400 via-amber-400 to-orange-400",
    icon: <Star size={16} className="text-primary" />,
    lines: [
      { w: "w-1/2" },
      { w: "w-full", opacity: 50 },
      { w: "w-5/6", opacity: 50 },
    ],
  },
  {
    key: "announcement",
    label: "Announcement",
    description: "Important platform announcements and product updates",
    category: "Marketing",
    accentColor: "#0f766e",
    headerGradient: "from-teal-500 via-emerald-500 to-green-600",
    icon: <Sparkles size={16} className="text-primary" />,
    lines: [
      { w: "w-2/3" },
      { w: "w-full", opacity: 50 },
      { w: "w-3/4", opacity: 50 },
    ],
  },
  {
    key: "notification",
    label: "Notification Email",
    description: "Simple transactional notification for platform events",
    category: "Transactional",
    accentColor: "#475569",
    headerGradient: "from-slate-500 via-slate-600 to-slate-700",
    icon: <Bell size={16} className="text-primary" />,
    lines: [
      { w: "w-2/3" },
      { w: "w-full", opacity: 50 },
      { w: "w-5/6", opacity: 50 },
    ],
  },
];

export const SIDEBAR_CATEGORIES = [
  { key: "All", label: "All Templates", icon: <LayoutTemplate size={14} /> },
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
  blue: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  green: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rose: "bg-rose-100 text-rose-700 border border-rose-200",
  amber: "bg-amber-100 text-amber-700 border border-amber-200",
};
