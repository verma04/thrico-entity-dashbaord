import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
  QueryResult,
  MutationTuple,
  gql,
} from "@apollo/client";
import {
  GET_POINT_RULES,
  GET_POINT_RULE,
  GET_BADGES,
  GET_USER_BADGES,
  GET_RANKS,
  GET_USER_GAMIFICATION,
  GET_LEADERBOARD,
  GET_GAMIFICATION_STATS,
  CREATE_POINT_RULE,
  UPDATE_POINT_RULE,
  DELETE_POINT_RULE,
  CREATE_BADGE,
  UPDATE_BADGE,
  DELETE_BADGE,
  CREATE_RANK,
  UPDATE_RANK,
  DELETE_RANK,
  AWARD_POINTS,
  AWARD_BADGE,
  PROMOTE_USER,
} from "../../quries/gamification";

// --- Example TypeScript Types (add more details as needed) ---
export type PointRule = {
  id: string;
  module: string;
  action: string;
  trigger: string;
  points: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Badge = {
  id: string;
  name: string;
  type: string;
  module: string;
  action: string;
  targetValue: number;
  icon: string;
  description: string;
  condition: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userProgress?: BadgeProgress;
};

export type BadgeProgress = {
  id: string;
  progress: number;
  isCompleted: boolean;
  earnedAt: string;
};

export type Rank = {
  id: string;
  name: string;
  type: string;
  minPoints: number;
  maxPoints: number;
  minBadges: number;
  maxBadges: number;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
};

export type UserGamification = {
  id: string;
  email: string;
  username: string;
  totalPoints: number;
  // ...rest as per your needs
};

export type LeaderboardEntry = {
  rank: number;
  totalPoints: number;
  badgesCount: number;
  user: {
    id: string;
    username: string;
    currentRank: {
      id: string;
      name: string;
      color: string;
      icon: string;
    };
  };
};

export type Leaderboard = {
  entries: LeaderboardEntry[];
  totalUsers: number;
  userPosition: number;
};

// --- Apollo Client Hooks ---

// Point Rules
export function usePointRules(options?: QueryHookOptions) {
  return useQuery<{ pointRules: PointRule[] }>(GET_POINT_RULES, options);
}
export function usePointRule(id: string, options?: QueryHookOptions) {
  return useQuery<{ pointRule: PointRule }, { id: string }>(GET_POINT_RULE, {
    variables: { id },
    ...options,
  });
}
export function useCreatePointRule(options?: MutationHookOptions) {
  return useMutation<{ createPointRule: PointRule }>(
    CREATE_POINT_RULE,
    options
  );
}
export function useUpdatePointRule(options?: MutationHookOptions) {
  return useMutation<{ updatePointRule: PointRule }>(
    UPDATE_POINT_RULE,
    options
  );
}
export function useDeletePointRule(
  options?: MutationHookOptions<{ deletePointRule: boolean }, { id: string }>
) {
  return useMutation<{ deletePointRule: boolean }, { id: string }>(
    DELETE_POINT_RULE,
    options
  );
}

// Badges
export function useBadges(options?: QueryHookOptions) {
  return useQuery<{ badges: Badge[] }>(GET_BADGES, options);
}
export function useUserBadges(options?: QueryHookOptions) {
  return useQuery<{ userBadges: Badge[] }>(GET_USER_BADGES, options);
}
export function useCreateBadge(options?: MutationHookOptions) {
  return useMutation<{ createBadge: Badge }>(CREATE_BADGE, options);
}
export function useUpdateBadge(options?: MutationHookOptions) {
  return useMutation<{ updateBadge: Badge }>(UPDATE_BADGE, options);
}
export function useDeleteBadge(
  options?: MutationHookOptions<{ deleteBadge: boolean }, { id: string }>
) {
  return useMutation<{ deleteBadge: boolean }, { id: string }>(
    DELETE_BADGE,
    options
  );
}

// Ranks
export function useRanks(options?: QueryHookOptions) {
  return useQuery<{ ranks: Rank[] }>(GET_RANKS, options);
}
export function useCreateRank(options?: MutationHookOptions) {
  return useMutation<{ createRank: Rank }>(CREATE_RANK, options);
}
export function useUpdateRank(options?: MutationHookOptions) {
  return useMutation<{ updateRank: Rank }>(UPDATE_RANK, options);
}
export function useDeleteRank(
  options?: MutationHookOptions<{ deleteRank: boolean }, { id: string }>
) {
  return useMutation<{ deleteRank: boolean }, { id: string }>(
    DELETE_RANK,
    options
  );
}

// User Gamification
export function useUserGamification(
  userId: string,
  options?: QueryHookOptions
) {
  return useQuery<{ userGamification: UserGamification }, { userId: string }>(
    GET_USER_GAMIFICATION,
    { ...options, variables: { userId, ...(options?.variables || {}) } }
  );
}

// Leaderboard
export function useLeaderboard(userId?: string, options?: QueryHookOptions) {
  return useQuery<{ leaderboard: Leaderboard }, { userId?: string }>(
    GET_LEADERBOARD,
    { variables: { userId }, ...options }
  );
}

// Gamification Stats
export function useGamificationStats(options?: QueryHookOptions) {
  return useQuery(GET_GAMIFICATION_STATS, options);
}

// Manual Actions
export function useAwardPoints(options?: MutationHookOptions) {
  return useMutation(AWARD_POINTS, options);
}
export function useAwardBadge(options?: MutationHookOptions) {
  return useMutation(AWARD_BADGE, options);
}
export function usePromoteUser(options?: MutationHookOptions) {
  return useMutation(PROMOTE_USER, options);
}
