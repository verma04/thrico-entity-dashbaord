// Gamification TypeScript Types

// Modules available for point rules
export type GamificationModule =
  | "FEED"
  | "JOB_LISTING"
  | "PROFILE"
  | "SOCIAL"
  | "NETWORKING"
  | "EVENTS"
  | "MENTORSHIP";

// Trigger types for points
export type TriggerType = "FIRST_TIME" | "RECURRING";

// Point Rule
export interface PointRule {
  id: string;
  module: string; // Dynamic from subscription modules
  action: string;
  trigger: TriggerType; // Changed from triggerType to match GraphQL schema
  points: number;
  description: string;
  isActive: boolean;
  dailyCap?: number;
  weeklyCap?: number;
  monthlyCap?: number;
}

// Badge types
export type BadgeType = "ACTION" | "POINTS";

// Badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: BadgeType;
  module: string;
  condition: {
    action?: string;
    count?: number;
    pointsRequired?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Rank types
export type RankType = "POINTS" | "BADGES" | "HYBRID";

// Rank
export interface Rank {
  id: string;
  name: string;
  icon: string;
  order: number;
  type: RankType;
  isActive: boolean;
  requirements: {
    minPoints?: number;
    maxPoints?: number;
    minBadges?: number;
    maxBadges?: number;
    requiredBadges?: string[];
  };
}

// Streak Bonus
export interface StreakBonus {
  days: number;
  bonusPoints: number;
  isMilestone: boolean;
}

// Relogin Configuration
export interface ReloginConfig {
  isEnabled: boolean;
  dailyLoginPoints: number;
  streakBonuses: StreakBonus[];
  gracePeriodHours: number;
  maxStreak: number;
  streakRecoveryEnabled: boolean;
  streakRecoveryCost: number;
}

// Global Settings
export interface GamificationSettings {
  isEnabled: boolean;
  dailyPointsCap: number;
  weeklyPointsCap: number;
  monthlyPointsCap: number;
  pointDecayEnabled: boolean;
  pointDecayPercentage: number;
  pointDecayPeriodDays: number;
}

// Module info for display
export interface ModuleInfo {
  key: GamificationModule;
  label: string;
  icon: string;
  description: string;
}

export const MODULES: ModuleInfo[] = [
  {
    key: "FEED",
    label: "Feed",
    icon: "📝",
    description: "Posts, likes, comments, shares",
  },
  {
    key: "JOB_LISTING",
    label: "Job Listings",
    icon: "💼",
    description: "Job applications, postings, saves",
  },
  {
    key: "PROFILE",
    label: "Profile",
    icon: "👤",
    description: "Profile completion, skills, experience",
  },
  {
    key: "SOCIAL",
    label: "Social",
    icon: "🤝",
    description: "Follows, endorsements, messages",
  },
  {
    key: "NETWORKING",
    label: "Networking",
    icon: "🌐",
    description: "Groups, connections, events",
  },
  {
    key: "EVENTS",
    label: "Events",
    icon: "📅",
    description: "Event attendance, hosting",
  },
  {
    key: "MENTORSHIP",
    label: "Mentorship",
    icon: "🎓",
    description: "Mentoring sessions, reviews",
  },
];
