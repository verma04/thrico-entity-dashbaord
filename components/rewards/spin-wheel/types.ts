import { GameRewardType } from "../shared/engagement-game-reward-types";

export type RewardType =
  | "COINS"
  | "NO_REWARDS"
  | "INTERNAL_VOUCHER"
  | "GIFT_CARD"
  | "ECOMMERCE"
  | "VOUCHER";

export interface WheelSegment {
  id: string;
  configId?: string;
  label: string;
  rewardType: RewardType;
  rewardValue: number;
  probability: number;
  color: string;
  isActive: boolean;
  sortOrder: number;
  storeDiscountRuleId?: string;
  manualBatchId?: string;
  digitalCardRuleId?: string;
  storeDiscountRule?: {
    id: string;
    title: string;
    discountValue?: number;
  };
  manualBatch?: {
    id: string;
    name: string;
    totalCount?: number;
  };
  digitalCardRule?: {
    id: string;
    title: string;
    faceValue?: number;
    totalCost?: number;
  };
  mechanism?: {
    type: string;
    ruleId?: string;
    manualBatchId?: string;
    storeDiscountRuleId?: string;
    digitalCardRuleId?: string;
  };
  rewardId?: string;
  // Direct creation parameters
  giftCardBrand?: string;
  giftCardProductId?: string;
  giftCardDenomination?: number;
  ecommerceDiscountType?: "PERCENTAGE" | "FIXED_AMOUNT";
  ecommerceDiscountValue?: number;
  ecommerceTitle?: string;
}
