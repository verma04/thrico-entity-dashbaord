import React from "react";
import { Coins, Ticket, XCircle } from "lucide-react";
import { RewardType } from "./types";

export const SEGMENT_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#c026d3",
  "#4f46e5",
  "#0d9488",
  "#ea580c",
  "#e11d48",
  "#7c2d12",
];

export const REWARD_LABELS: Record<RewardType, string> = {
  COINS: "Coins",
  VOUCHER: "Voucher",
  NO_REWARDS: "No Rewards",
};

export const REWARD_BADGE: Record<RewardType, string> = {
  COINS: "bg-amber-50 text-amber-700 border border-amber-100",
  VOUCHER: "bg-blue-50 text-blue-700 border border-blue-100",
  NO_REWARDS: "bg-muted text-muted-foreground border border-border",
};

export const REWARD_ICON: Record<RewardType, React.ReactNode> = {
  COINS: <Coins className="h-3 w-3" />,
  VOUCHER: <Ticket className="h-3 w-3" />,
  NO_REWARDS: <XCircle className="h-3 w-3" />,
};
