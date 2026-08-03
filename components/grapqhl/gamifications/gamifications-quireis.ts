"use client";
import { gql } from '@apollo/client'
import { QueryHookOptions, useQuery } from '@apollo/client/react'
import type {
  GetEntityBadgesData,
  GetUserEarnedBadgesData,
  GetUserGamificationProfileData,
  GetUserPointsHistoryData,
  GetUserLeaderboardData,
  LeaderboardPaginationInput,
  GetUserNextLevelProgressData,
  GamificationPaginationInput,
  GetGamificationStatsByUserIdData,
  GetUserGamificationSummaryData,
  GetGamificationNotificationsData,
} from './types'

// Fetch User Profile (Points & Rank)
export const GET_USER_GAMIFICATION_PROFILE = gql`
  query GetUserGamificationProfile {
    getUserGamificationProfile {
      id
      totalPoints
      currentRank {
        name
        icon
        color
      }
    }
  }
`

export const useGetUserGamificationProfile = (
  options?: QueryHookOptions<GetUserGamificationProfileData, any>,
) => {
  return useQuery<GetUserGamificationProfileData, any>(
    GET_USER_GAMIFICATION_PROFILE,
    options,
  )
}

// Fetch Earned Badges
export const GET_USER_EARNED_BADGES = gql`
  query GetUserEarnedBadges($input: GamificationPaginationInput) {
    getUserEarnedBadges(input: $input) {
      edges {
        cursor
        node {
          id
          earnedAt
          progress
          isCompleted
          badge {
            id
            name
            type
            icon
            description
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`

export const useGetUserEarnedBadges = (
  options?: QueryHookOptions<
    GetUserEarnedBadgesData,
    { input: GamificationPaginationInput }
  >,
) => {
  return useQuery<GetUserEarnedBadgesData, { input: GamificationPaginationInput }>(
    GET_USER_EARNED_BADGES,
    options,
  )
}

// Fetch Points History
export const GET_USER_POINTS_HISTORY = gql`
  query GetUserPointsHistory($input: GamificationPaginationInput) {
    getUserPointsHistory(input: $input) {
      edges {
        cursor
        node {
          createdAt
          id
          metadata
          pointsEarned
          rule {
            action
            description
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`

export const useGetUserPointsHistory = (
  options?: QueryHookOptions<
    GetUserPointsHistoryData,
    { input: GamificationPaginationInput }
  >,
) => {
  return useQuery<GetUserPointsHistoryData, { input: GamificationPaginationInput }>(
    GET_USER_POINTS_HISTORY,
    options,
  )
}

// Fetch All Entity Badges
export const GET_ENTITY_BADGES = gql`
  query GetEntityBadges {
    getEntityBadges {
      name
      icon
      description
    }
  }
`

export const useGetEntityBadges = (
  options?: QueryHookOptions<GetEntityBadgesData, any>,
) => {
  return useQuery<GetEntityBadgesData, any>(GET_ENTITY_BADGES, options)
}

// Fetch Leaderboard
export const GET_USER_LEADERBOARD = gql`
  query GetUserLeaderboard($input: GamificationLeaderboardInput) {
    getUserLeaderboard(input: $input) {
      edges {
        cursor
        node {
          user {
            id
            firstName
            lastName
           
            avatar
          }
          totalPoints
          rank
          badgesCount
          currentRank {
            id
            name
            minPoints
            maxPoints
            color
            icon
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
      userEntry {
        user {
          id
          firstName
          lastName
       
          avatar
        }
        totalPoints
        rank
        badgesCount
        currentRank {
          id
          name
          minPoints
          maxPoints
          color
          icon
        }
      }
    }
  }
`

export const useGetUserLeaderboard = (
  options?: QueryHookOptions<
    GetUserLeaderboardData,
    { input: LeaderboardPaginationInput }
  >,
) => {
  return useQuery<GetUserLeaderboardData, { input: LeaderboardPaginationInput }>(
    GET_USER_LEADERBOARD,
    options,
  )
}

// Fetch User Next Level Progress
export const GET_USER_NEXT_LEVEL_PROGRESS = gql`
  query GetUserNextLevelProgress {
    getUserNextLevelProgress {
      currentPoints
      nextLevelPoints
      pointsToNextLevel
      percentage
      currentRank {
        id
        name
        minPoints
        maxPoints
        color
        icon
      }
      nextRank {
        id
        name
        minPoints
        maxPoints
        color
        icon
      }
    }
  }
`

export const useGetUserNextLevelProgress = (
  options?: QueryHookOptions<GetUserNextLevelProgressData, any>,
) => {
  return useQuery<GetUserNextLevelProgressData, any>(
    GET_USER_NEXT_LEVEL_PROGRESS,
    options,
  )
}

// Fetch Gamification Stats by User ID
export const GET_GAMIFICATION_STATS_BY_USER_ID = gql`
  query GetGamificationStatsByUserId($userId: ID!) {
    getGamificationStatsByUserId(userId: $userId) {
      currentRank {
        color
        icon
        name
      }
      rank
      totalBadges
      totalPoints
    }
  }
`

export const useGetGamificationStatsByUserId = (
  options?: QueryHookOptions<GetGamificationStatsByUserIdData, { userId: string }>,
) => {
  return useQuery<GetGamificationStatsByUserIdData, { userId: string }>(
    GET_GAMIFICATION_STATS_BY_USER_ID,
    options,
  )
}

// Fetch Gamification Summary
export const GET_USER_GAMIFICATION_SUMMARY = gql`
  query GetUserGamificationSummary {
    getUserGamificationSummary {
      totalPoints
      weekPoints
      monthPoints
      totalBadges
      totalRanks
      weeklyGrowth
    }
  }
`

export const useGetUserGamificationSummary = (
  options?: QueryHookOptions<GetUserGamificationSummaryData, any>,
) => {
  return useQuery<GetUserGamificationSummaryData, any>(
    GET_USER_GAMIFICATION_SUMMARY,
    options,
  )
}

// Fetch Gamification Notifications
export const GET_GAMIFICATION_NOTIFICATIONS = gql`
  query GetGamificationNotifications($input: cursorPaginationInput) {
    getGamificationNotifications(input: $input) {
      nextCursor
      result {
        id
        type
        content
        points
        badgeName
        badgeImageUrl
        rankName
        isRead
        createdAt
      }
    }
  }
`

export const useGetGamificationNotifications = (
  options?: QueryHookOptions<
    GetGamificationNotificationsData,
    { input: GamificationPaginationInput }
  >,
) => {
  return useQuery<GetGamificationNotificationsData, { input: GamificationPaginationInput }>(
    GET_GAMIFICATION_NOTIFICATIONS,
    options,
  )
}
