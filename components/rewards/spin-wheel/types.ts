export type RewardType = "COINS" | "VOUCHER" | "NO_REWARDS";

export interface WheelSegment {
  id: string;
  label: string;
  rewardType: RewardType;
  rewardValue: number;
  probability: number;
  color: string;
  isActive: boolean;
  sortOrder: number;
  rewardId?: string;
  reward?: { id: string; title: string; image?: string };
}
