import {
  Award,
  Mail,
  Users,
  Bell,
  Tag,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { AutomationActionType } from "./types";

export interface ActionMetadataItem {
  type: AutomationActionType;
  label: string;
  desc: string;
  icon: any;
  color: string;
  badgeBg: string;
  badgeLabel: string;
}

export const SHARED_PALETTE_ACTIONS: ActionMetadataItem[] = [
  {
    type: "ASSIGN_MEMBERSHIP_TIER",
    label: "Assign Tier",
    desc: "Reward tier upgrade & perks",
    icon: Award,
    color: "from-amber-500 to-amber-600 text-amber-600 bg-amber-500/10 border-amber-500/20",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    badgeLabel: "Tier Reward",
  },
  {
    type: "EMAIL",
    label: "Send Email",
    desc: "Personalized Email Studio template",
    icon: Mail,
    color: "from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    badgeLabel: "Email Studio",
  },
  {
    type: "COMMUNITY_JOIN",
    label: "Join Circle",
    desc: "Auto-enroll member into community",
    icon: Users,
    color: "from-blue-500 to-blue-600 text-blue-600 bg-blue-500/10 border-blue-500/20",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    badgeLabel: "Circle Access",
  },
  {
    type: "NOTIFICATION",
    label: "Push Alert",
    desc: "Mobile lock screen & bell notice",
    icon: Bell,
    color: "from-purple-500 to-purple-600 text-purple-600 bg-purple-500/10 border-purple-500/20",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    badgeLabel: "Alert Notice",
  },
  {
    type: "ADD_MEMBER_TAG",
    label: "Member Tags",
    desc: "Segment profile with active tags",
    icon: Tag,
    color: "from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    badgeLabel: "Tagging",
  },
  {
    type: "WHATSAPP_TEMPLATE",
    label: "WhatsApp Message",
    desc: "Send Meta-approved template message",
    icon: MessageSquare,
    color: "from-green-500 to-green-600 text-green-600 bg-green-500/10 border-green-500/20",
    badgeBg: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    badgeLabel: "WhatsApp",
  },
];

export const getSharedActionMeta = (type: AutomationActionType | string) => {
  const found = SHARED_PALETTE_ACTIONS.find((a) => a.type === type);
  if (found) return found;

  return {
    type: type as AutomationActionType,
    label: "Workflow Action",
    desc: "Automated execution step.",
    icon: Sparkles,
    color: "from-zinc-500 to-zinc-600 text-zinc-600 bg-zinc-500/10 border-zinc-500/20",
    badgeBg: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
    badgeLabel: "Action",
  };
};
