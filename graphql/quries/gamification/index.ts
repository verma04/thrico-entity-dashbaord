import { gql } from "@apollo/client";

// Point Rules Queries
export const GET_POINT_RULES = gql`
  query GetPointRules {
    pointRules {
      id
      module
      action
      trigger
      points
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_POINT_RULE = gql`
  query GetPointRule($id: ID!) {
    pointRule(id: $id) {
      id
      module
      action
      trigger
      points
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Badges Queries
export const GET_BADGES = gql`
  query GetBadges {
    badges {
      id
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
      isActive
      createdAt
      updatedAt
      userProgress {
        id
        progress
        isCompleted
        earnedAt
      }
    }
  }
`;

export const GET_USER_BADGES = gql`
  query GetUserBadges {
    userBadges {
      id
      name
      type
      icon
      description
      condition
      userProgress {
        id
        progress
        isCompleted
        earnedAt
      }
    }
  }
`;

// Ranks Queries
export const GET_RANKS = gql`
  query GetRanks {
    ranks {
      id
      name
      type
      minPoints
      maxPoints
      minBadges
      maxBadges
      color
      icon
      order
      isActive
      userCount
      createdAt
      updatedAt
    }
  }
`;

// User Gamification Queries
export const GET_USER_GAMIFICATION = gql`
  query GetUserGamification($userId: ID!) {
    userGamification(userId: $userId) {
      id
      email
      username
      totalPoints
      currentRank {
        id
        name
        color
        icon
        minPoints
        maxPoints
      }
      pointsHistory {
        id
        pointsEarned
        createdAt
        pointRule {
          id
          module
          action
          description
        }
        metadata
      }
      badges {
        id
        progress
        isCompleted
        earnedAt
        badge {
          id
          name
          icon
          description
          condition
        }
      }
      rankHistory {
        id
        achievedAt
        fromRank {
          id
          name
          icon
        }
        toRank {
          id
          name
          icon
        }
      }
      gamificationStats {
        totalPointsEarned
        totalBadgesEarned
        currentStreak
        rankPosition
        pointsToNextRank
        badgesProgress
        recentActivity {
          id
          module
          action
          pointsEarned
          createdAt
          metadata
        }
      }
    }
  }
`;

// Leaderboard Query
export const GET_LEADERBOARD = gql`
  query GetLeaderboard($userId: ID) {
    leaderboard(userId: $userId) {
      entries {
        rank
        totalPoints
        badgesCount
        user {
          id
          username
          currentRank {
            id
            name
            color
            icon
          }
        }
      }
      totalUsers
      userPosition
    }
  }
`;

// Statistics Query
export const GET_GAMIFICATION_STATS = gql`
  query GetGamificationStats {
    gamificationStats {
      totalUsers
      totalPointsAwarded
      totalBadgesEarned
      activePointRules
      activeBadges
      activeRanks
      topRank {
        id
        name
        icon
        color
      }
      mostPopularBadge {
        id
        name
        icon
        description
      }
    }
  }
`;

export const CREATE_POINT_RULE = gql`
  mutation CreatePointRule($input: CreatePointRuleInput!) {
    createPointRule(input: $input) {
      id
      module
      action
      trigger
      points
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_POINT_RULE = gql`
  mutation UpdatePointRule($input: UpdatePointRuleInput!) {
    updatePointRule(input: $input) {
      id
      module
      action
      trigger
      points
      description
      isActive
      updatedAt
    }
  }
`;

export const DELETE_POINT_RULE = gql`
  mutation DeletePointRule($id: ID!) {
    deletePointRule(id: $id)
  }
`;

// Badges Mutations
export const CREATE_BADGE = gql`
  mutation CreateBadge($input: CreateBadgeInput!) {
    createBadge(input: $input) {
      id
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BADGE = gql`
  mutation UpdateBadge($id: ID!, $input: UpdateBadgeInput!) {
    updateBadge(id: $id, input: $input) {
      id
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
      isActive
      updatedAt
    }
  }
`;

export const DELETE_BADGE = gql`
  mutation DeleteBadge($id: ID!) {
    deleteBadge(id: $id)
  }
`;

// Ranks Mutations
export const CREATE_RANK = gql`
  mutation CreateRank($input: CreateRankInput!) {
    createRank(input: $input) {
      id
      name
      type
      minPoints
      maxPoints
      minBadges
      maxBadges
      color
      icon
      order
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_RANK = gql`
  mutation UpdateRank($id: ID!, $input: UpdateRankInput!) {
    updateRank(id: $id, input: $input) {
      id
      name
      type
      minPoints
      maxPoints
      minBadges
      maxBadges
      color
      icon
      order
      isActive
      updatedAt
    }
  }
`;

export const DELETE_RANK = gql`
  mutation DeleteRank($id: ID!) {
    deleteRank(id: $id)
  }
`;

// Manual Gamification Actions
export const AWARD_POINTS = gql`
  mutation AwardPoints($userId: ID!, $pointRuleId: ID!, $metadata: JSON) {
    awardPoints(
      userId: $userId
      pointRuleId: $pointRuleId
      metadata: $metadata
    ) {
      id
      pointsEarned
      createdAt
      pointRule {
        id
        module
        action
        description
      }
      metadata
    }
  }
`;

export const AWARD_BADGE = gql`
  mutation AwardBadge($userId: ID!, $badgeId: ID!) {
    awardBadge(userId: $userId, badgeId: $badgeId) {
      id
      progress
      isCompleted
      earnedAt
    }
  }
`;

export const PROMOTE_USER = gql`
  mutation PromoteUser($userId: ID!, $rankId: ID!) {
    promoteUser(userId: $userId, rankId: $rankId) {
      id
      achievedAt
      fromRank {
        id
        name
        icon
      }
      toRank {
        id
        name
        icon
      }
    }
  }
`;
