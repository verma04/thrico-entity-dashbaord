import { gql } from "@apollo/client";

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
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_MATCH_WIN_CONFIG = gql`
  mutation UpsertMatchWinConfig($input: UpsertMatchWinConfigInput!) {
    upsertMatchWinConfig(input: $input) {
      id
      entityId
      costPerPlay
      maxPlaysPerDay
      isActive
      festivalMode
      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_MATCH_WIN_SYMBOL = gql`
  mutation UpsertMatchWinSymbol($configId: ID!, $input: MatchWinSymbolInput!) {
    upsertMatchWinSymbol(configId: $configId, input: $input) {
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
  }
`;

export const DELETE_MATCH_WIN_SYMBOL = gql`
  mutation DeleteMatchWinSymbol($id: ID!) {
    deleteMatchWinSymbol(id: $id)
  }
`;

export const CREATE_MATCH_WIN_COMBINATION = gql`
  mutation CreateMatchWinCombination(
    $configId: ID!
    $input: MatchWinCombinationInput!
  ) {
    createMatchWinCombination(configId: $configId, input: $input) {
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

export const UPDATE_MATCH_WIN_COMBINATION = gql`
  mutation UpdateMatchWinCombination(
    $id: ID!
    $input: MatchWinCombinationInput!
  ) {
    updateMatchWinCombination(id: $id, input: $input) {
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

export const UPSERT_MATCH_WIN_COMBINATION = gql`
  mutation UpsertMatchWinCombination(
    $configId: ID!
    $input: MatchWinCombinationInput!
  ) {
    upsertMatchWinCombination(configId: $configId, input: $input) {
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

export const DELETE_MATCH_WIN_COMBINATION = gql`
  mutation DeleteMatchWinCombination($id: ID!) {
    deleteMatchWinCombination(id: $id)
  }
`;

export const UPDATE_MATCH_WIN_SYMBOL = UPSERT_MATCH_WIN_SYMBOL;
