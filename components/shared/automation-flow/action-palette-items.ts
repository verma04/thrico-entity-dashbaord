import {
  Award,
  Mail,
  Users,
  Bell,
  Tag,
  Sparkles,
  MessageSquare,
  Globe,
  Coins,
  ShieldCheck,
  Send,
  Code2,
} from "lucide-react";
import { AutomationActionType } from "./types";

export type ActionChannelId =
  | "COMMUNITY"
  | "ENTITY"
  | "COMMUNICATION"
  | "INTEGRATION";

export interface ActionCategoryMeta {
  id: ActionChannelId;
  label: string;
  sublabel: string;
  badge: string;
  icon: any;
  color: string;
}

export const ACTION_CATEGORIES: Record<ActionChannelId, ActionCategoryMeta> = {
  COMMUNITY: {
    id: "COMMUNITY",
    label: "Community Channels",
    sublabel: "Spaces & Circle Discussions",
    badge: "Community",
    icon: Users,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  ENTITY: {
    id: "ENTITY",
    label: "Member & Identity",
    sublabel: "Entity Channels · Tier, Tags & Points",
    badge: "Entity Channel",
    icon: ShieldCheck,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  COMMUNICATION: {
    id: "COMMUNICATION",
    label: "Communication Channels",
    sublabel: "Email, Push & Direct Messaging",
    badge: "Outreach",
    icon: Send,
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
  INTEGRATION: {
    id: "INTEGRATION",
    label: "Developer & Integrations",
    sublabel: "Webhooks & External APIs",
    badge: "API",
    icon: Code2,
    color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  },
};

export interface ActionMetadataItem {
  type: AutomationActionType;
  label: string;
  desc: string;
  icon: any;
  color: string;
  badgeBg: string;
  badgeLabel: string;
  category: ActionChannelId;
}

export const MEMBER_PALETTE_ACTIONS: ActionMetadataItem[] = [
  // Community Channel
  {
    type: "COMMUNITY_JOIN",
    label: "Auto-Join Community Circle",
    desc: "Auto-enroll member into circle discussions",
    icon: Users,
    color: "from-blue-500 to-blue-600 text-blue-600 bg-blue-500/10 border-blue-500/20",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    badgeLabel: "Circle Access",
    category: "COMMUNITY",
  },
  // Entity Channels (Member & Identity)
  {
    type: "ASSIGN_MEMBERSHIP_TIER",
    label: "Assign Membership Tier",
    desc: "Award rank, permissions, and tier perks",
    icon: Award,
    color: "from-amber-500 to-amber-600 text-amber-600 bg-amber-500/10 border-amber-500/20",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    badgeLabel: "Rank & Perks",
    category: "ENTITY",
  },
  {
    type: "ADD_MEMBER_TAG",
    label: "Assign Member Tags",
    desc: "Add segmented tags to member profile",
    icon: Tag,
    color: "from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    badgeLabel: "Tagging",
    category: "ENTITY",
  },
  {
    type: "AWARD_POINTS",
    label: "Award Gamification Points",
    desc: "Reward points directly to member wallet",
    icon: Coins,
    color: "from-amber-500 to-amber-600 text-amber-600 bg-amber-500/10 border-amber-500/20",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    badgeLabel: "Gamification",
    category: "ENTITY",
  },
  // Communication Channels
  {
    type: "EMAIL",
    label: "Send Automated Email",
    desc: "Personalized onboarding or welcome email",
    icon: Mail,
    color: "from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    badgeLabel: "Email Studio",
    category: "COMMUNICATION",
  },
  {
    type: "NOTIFICATION",
    label: "Mobile Push & Notification",
    desc: "Mobile lock screen push & bell alert",
    icon: Bell,
    color: "from-purple-500 to-purple-600 text-purple-600 bg-purple-500/10 border-purple-500/20",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    badgeLabel: "Push Alert",
    category: "COMMUNICATION",
  },
  // Developer & Integrations
  {
    type: "CUSTOM_WEBHOOK",
    label: "Custom Webhook",
    desc: "Send member data to external API, CRM, or service",
    icon: Globe,
    color: "from-violet-500 to-violet-600 text-violet-600 bg-violet-500/10 border-violet-500/20",
    badgeBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    badgeLabel: "API",
    category: "INTEGRATION",
  },
];

export const SHARED_PALETTE_ACTIONS: ActionMetadataItem[] = [
  ...MEMBER_PALETTE_ACTIONS,
  {
    type: "WHATSAPP_TEMPLATE",
    label: "WhatsApp Message",
    desc: "Send Meta-approved template message",
    icon: MessageSquare,
    color: "from-green-500 to-green-600 text-green-600 bg-green-500/10 border-green-500/20",
    badgeBg: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    badgeLabel: "WhatsApp",
    category: "COMMUNICATION",
  },
];

export interface CategorizedPaletteGroup {
  category: ActionCategoryMeta;
  items: ActionMetadataItem[];
}

export const getCategorizedActions = (
  items: ActionMetadataItem[]
): CategorizedPaletteGroup[] => {
  const categoryOrder: ActionChannelId[] = [
    "COMMUNITY",
    "ENTITY",
    "COMMUNICATION",
    "INTEGRATION",
  ];

  return categoryOrder
    .map((catId) => {
      const catMeta = ACTION_CATEGORIES[catId];
      const matchingItems = items.filter((item) => item.category === catId);
      return {
        category: catMeta,
        items: matchingItems,
      };
    })
    .filter((group) => group.items.length > 0);
};

export const getSharedActionMeta = (type: AutomationActionType | string): ActionMetadataItem => {
  const normalizedType = type === "WEBHOOK" ? "CUSTOM_WEBHOOK" : type;
  const found = SHARED_PALETTE_ACTIONS.find((a) => a.type === normalizedType);
  if (found) return found;

  return {
    type: type as AutomationActionType,
    label: "Workflow Action",
    desc: "Automated execution step.",
    icon: Sparkles,
    color: "from-zinc-500 to-zinc-600 text-zinc-600 bg-zinc-500/10 border-zinc-500/20",
    badgeBg: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
    badgeLabel: "Action",
    category: "ENTITY",
  };
};
