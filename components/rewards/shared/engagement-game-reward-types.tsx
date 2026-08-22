import React from "react";
import {
  Coins,
  Ticket,
  RotateCcw,
  Gift,
  ShoppingBag,
  CreditCard,
  Percent,
} from "lucide-react";

export type GameRewardType =
  | "COINS"
  | "NO_REWARDS"
  | "INTERNAL_VOUCHER"
  | "GIFT_CARD"
  | "ECOMMERCE";

export interface GiftCardBrand {
  id: string;
  name: string;
  category: string;
  productId: string;
  color: string;
  badgeColor: string;
}

export const GIFT_CARD_BRANDS: GiftCardBrand[] = [
  {
    id: "amazon",
    name: "Amazon Pay",
    category: "E-Commerce",
    productId: "THR_AMAZON_IN",
    color: "#f59e0b",
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    category: "E-Commerce",
    productId: "THR_FLIPKART_IN",
    color: "#2563eb",
    badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
  },
  {
    id: "swiggy",
    name: "Swiggy",
    category: "Food & Dining",
    productId: "THR_SWIGGY_IN",
    color: "#f97316",
    badgeColor: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800",
  },
  {
    id: "zomato",
    name: "Zomato",
    category: "Food & Dining",
    productId: "THR_ZOMATO_IN",
    color: "#ef4444",
    badgeColor: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800",
  },
  {
    id: "myntra",
    name: "Myntra",
    category: "Fashion",
    productId: "THR_MYNTRA_IN",
    color: "#ec4899",
    badgeColor: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800",
  },
  {
    id: "uber",
    name: "Uber",
    category: "Mobility",
    productId: "THR_UBER_IN",
    color: "#18181b",
    badgeColor: "bg-zinc-800/10 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700",
  },
  {
    id: "bookmyshow",
    name: "BookMyShow",
    category: "Entertainment",
    productId: "THR_BOOKMYSHOW_IN",
    color: "#e11d48",
    badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
  },
  {
    id: "googleplay",
    name: "Google Play",
    category: "Apps & Games",
    productId: "THR_GOOGLEPLAY_IN",
    color: "#10b981",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
  },
  {
    id: "apple",
    name: "Apple Gift Card",
    category: "Digital Services",
    productId: "THR_APPLE_IN",
    color: "#6366f1",
    badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
  },
  {
    id: "croma",
    name: "Croma Retail",
    category: "Electronics",
    productId: "THR_CROMA_IN",
    color: "#0d9488",
    badgeColor: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800",
  },
];

export const GIFT_CARD_DENOMINATIONS = [50, 100, 250, 500, 1000, 2000];

export const TRY_AGAIN_PRESETS = [
  "Try Again",
  "Better Luck Next Time",
  "Almost Had It!",
  "Spin Again Tomorrow",
];

export const ECOMMERCE_PERCENT_PRESETS = [5, 10, 15, 20, 25, 50];
export const ECOMMERCE_FIXED_PRESETS = [50, 100, 200, 250, 500, 1000];

export interface GameRewardTypeOption {
  value: GameRewardType;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  badgeClass: string;
}

export const GAME_REWARD_TYPE_OPTIONS: GameRewardTypeOption[] = [
  {
    value: "COINS",
    label: "Points / Loyalty Currency",
    shortLabel: "Points",
    description: "Credit wallet points or loyalty coins directly to member",
    icon: Coins,
    accentColor: "#d97706",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/60",
  },
  {
    value: "NO_REWARDS",
    label: "Try Again (No Win)",
    shortLabel: "Try Again",
    description: "Non-winning outcome; prompts the user to play again",
    icon: RotateCcw,
    accentColor: "#71717a",
    badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  },
  {
    value: "INTERNAL_VOUCHER",
    label: "Internal Voucher / Coupon",
    shortLabel: "Internal Voucher",
    description: "Custom internal coupons and discount codes from catalog",
    icon: Ticket,
    accentColor: "#2563eb",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/60",
  },
  {
    value: "GIFT_CARD",
    label: "Digital Gift Card",
    shortLabel: "Gift Card",
    description: "Amazon Pay, Flipkart, Swiggy & top brand digital gift cards",
    icon: Gift,
    accentColor: "#9333ea",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/60",
  },
  {
    value: "ECOMMERCE",
    label: "Ecommerce / Shopify Discount",
    shortLabel: "Shopify Discount",
    description: "Direct store discount coupons (% or flat amount off)",
    icon: ShoppingBag,
    accentColor: "#059669",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/60",
  },
];

export const GAME_REWARD_LABELS: Record<string, string> = {
  COINS: "Points",
  POINTS: "Points",
  NO_REWARDS: "Try Again",
  NOTHING: "Try Again",
  INTERNAL_VOUCHER: "Internal Voucher",
  VOUCHER: "Internal Voucher",
  GIFT_CARD: "Gift Card",
  THRICO_GIFT_CARD: "Gift Card",
  ECOMMERCE: "Shopify Discount",
  SHOPIFY: "Shopify Discount",
  ECOMMERCE_DISCOUNT: "Shopify Discount",
  PREMIUM: "Premium Access",
};

export const GAME_REWARD_BADGE: Record<string, string> = {
  COINS: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/60",
  POINTS: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/60",
  NO_REWARDS: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  NOTHING: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  INTERNAL_VOUCHER: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/60",
  VOUCHER: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/60",
  GIFT_CARD: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/60",
  THRICO_GIFT_CARD: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/60",
  ECOMMERCE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/60",
  SHOPIFY: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/60",
  ECOMMERCE_DISCOUNT: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/60",
  PREMIUM: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/60",
};

export const GAME_REWARD_ICON: Record<string, React.ReactNode> = {
  COINS: <Coins className="h-3 w-3 text-amber-600" />,
  POINTS: <Coins className="h-3 w-3 text-amber-600" />,
  NO_REWARDS: <RotateCcw className="h-3 w-3 text-zinc-500" />,
  NOTHING: <RotateCcw className="h-3 w-3 text-zinc-500" />,
  INTERNAL_VOUCHER: <Ticket className="h-3 w-3 text-blue-600" />,
  VOUCHER: <Ticket className="h-3 w-3 text-blue-600" />,
  GIFT_CARD: <Gift className="h-3 w-3 text-purple-600" />,
  THRICO_GIFT_CARD: <Gift className="h-3 w-3 text-purple-600" />,
  ECOMMERCE: <ShoppingBag className="h-3 w-3 text-emerald-600" />,
  SHOPIFY: <ShoppingBag className="h-3 w-3 text-emerald-600" />,
  ECOMMERCE_DISCOUNT: <ShoppingBag className="h-3 w-3 text-emerald-600" />,
};

/**
 * Resolves a prize/reward object into one of the 5 canonical UI GameRewardTypes.
 */
export function resolveGameRewardType(prize: {
  type?: string;
  rewardType?: string;
  mechanism?: {
    type?: string;
  };
  reward?: {
    rewardType?: string;
    provider?: string;
    title?: string;
  };
}): GameRewardType {
  const mechType = (prize.mechanism?.type || "").toUpperCase();
  if (mechType === "DIGITAL_GIFT_CARD") return "GIFT_CARD";
  if (mechType === "STORE_DISCOUNT") return "ECOMMERCE";
  if (mechType === "INTERNAL_VOUCHER") return "INTERNAL_VOUCHER";

  const t = (prize.type || prize.rewardType || "").toUpperCase();
  if (t === "COINS" || t === "TC" || t === "POINTS") return "COINS";
  if (t === "NO_REWARDS" || t === "NOTHING") return "NO_REWARDS";
  if (t === "DIGITAL_GIFT_CARD" || t === "GIFT_CARD") return "GIFT_CARD";
  if (t === "STORE_DISCOUNT" || t === "ECOMMERCE" || t === "SHOPIFY") return "ECOMMERCE";
  if (t === "INTERNAL_VOUCHER") return "INTERNAL_VOUCHER";

  // Check linked reward details
  const rType = (prize.reward?.rewardType || "").toUpperCase();
  const rProvider = (prize.reward?.provider || "").toUpperCase();
  const rTitle = (prize.reward?.title || "").toLowerCase();

  if (
    rType === "THRICO_GIFT_CARD" ||
    rType === "GIFT_CARD" ||
    rProvider === "THRICO" ||
    rTitle.includes("gift card")
  ) {
    return "GIFT_CARD";
  }

  if (
    rType === "ECOMMERCE_DISCOUNT" ||
    rType === "SHOPIFY_DISCOUNT" ||
    rProvider === "ECOMMERCE" ||
    rProvider === "SHOPIFY" ||
    rTitle.includes("store") ||
    rTitle.includes("off")
  ) {
    return "ECOMMERCE";
  }

  return "INTERNAL_VOUCHER";
}
