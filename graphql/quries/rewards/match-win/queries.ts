import { gql } from "@apollo/client";

export const GET_MATCH_WIN_CONFIG = gql`
  query GetMatchWinConfig {
    getMatchWinConfig {
      id
      entityId
      costPerPlay
      maxPlaysPerDay
      isActive
      festivalMode
      symbols {
        id
        configId
        key
        label
        icon
        color
        sortOrder
        createdAt
        updatedAt
      }
      combinations {
        id
        configId
        key
        symbol1 {
          id
          configId
          key
          label
          icon
          color
          sortOrder
          createdAt
          updatedAt
        }
        symbol2 {
          id
          configId
          key
          label
          icon
          color
          sortOrder
          createdAt
          updatedAt
        }
        symbol3 {
          id
          configId
          key
          label
          icon
          color
          sortOrder
          createdAt
          updatedAt
        }
        type
        value
        probability
        maxWins
        rewardId
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MATCH_WIN_DATA = gql`
  query GetMatchWinData {
    getMatchWinConfig {
      id
      costPerPlay
      maxPlaysPerDay
      isActive
      festivalMode
      symbols {
        id
        key
        label
        icon
        color
        sortOrder
      }
      combinations {
        id
        key
        symbol1 {
          key
          icon
        }
        symbol2 {
          key
          icon
        }
        symbol3 {
          key
          icon
        }
        type
        value
        probability
        maxWins
        rewardId
      }
      updatedAt
    }
  }
`;

export const GET_MATCH_WIN_PLAYS = gql`
  query GetMatchWinPlays($pagination: PaginationInput) {
    getMatchWinPlays(pagination: $pagination) {
      id
      userId
      combinationId
      prizeType
      prizeValue
      tcSpent
      symbolsWon
      playedAt
      user {
        avatar
        firstName
        lastName
      }
    }
  }
`;

export const INITIAL_MATCH_WIN_CONFIG = gql`
  query InitialMatchWinConfig {
    initialMatchWinConfig {
      symbols {
        key
        label
        icon
        color
      }
    }
  }
`;
