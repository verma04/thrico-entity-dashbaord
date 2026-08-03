export interface GetUserGamificationProfileData {
  getUserGamificationProfile: {
    id: string
    totalPoints: number
    currentRank: {
      name: string
      icon: string
      color: string
    }
  }
}

export interface PageInfo {
  endCursor: string | null
  hasNextPage: boolean
}

export interface GamificationPaginationInput {
  cursor?: string | null
  limit?: number | null
}

export interface GetUserEarnedBadgesData {
  getUserEarnedBadges: {
    edges: Array<{
      cursor: string
      node: {
        id: string
        earnedAt: string
        progress: number
        isCompleted: boolean
        badge: {
          id: string
          name: string
          type: string
          icon: string
          description: string
        }
      }
    }>
    pageInfo: PageInfo
    totalCount: number
  }
}

export interface GetUserPointsHistoryData {
  getUserPointsHistory: {
    edges: Array<{
      cursor: string
      node: {
        id: string
        createdAt: string
        metadata: any
        pointsEarned: number
        rule: {
          action: string
          description: string
        }
      }
    }>
    pageInfo: PageInfo
    totalCount: number
  }
}

export interface GetEntityBadgesData {
  getEntityBadges: Array<{
    name: string
    icon: string
    description: string
  }>
}

export interface LeaderboardEntry {
  rank: number
  totalPoints: number
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar: string
  }
  badgesCount: number
  currentRank: {
    id: string
    name: string
    minPoints: number
    maxPoints: number
    color: string
    icon: string
  }
}

export interface GetUserLeaderboardData {
  getUserLeaderboard: {
    edges: Array<{
      cursor: string
      node: LeaderboardEntry
    }>
    pageInfo: PageInfo
    totalCount: number
    userEntry: LeaderboardEntry & {
      user?: {
        id: string
        firstName: string
        lastName: string
        email: string
        avatar: string
      }
    }
  }
}

export interface LeaderboardPaginationInput {
  cursor?: string | null
  limit?: number | null
}

export interface Rank {
  id: string
  name: string
  minPoints: number
  maxPoints: number
  color: string
  icon: string
}

export interface GetUserNextLevelProgressData {
  getUserNextLevelProgress: {
    currentPoints: number
    nextLevelPoints: number
    pointsToNextLevel: number
    percentage: number
    currentRank: Rank
    nextRank: Rank
  }
}

export interface GetGamificationStatsByUserIdData {
  getGamificationStatsByUserId: {
    currentRank: {
      color: string
      icon: string
      name: string
    }
    rank: number
    totalBadges: number
  }
}

export interface GetUserGamificationSummaryData {
  getUserGamificationSummary: {
    totalPoints: number
    weekPoints: number
    monthPoints: number
    totalBadges: number
    totalRanks: number
    weeklyGrowth: number
  }
}

export interface GamificationNotification {
  id: string
  type: 'POINTS_EARNED' | 'BADGE_UNLOCKED' | 'RANK_UP' | 'LEADERBOARD'
  content: string
  points?: number
  badgeName?: string
  badgeImageUrl?: string
  rankName?: string
  isRead: boolean
  createdAt: string
}

export interface GetGamificationNotificationsData {
  getGamificationNotifications: {
    nextCursor: string | null
    result: GamificationNotification[]
  }
}
