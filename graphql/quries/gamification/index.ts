import { gql } from "@apollo/client";

// Point Rules Queries
export const GET_POINT_RULES = gql`
  query GetPointRules {
    pointRules {
      id
      source
      module
      action
      trigger
      points
      description
      isActive
      memberEligibility
      membershipTierId
      eligibleTierIds
      eligibleUserIds
      createdAt
      updatedAt
    }
  }
`;

export const GET_POINT_RULE = gql`
  query GetPointRule($id: ID!) {
    pointRule(id: $id) {
      id
      source
      module
      action
      trigger
      points
      description
      isActive
      memberEligibility
      membershipTierId
      eligibleTierIds
      eligibleUserIds
      createdAt
      updatedAt
    }
  }
`;

// Badges Queries
export const GET_BADGES = gql`
  query GetBadges($filter: BadgeFilter) {
    badges(filter: $filter) {
      id
      source
      name
      type
      module
      action
      targetValue
      icon
      description
      condition
      memberEligibility
      membershipTierId
      eligibleTierIds
      eligibleUserIds
      allowPushNotification
      allowEmailNotification
      pushNotificationTitle
      pushNotificationBody
      emailNotificationSubject
      emailNotificationBody
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
  mutation CreateBadge($input: BadgeInput!) {
    createBadge(input: $input) {
      id
      source
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
      source
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

export const GET_GAMIFICATION_SUMMARY = gql`
  query GetGamificationSummary($userId: ID!) {
    getUserGamificationSummary(input: { userId: $userId }) {
      totalPointsEarned
      totalBadgesEarned
      rankPosition
      currentStreak
    }
  }
`;

export const GET_USER_ACTIVITY_LOG = gql`
  query GetUserActivity($userId: ID!, $limit: Int, $offset: Int, $pointFilter: String) {
    getUserActivityLog(input: { 
      userId: $userId, 
      limit: $limit, 
      offset: $offset,
      pointFilter: $pointFilter
    }) {
      id
      type
      points
      createdAt
      ruleAction
      ruleDescription
      badgeName
    }
  }
`;

export const GET_USER_EARNED_BADGES = gql`
  query GetUserBadges($userId: ID!, $limit: Int, $cursor: String) {
    getUserEarnedBadges(input: { 
      userId: $userId, 
      limit: $limit, 
      cursor: $cursor 
    }) {
      edges {
        cursor
        node {
          id
          name
          description
          icon
          userProgress {
            isCompleted
            earnedAt
            progress
          }
        }
      }
      pageInfo {
        hasNextPage
        totalCount
      }
    }
  }
`;

export const GET_ENTITY_GAMIFICATION_MODULES = gql`
  query GetEntityGamificationModules {
    getEntityGamificationModules {
      modules {
        id
        uuid
        name
        description
        icon
        isGamification
      }
      integrations {
        id
        uuid
        name
        slug
        description
        icon
        isGamification
      }
      moduleTriggers {
        id
        moduleId
        name
        description
        type
        isActive
      }
      integrationTriggers {
        id
        integrationId
        name
        description
        type
        isActive
      }
      triggers {
        id
        moduleId
        name
        description
        type
        isActive
      }
    }
  }
`;
