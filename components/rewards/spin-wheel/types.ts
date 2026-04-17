export type RewardType = "TC" | "VOUCHER" | "PREMIUM" | "NOTHING";

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
