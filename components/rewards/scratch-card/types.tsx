export type RewardType = "COINS" | "VOUCHER" | "NO_REWARDS";

export interface ScratchRewardTier {
  id: string;
  label: string;
  rewardType: RewardType;
  rewardValue: number;
  cardColor: string;
  isActive?: boolean;
  rewardId: string | null;
  minAccountAge: number;
  minActivity: number;
  eligibilityDescription: string;
}

export const REWARD_LABELS: Record<RewardType, string> = {
  COINS: "Coins",
  VOUCHER: "Voucher",
  NO_REWARDS: "No Reward",
};

export const REWARD_BADGE: Record<RewardType, string> = {
  COINS: "bg-amber-50 text-amber-700 border border-amber-100",
  VOUCHER: "bg-blue-50 text-blue-700 border border-blue-100",
  NO_REWARDS: "bg-muted text-muted-foreground border border-border",
};

import React from "react";
import { Coins, Ticket, XCircle } from "lucide-react";

export const REWARD_ICON: Record<RewardType, React.ReactNode> = {
  COINS: <Coins className="h-3 w-3" />,
  VOUCHER: <Ticket className="h-3 w-3" />,
  NO_REWARDS: <XCircle className="h-3 w-3" />,
};
