import { create } from "zustand";
import {
  PointRule,
  Badge,
  Rank,
  ReloginConfig,
  GamificationSettings,
  GamificationModule,
} from "@/components/gamification/ts-types";

// Mock Data
const mockPointRules: PointRule[] = [
  {
    id: "1",
    module: "FEED",
    action: "Create Post",
    triggerType: "RECURRING",
    points: 5,
    description: "Points for each new post",
    isActive: true,
    dailyCap: 50,
  },
  {
    id: "2",
    module: "FEED",
    action: "First Post",
    triggerType: "FIRST_TIME",
    points: 10,
    description: "Bonus for your first post",
    isActive: true,
  },
  {
    id: "3",
    module: "FEED",
    action: "Like Post",
    triggerType: "RECURRING",
    points: 2,
    description: "Points for liking posts",
    isActive: true,
    dailyCap: 20,
  },
  {
    id: "4",
    module: "JOB_LISTING",
    action: "Apply for Job",
    triggerType: "RECURRING",
    points: 5,
    description: "Points for each job application",
    isActive: true,
    weeklyCap: 50,
  },
  {
    id: "5",
    module: "PROFILE",
    action: "Complete Profile",
    triggerType: "FIRST_TIME",
    points: 20,
    description: "One-time bonus for completing profile",
    isActive: true,
  },
  {
    id: "6",
    module: "SOCIAL",
    action: "Follow User",
    triggerType: "RECURRING",
    points: 1,
    description: "Points for following users",
    isActive: true,
    dailyCap: 10,
  },
];

const mockBadges: Badge[] = [
  {
    id: "1",
    name: "First Steps",
    icon: "👶",
    description: "Create your first post",
    type: "ACTION",
    module: "FEED",
    isActive: true,
    criteria: { action: "Create Post", count: 1 },
  },
  {
    id: "2",
    name: "Feed Master",
    icon: "🏆",
    description: "Create 50 posts",
    type: "ACTION",
    module: "FEED",
    isActive: true,
    criteria: { action: "Create Post", count: 50 },
  },
  {
    id: "3",
    name: "Social Butterfly",
    icon: "🦋",
    description: "Like 100 posts",
    type: "ACTION",
    module: "FEED",
    isActive: true,
    criteria: { action: "Like Post", count: 100 },
  },
  {
    id: "4",
    name: "Point Starter",
    icon: "⭐",
    description: "Reach 100 total points",
    type: "POINTS",
    isActive: true,
    criteria: { pointsRequired: 100 },
  },
  {
    id: "5",
    name: "Point Legend",
    icon: "💎",
    description: "Reach 5,000 total points",
    type: "POINTS",
    isActive: true,
    criteria: { pointsRequired: 5000 },
  },
];

const mockRanks: Rank[] = [
  {
    id: "1",
    name: "Newbie",
    icon: "🐣",
    order: 1,
    type: "POINTS",
    isActive: true,
    requirements: { minPoints: 0, maxPoints: 49 },
  },
  {
    id: "2",
    name: "Rookie",
    icon: "👶",
    order: 2,
    type: "POINTS",
    isActive: true,
    requirements: { minPoints: 50, maxPoints: 199 },
  },
  {
    id: "3",
    name: "Explorer",
    icon: "🔍",
    order: 3,
    type: "POINTS",
    isActive: true,
    requirements: { minPoints: 200, maxPoints: 499 },
  },
  {
    id: "4",
    name: "Contributor",
    icon: "📝",
    order: 4,
    type: "POINTS",
    isActive: true,
    requirements: { minPoints: 500, maxPoints: 999 },
  },
  {
    id: "5",
    name: "Expert",
    icon: "🎯",
    order: 5,
    type: "POINTS",
    isActive: true,
    requirements: { minPoints: 1000, maxPoints: 2499 },
  },
  {
    id: "6",
    name: "Master",
    icon: "👑",
    order: 6,
    type: "POINTS",
    isActive: true,
    requirements: { minPoints: 2500 },
  },
];

const defaultReloginConfig: ReloginConfig = {
  isEnabled: true,
  dailyLoginPoints: 5,
  streakBonuses: [
    { days: 3, bonusPoints: 15, isMilestone: false },
    { days: 7, bonusPoints: 50, isMilestone: true },
    { days: 14, bonusPoints: 100, isMilestone: true },
    { days: 30, bonusPoints: 200, isMilestone: true },
  ],
  gracePeriodHours: 2,
  maxStreak: 365,
  streakRecoveryEnabled: true,
  streakRecoveryCost: 50,
};

const defaultSettings: GamificationSettings = {
  isEnabled: true,
  dailyPointsCap: 200,
  weeklyPointsCap: 1000,
  monthlyPointsCap: 3000,
  pointDecayEnabled: false,
  pointDecayPercentage: 5,
  pointDecayPeriodDays: 30,
};

interface GamificationState {
  // Data
  pointRules: PointRule[];
  badges: Badge[];
  ranks: Rank[];
  reloginConfig: ReloginConfig;
  settings: GamificationSettings;

  // UI State
  activeTab: string;
  selectedModule: GamificationModule | "ALL";

  // Actions - Point Rules
  addPointRule: (rule: Omit<PointRule, "id">) => void;
  updatePointRule: (id: string, updates: Partial<PointRule>) => void;
  deletePointRule: (id: string) => void;
  togglePointRuleActive: (id: string) => void;

  // Actions - Badges
  addBadge: (badge: Omit<Badge, "id">) => void;
  updateBadge: (id: string, updates: Partial<Badge>) => void;
  deleteBadge: (id: string) => void;
  toggleBadgeActive: (id: string) => void;

  // Actions - Ranks
  addRank: (rank: Omit<Rank, "id">) => void;
  updateRank: (id: string, updates: Partial<Rank>) => void;
  deleteRank: (id: string) => void;
  reorderRanks: (ranks: Rank[]) => void;

  // Actions - Relogin
  updateReloginConfig: (config: Partial<ReloginConfig>) => void;
  addStreakBonus: (bonus: {
    days: number;
    bonusPoints: number;
    isMilestone: boolean;
  }) => void;
  removeStreakBonus: (days: number) => void;

  // Actions - Settings
  updateSettings: (settings: Partial<GamificationSettings>) => void;

  // UI Actions
  setActiveTab: (tab: string) => void;
  setSelectedModule: (module: GamificationModule | "ALL") => void;

  // Getters
  getPointRulesByModule: (module: GamificationModule | "ALL") => PointRule[];
  getBadgesByModule: (module: GamificationModule | "ALL") => Badge[];
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  // Initial Data
  pointRules: mockPointRules,
  badges: mockBadges,
  ranks: mockRanks,
  reloginConfig: defaultReloginConfig,
  settings: defaultSettings,

  // UI State
  activeTab: "points",
  selectedModule: "ALL",

  // Point Rules Actions
  addPointRule: (rule) =>
    set((state) => ({
      pointRules: [...state.pointRules, { ...rule, id: Date.now().toString() }],
    })),

  updatePointRule: (id, updates) =>
    set((state) => ({
      pointRules: state.pointRules.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  deletePointRule: (id) =>
    set((state) => ({
      pointRules: state.pointRules.filter((r) => r.id !== id),
    })),

  togglePointRuleActive: (id) =>
    set((state) => ({
      pointRules: state.pointRules.map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r
      ),
    })),

  // Badge Actions
  addBadge: (badge) =>
    set((state) => ({
      badges: [...state.badges, { ...badge, id: Date.now().toString() }],
    })),

  updateBadge: (id, updates) =>
    set((state) => ({
      badges: state.badges.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),

  deleteBadge: (id) =>
    set((state) => ({
      badges: state.badges.filter((b) => b.id !== id),
    })),

  toggleBadgeActive: (id) =>
    set((state) => ({
      badges: state.badges.map((b) =>
        b.id === id ? { ...b, isActive: !b.isActive } : b
      ),
    })),

  // Rank Actions
  addRank: (rank) =>
    set((state) => ({
      ranks: [...state.ranks, { ...rank, id: Date.now().toString() }],
    })),

  updateRank: (id, updates) =>
    set((state) => ({
      ranks: state.ranks.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  deleteRank: (id) =>
    set((state) => ({
      ranks: state.ranks.filter((r) => r.id !== id),
    })),

  reorderRanks: (ranks) => set({ ranks }),

  // Relogin Actions
  updateReloginConfig: (config) =>
    set((state) => ({
      reloginConfig: { ...state.reloginConfig, ...config },
    })),

  addStreakBonus: (bonus) =>
    set((state) => ({
      reloginConfig: {
        ...state.reloginConfig,
        streakBonuses: [...state.reloginConfig.streakBonuses, bonus].sort(
          (a, b) => a.days - b.days
        ),
      },
    })),

  removeStreakBonus: (days) =>
    set((state) => ({
      reloginConfig: {
        ...state.reloginConfig,
        streakBonuses: state.reloginConfig.streakBonuses.filter(
          (b) => b.days !== days
        ),
      },
    })),

  // Settings Actions
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  // UI Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedModule: (module) => set({ selectedModule: module }),

  // Getters
  getPointRulesByModule: (module) => {
    const rules = get().pointRules;
    if (module === "ALL") return rules;
    return rules.filter((r) => r.module === module);
  },

  getBadgesByModule: (module) => {
    const badges = get().badges;
    if (module === "ALL") return badges;
    return badges.filter((b) => b.module === module || !b.module);
  },
}));
