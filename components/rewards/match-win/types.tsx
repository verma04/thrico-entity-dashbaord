import React from "react";
import {
  Coins,
  Ticket,
  RotateCcw,
  Gift,
  ShoppingBag,
} from "lucide-react";
import {
  GameRewardType,
  GIFT_CARD_BRANDS,
  GIFT_CARD_DENOMINATIONS,
  TRY_AGAIN_PRESETS,
  ECOMMERCE_PERCENT_PRESETS,
  ECOMMERCE_FIXED_PRESETS,
  GAME_REWARD_TYPE_OPTIONS,
  GAME_REWARD_BADGE,
  GAME_REWARD_ICON,
  GAME_REWARD_LABELS,
  resolveGameRewardType,
} from "../shared/engagement-game-reward-types";

export {
  GIFT_CARD_BRANDS,
  GIFT_CARD_DENOMINATIONS,
  TRY_AGAIN_PRESETS,
  ECOMMERCE_PERCENT_PRESETS,
  ECOMMERCE_FIXED_PRESETS,
  GAME_REWARD_TYPE_OPTIONS,
  resolveGameRewardType,
};

export type PrizeType =
  | "COINS"
  | "TC"
  | "VOUCHER"
  | "PREMIUM"
  | "NO_REWARDS"
  | "NOTHING"
  | "INTERNAL_VOUCHER"
  | "GIFT_CARD"
  | "ECOMMERCE";

export interface MatchWinSymbol {
  id?: string;
  configId?: string;
  key: string;
  label: string;
  icon: string;
  color: string;
  sortOrder?: number;
}

export interface MatchWinCombination {
  id?: string;
  configId?: string;
  key: string;
  type: PrizeType;
  value: number;
  probability: number;
  maxWins?: number | null;
  rewardId?: string;
  symbol1Id?: string;
  symbol2Id?: string;
  symbol3Id?: string;
  symbol1?: MatchWinSymbol;
  symbol2?: MatchWinSymbol;
  symbol3?: MatchWinSymbol;
  isActive?: boolean;
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
  reward?: {
    id: string;
    title: string;
    description?: string;
    image?: string;
    rewardType?: string;
    provider?: string;
    discountType?: string;
    discountValue?: number;
    couponCode?: string;
    couponType?: string;
  };
  // Direct creation parameters
  giftCardBrand?: string;
  giftCardProductId?: string;
  giftCardDenomination?: number;
  ecommerceDiscountType?: "PERCENTAGE" | "FIXED_AMOUNT";
  ecommerceDiscountValue?: number;
  ecommerceTitle?: string;
}

export const REWARD_LABELS: Record<string, string> = {
  ...GAME_REWARD_LABELS,
  COINS: "Points",
  VOUCHER: "Internal Voucher",
  NO_REWARDS: "Try Again (Loss)",
  INTERNAL_VOUCHER: "Internal Voucher",
  GIFT_CARD: "Gift Card",
  ECOMMERCE: "Shopify Discount",
};

export const REWARD_BADGE: Record<string, string> = {
  ...GAME_REWARD_BADGE,
  COINS: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/60",
  VOUCHER: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/60",
  NO_REWARDS: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  INTERNAL_VOUCHER: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/60",
  GIFT_CARD: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/60",
  ECOMMERCE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/60",
};

export const REWARD_ICON: Record<string, React.ReactNode> = {
  ...GAME_REWARD_ICON,
  COINS: <Coins className="h-3 w-3 text-amber-600" />,
  VOUCHER: <Ticket className="h-3 w-3 text-blue-600" />,
  NO_REWARDS: <RotateCcw className="h-3 w-3 text-zinc-500" />,
  INTERNAL_VOUCHER: <Ticket className="h-3 w-3 text-blue-600" />,
  GIFT_CARD: <Gift className="h-3 w-3 text-purple-600" />,
  ECOMMERCE: <ShoppingBag className="h-3 w-3 text-emerald-600" />,
};

export const DEFAULT_SLOT_SYMBOLS = [
  { key: "cherry", label: "Cherry", icon: "🍒", color: "#ef4444" },
  { key: "lemon", label: "Lemon", icon: "🍋", color: "#eab308" },
  { key: "orange", label: "Orange", icon: "🍊", color: "#f97316" },
  { key: "bell", label: "Bell", icon: "🔔", color: "#8b5cf6" },
  { key: "star", label: "Star", icon: "⭐", color: "#3b82f6" },
  { key: "diamond", label: "Diamond", icon: "💎", color: "#06b6d4" },
  { key: "seven", label: "Lucky 7", icon: "7️⃣", color: "#10b981" },
];
