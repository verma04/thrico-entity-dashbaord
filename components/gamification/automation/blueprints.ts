import {
  GamificationModuleType,
  AnyGamificationTrigger,
  GamificationActionInputPayload,
  GamificationRuleConditionInput,
} from "@/graphql/gamification-automation";
import { Coins, Medal, Crown, Trophy, Sparkles } from "lucide-react";

export interface GamificationBlueprintRecipe {
  id: string;
  title: string;
  badge: string;
  module: GamificationModuleType;
  trigger: AnyGamificationTrigger;
  description: string;
  icon: any;
  conditions?: GamificationRuleConditionInput[];
  actions: GamificationActionInputPayload[];
}

export const GAMIFICATION_BLUEPRINTS: GamificationBlueprintRecipe[] = [
  {
    id: "points-threshold-vip",
    title: "Points Threshold -> Gold Tier Upgrade",
    badge: "Milestone",
    module: "POINTS",
    trigger: "POINTS_THRESHOLD_REACHED",
    description:
      "Automatically upgrade respondent to Gold Tier, tag as 'top-earner', and fire a congratulations alert when reaching 1,000 pts.",
    icon: Coins,
    conditions: [
      {
        field: "totalPoints",
        operator: ">=",
        value: 1000,
      },
    ],
    actions: [
      {
        type: "ASSIGN_MEMBERSHIP_TIER",
        tier: {
          tierId: "",
        },
      },
      {
        type: "ADD_MEMBER_TAG",
        tag: {
          tags: ["top-earner", "gold-member"],
        },
        tags: ["top-earner", "gold-member"],
      },
      {
        type: "NOTIFICATION",
        notification: {
          message:
            "Congratulations! You reached 1,000 points and unlocked Gold Tier status.",
          pushTitle: "Tier Upgraded! 🌟",
          pushBody: "You are now recognized as a Gold Member.",
          push: true,
        },
      },
    ],
  },
  {
    id: "badge-vip-community",
    title: "Elite Badge -> VIP Community Access",
    badge: "Achievement",
    module: "BADGES",
    trigger: "BADGE_EARNED",
    description:
      "Invite members to the exclusive VIP Circle and award 250 bonus points upon earning an elite achievement badge.",
    icon: Medal,
    actions: [
      {
        type: "COMMUNITY_JOIN",
        community: {
          communityId: "",
        },
      },
      {
        type: "AWARD_POINTS",
        points: {
          points: 250,
        },
      },
      {
        type: "NOTIFICATION",
        notification: {
          message:
            "You unlocked an elite badge and gained VIP Community access!",
          pushTitle: "New Community Access! 🚀",
          pushBody: "Welcome to the VIP members circle.",
          push: true,
        },
      },
    ],
  },
  {
    id: "rank-promotion-celebration",
    title: "Rank Promotion -> Badge & Email",
    badge: "Progression",
    module: "RANKS",
    trigger: "RANK_PROMOTED",
    description:
      "Celebrate member promotion to a higher rank with a celebratory email and an exclusive milestone badge.",
    icon: Crown,
    actions: [
      {
        type: "AWARD_BADGE",
        badge: {
          badgeId: "",
        },
      },
      {
        type: "EMAIL",
        email: {
          templateId: "",
          subject: "Congratulations on your new Rank promotion!",
          body: "You've worked hard and ascended to a prestigious rank. Enjoy your new perks!",
        },
      },
      {
        type: "NOTIFICATION",
        notification: {
          message: "You've been promoted to a higher rank!",
          pushTitle: "Rank Ascended! 👑",
          pushBody: "Check out your new rank badge and rewards.",
          push: true,
        },
      },
    ],
  },
  {
    id: "leaderboard-top-honors",
    title: "Top 3 Leaderboard Honors",
    badge: "Competitive",
    module: "LEADERBOARD",
    trigger: "LEADERBOARD_TOP_POSITION",
    description:
      "Recognize players who reach the top 3 spots on the leaderboard with elite tags, push alert, and bonus rewards.",
    icon: Trophy,
    conditions: [
      {
        field: "position",
        operator: "<=",
        value: 3,
      },
    ],
    actions: [
      {
        type: "ADD_MEMBER_TAG",
        tag: {
          tags: ["leaderboard-top-3", "elite-performer"],
        },
        tags: ["leaderboard-top-3", "elite-performer"],
      },
      {
        type: "NOTIFICATION",
        notification: {
          message: "Incredible work! You made it to the Top 3 on the Leaderboard!",
          pushTitle: "Top 3 Achieved! 🏆",
          pushBody: "Keep pushing to maintain your podium position!",
          push: true,
        },
      },
      {
        type: "AWARD_POINTS",
        points: {
          points: 500,
        },
      },
    ],
  },
];
