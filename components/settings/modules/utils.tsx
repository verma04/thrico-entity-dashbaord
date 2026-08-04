import React from "react";
import { Puzzle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Default icon mapping by module name (case-insensitive).
 * Used as a smart fallback when a module has no custom icon set.
 */
export const DEFAULT_MODULE_ICONS: Record<string, string> = {
  // Core
  directory: "Contact",
  members: "Contact",

  // Social & Community
  communities: "UsersRound",
  community: "UsersRound",
  groups: "UsersRound",

  // Events
  events: "CalendarDays",
  event: "CalendarDays",

  // Jobs & Career
  jobs: "BriefcaseBusiness",
  job: "BriefcaseBusiness",
  careers: "BriefcaseBusiness",

  // Opportunities
  opportunities: "Compass",
  opportunity: "Compass",

  // Marketplace & Listings
  listing: "ShoppingBag",
  listings: "ShoppingBag",
  marketplace: "ShoppingBag",

  // Video / Moments
  moments: "Clapperboard",
  reels: "Clapperboard",
  videos: "Clapperboard",

  // Shop / Store
  shop: "Store",
  store: "Store",

  // Forums & Discussions
  forums: "MessageSquareText",
  forum: "MessageSquareText",
  discussions: "MessageSquareText",

  // Polls
  polls: "BarChart3",
  poll: "BarChart3",

  // Surveys
  surveys: "ClipboardList",
  survey: "ClipboardList",

  // Mentorship
  mentorship: "GraduationCap",
  mentoring: "GraduationCap",

  // Offers & Deals
  offers: "Percent",
  deals: "Percent",
  coupons: "Percent",

  // Sponsors
  sponsors: "Handshake",
  sponsor: "Handshake",
  partnerships: "Handshake",

  // Media Gallery
  "media gallery": "Images",
  gallery: "Images",
  photos: "Images",
  albums: "Images",

  // Feed / Posts
  feed: "Rss",
  posts: "Rss",
  news: "Newspaper",

  // Courses / Learning
  courses: "BookOpen",
  learning: "BookOpen",
  learnings: "BookOpen",

  // Wall of Fame
  "wall of fame": "Trophy",
  achievements: "Trophy",

  // Gamification
  "points & badges": "Target",
  "impact score": "TrendingUp",
  rewards: "Gift",
  currency: "Coins",
  games: "Gamepad2",

  // Moderation
  moderation: "ShieldAlert",
  reports: "Flag",

  // Trust Center
  "trust center": "ShieldCheck",

  // Email
  email: "Mail",

  // Notifications
  notifications: "Bell",

  // Stories
  stories: "CircleDot",

  // Referrals
  referrals: "UserPlus",

  // Feedback
  feedback: "MessageCircle",
};

export const getNavIcon = (icon: string | null, enabled: boolean = true, moduleName?: string) => {
  // First try the explicit icon
  if (icon && typeof icon === "string" && icon in LucideIcons) {
    const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
    return <IconComponent className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
  }

  // Fallback: try to match by module name
  if (moduleName) {
    const key = moduleName.toLowerCase().trim();
    const fallbackIcon = DEFAULT_MODULE_ICONS[key];
    if (fallbackIcon && fallbackIcon in LucideIcons) {
      const IconComponent = (LucideIcons as any)[fallbackIcon] as React.ElementType;
      return <IconComponent className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
    }
  }

  // Final fallback
  return <Puzzle className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
};

export const ALL_LUCIDE_ICONS = Object.keys(LucideIcons).filter((key) => {
  if (
    key === "default" ||
    key === "createLucideIcon" ||
    key === "LucideIcon" ||
    key.endsWith("Icon") ||
    key.startsWith("use")
  ) {
    return false;
  }
  return /^[A-Z]/.test(key) && Boolean((LucideIcons as any)[key]);
});

export const POPULAR_LUCIDE_ICONS = [
  // People & Community
  "Users", "User", "UserPlus", "UserCheck", "UserGroup", "Smile", "Heart", "Handshake", "ThumbsUp", "Crown",
  
  // Content & Learning
  "BookOpen", "GraduationCap", "Award", "FileText", "Folder", "Newspaper", "Library", "Book", "Bookmark", "Feather",
  
  // Events & Scheduling
  "Calendar", "Clock", "MapPin", "Compass", "Navigation", "Ticket", "Flag", "Globe", "Sun", "Moon",
  
  // Communication
  "MessageSquare", "MessageCircle", "Mail", "Bell", "Phone", "Send", "Share2", "Radio", "Megaphone", "Headphones",
  
  // Media & Design
  "Video", "Camera", "Image", "Film", "Music", "Play", "Sparkles", "Palette", "Layers", "LayoutGrid",
  
  // Business & Commerce
  "Briefcase", "Building", "Store", "ShoppingBag", "ShoppingCart", "DollarSign", "CreditCard", "Tag", "Receipt", "Wallet",
  
  // Tech & Data
  "Cpu", "Database", "Terminal", "Code", "Zap", "Server", "Cloud", "Lock", "Key", "Shield",
  
  // Charts & Analytics
  "BarChart3", "PieChart", "TrendingUp", "Activity", "Target", "Sliders", "Filter", "Search", "CheckSquare", "Grid",
  
  // General & Tools
  "Settings", "Box", "Package", "Tool", "Wrench", "Compass", "Link", "Star", "Flame", "BadgeAlert"
];



