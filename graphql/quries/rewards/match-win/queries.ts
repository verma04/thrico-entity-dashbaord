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
          key
          label
          icon
          color
        }
        symbol2 {
          id
          key
          label
          icon
          color
        }
        symbol3 {
          id
          key
          label
          icon
          color
        }
        type
        value
        probability
        maxWins
        storeDiscountRuleId
        storeDiscountRule {
          id
          title
          discountValue
          discountType
        }
        manualBatchId
        manualBatch {
          id
          name
          totalCount
        }
        digitalCardRuleId
        digitalCardRule {
          id
          title
          faceValue
        }
        mechanism {
          type
          ruleId
          storeDiscountRuleId
          manualBatchId
          digitalCardRuleId
        }
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
          key
          label
          icon
          color
        }
        symbol2 {
          id
          key
          label
          icon
          color
        }
        symbol3 {
          id
          key
          label
          icon
          color
        }
        type
        value
        probability
        maxWins
        storeDiscountRuleId
        storeDiscountRule {
          id
          title
          discountValue
          discountType
        }
        manualBatchId
        manualBatch {
          id
          name
          totalCount
        }
        digitalCardRuleId
        digitalCardRule {
          id
          title
          faceValue
        }
        mechanism {
          type
          ruleId
          storeDiscountRuleId
          manualBatchId
          digitalCardRuleId
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MATCH_WIN_COMBINATION = gql`
  query GetMatchWinCombination($id: ID!) {
    getMatchWinCombination(id: $id) {
      id
      configId
      key
      type
      value
      probability
      maxWins
      symbol1 {
        id
        key
        label
        icon
        color
      }
      symbol2 {
        id
        key
        label
        icon
        color
      }
      symbol3 {
        id
        key
        label
        icon
        color
      }
      storeDiscountRuleId
      storeDiscountRule {
        id
        title
        discountValue
        discountType
      }
      manualBatchId
      manualBatch {
        id
        name
        totalCount
      }
      digitalCardRuleId
      digitalCardRule {
        id
        title
        faceValue
      }
      mechanism {
        type
        ruleId
        storeDiscountRuleId
        manualBatchId
        digitalCardRuleId
      }
      createdAt
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
      coinsSpent
      symbolsWon
      playedAt
      user {
        id
        firstName
        lastName
      }
    }
  }
`;
