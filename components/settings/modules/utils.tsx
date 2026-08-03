import React from "react";
import { Puzzle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

export const getNavIcon = (icon: string | null, enabled: boolean = true) => {
  if (!icon || typeof icon !== "string" || !(icon in LucideIcons)) {
    return <Puzzle className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
  }
  const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
  return <IconComponent className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
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



