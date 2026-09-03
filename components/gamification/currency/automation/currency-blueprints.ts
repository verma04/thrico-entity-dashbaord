import {
  CurrencyRuleTrigger,
  GamificationActionInputPayload,
} from "@/graphql/gamification-automation";
import { Coins, Sparkles, Zap, Award, ArrowRightLeft, Gift } from "lucide-react";

export interface CurrencyBlueprint {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: any;
  trigger: CurrencyRuleTrigger;
  conditionOperator: "AND" | "OR";
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  actions: GamificationActionInputPayload[];
}

export const CURRENCY_BLUEPRINTS: CurrencyBlueprint[] = [
  {
    id: "high-ec-earner-tc-bonus",
    title: "High EC Earner -> TC Coin Bonus & VIP",
    description:
      "Award 50 TC Coins to user's global wallet and assign VIP tier when user earns Entity Currency.",
    badge: "Earnings Milestone",
    icon: Coins,
    trigger: "EC_EARNED",
    conditionOperator: "AND",
    conditions: [{ field: "context.ecAmount", operator: ">=", value: 500 }],
    actions: [
      {
        type: "AWARD_CURRENCY",
        currency: {
          amount: 50,
          currencyType: "TC",
        },
        currencyAmount: 50,
        currencyType: "TC",
      },
      {
        type: "ASSIGN_MEMBERSHIP_TIER",
      },
      {
        type: "NOTIFICATION",
        notification: {
          pushTitle: "TC Coins Bonus! 💰",
          message: "You earned 50 TC Coins bonus for high EC earnings!",
          push: true,
        },
      },
    ],
  },
  {
    id: "wallet-threshold-gold-tier",
    title: "Wallet Milestone -> Tier Upgrade & Points",
    description:
      "Automatically grant higher membership tier and bonus points when wallet reaches a threshold.",
    badge: "Balance Gate",
    icon: Award,
    trigger: "CURRENCY_THRESHOLD_REACHED",
    conditionOperator: "AND",
    conditions: [{ field: "wallet.balance", operator: ">=", value: 1000 }],
    actions: [
      {
        type: "ASSIGN_MEMBERSHIP_TIER",
      },
      {
        type: "AWARD_POINTS",
        points: { points: 250 },
      },
      {
        type: "EMAIL",
        email: {
          subject: "🎉 You've unlocked Gold Tier via your Currency Balance!",
          body: "Congratulations! Your wallet balance has surpassed the milestone threshold.",
        },
      },
    ],
  },
  {
    id: "currency-conversion-reward",
    title: "Currency Converted -> In-App Alert & Tag",
    description:
      "Send a confirmation notification and apply member tag when points or EC are converted.",
    badge: "Exchange Loop",
    icon: ArrowRightLeft,
    trigger: "CURRENCY_CONVERTED",
    conditionOperator: "AND",
    conditions: [],
    actions: [
      {
        type: "NOTIFICATION",
        notification: {
          pushTitle: "Currency Converted ✨",
          message: "Your conversion was successfully processed into your wallet.",
          push: true,
        },
      },
      {
        type: "ADD_MEMBER_TAG",
        tag: { tags: ["active-trader", "currency-converted"] },
        tags: ["active-trader", "currency-converted"],
      },
    ],
  },
  {
    id: "redemption-vip-circle",
    title: "Redemption Completed -> Circle Access",
    description:
      "Grant access to private reward circle and award achievement badge upon coupon or perk redemption.",
    badge: "Perk Redemption",
    icon: Gift,
    trigger: "REDEMPTION_COMPLETED",
    conditionOperator: "AND",
    conditions: [],
    actions: [
      {
        type: "COMMUNITY_JOIN",
      },
      {
        type: "AWARD_BADGE",
      },
      {
        type: "NOTIFICATION",
        notification: {
          pushTitle: "Perk Redeemed! 🎁",
          message: "You've unlocked exclusive circle access from your redemption.",
          push: true,
        },
      },
    ],
  },
];
