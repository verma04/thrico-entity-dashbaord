import { gql } from "@apollo/client";

export const UPSERT_MATCH_WIN_CONFIG = gql`
  mutation UpsertMatchWinConfig($input: UpsertMatchWinConfigInput!) {
    upsertMatchWinConfig(input: $input) {
      id
      costPerPlay
      maxPlaysPerDay
      isActive
      festivalMode
      updatedAt
    }
  }
`;

export const UPDATE_MATCH_WIN_SYMBOL = gql`
  mutation UpdateMatchWinSymbol($key: String!, $input: MatchWinSymbolInput!) {
    updateMatchWinSymbol(key: $key, input: $input) {
      id
    }
  }
`;

export const UPSERT_MATCH_WIN_COMBINATION = gql`
  mutation UpsertMatchWinCombination(
    $configId: ID!
    $input: MatchWinCombinationInput!
  ) {
    upsertMatchWinCombination(configId: $configId, input: $input) {
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
  }
`;

export const DELETE_MATCH_WIN_COMBINATION = gql`
  mutation DeleteMatchWinCombination($deleteMatchWinCombinationId: ID!) {
    deleteMatchWinCombination(id: $deleteMatchWinCombinationId)
  }
`;

export const PLAY_MATCH_WIN = gql`
  mutation PlayMatchWin {
    playMatchWin {
      id
      prizeType
      prizeValue
      symbolsWon
      playedAt
      prize {
        label
        icon
        color
      }
    }
  }
`;

export const INITIALIZE_MATCH_WIN_CONFIG = gql`
  mutation InitializeMatchWinConfig {
    initializeMatchWinConfig {
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
