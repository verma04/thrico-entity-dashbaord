import { gql } from "@apollo/client";

export const GET_ENTITY_CURRENCY_CONFIG = gql`
  query GetEntityCurrencyConfig {
    getEntityCurrencyConfig {
      id
      entityId
      currencyName
      normalizationFactor
      tcConversionRate
      tcCoinsAllowed
      minTcPercentage
      maxTcPercentage
      minEntityActivityRequired
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVITY_CAPS = gql`
  query GetActivityCaps {
    getActivityCaps {
      id
      entityId
      activityType
      dailyCap
      weeklyCap
      monthlyCap
    }
  }
`;

export const GET_TC_CONVERSION_CAP = gql`
  query GetTCConversionCap {
    getTCConversionCap {
      id
      entityId
      maxTcPerDay
      maxTcPerMonth
      maxTcPerEntity
    }
  }
`;

export const GET_REDEMPTION_CAP = gql`
  query GetRedemptionCap {
    getRedemptionCap {
      id
      entityId
      maxTcPerOrder
      maxTcPerMonth
    }
  }
`;

export const GET_CURRENCY_TRANSACTIONS = gql`
  query GetCurrencyTransactions(
    $userId: String
    $limit: Int
    $cursor: String
  ) {
    getCurrencyTransactions(userId: $userId, limit: $limit, cursor: $cursor) {
      items {
        userId
        userBasicInfo {
          id
          firstName
          lastName
          avatar
        }
        transactionId
        type
        entityId
        amount
        balanceBefore
        balanceAfter
        metadata
        timestamp
      }
      nextCursor
    }
  }
`;

export const GET_CURRENCY_STATS = gql`
  query GetCurrencyStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getCurrencyStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalBalance
      totalEarned
      redemptionVolume
      activeUsers
      currencyFlow {
        name
        amount
      }
      topEarners {
        userId
        rank
        amount
        userBasicInfo {
          id
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

export const UPDATE_ENTITY_CURRENCY_CONFIG = gql`
  mutation UpdateEntityCurrencyConfig(
    $input: UpdateEntityCurrencyConfigInput!
  ) {
    updateEntityCurrencyConfig(input: $input) {
      id
      entityId
      currencyName
      normalizationFactor
      tcConversionRate
      tcCoinsAllowed
      minTcPercentage
      maxTcPercentage
      minEntityActivityRequired
      updatedAt
    }
  }
`;

export const UPSERT_ACTIVITY_CAP = gql`
  mutation UpsertActivityCap($input: ActivityCapInput!) {
    upsertActivityCap(input: $input) {
      id
      activityType
      dailyCap
      weeklyCap
      monthlyCap
    }
  }
`;

export const UPDATE_TC_CONVERSION_CAP = gql`
  mutation UpdateTCConversionCap($input: TCConversionCapInput!) {
    updateTCConversionCap(input: $input) {
      id
      maxTcPerDay
      maxTcPerMonth
      maxTcPerEntity
    }
  }
`;

export const UPDATE_REDEMPTION_CAP = gql`
  mutation UpdateRedemptionCap($input: RedemptionCapInput!) {
    updateRedemptionCap(input: $input) {
      id
      maxTcPerOrder
      maxTcPerMonth
    }
  }
`;

export const RE_SEED_DEFAULT_CURRENCY = gql`
  mutation ReSeedDefaultCurrency {
    reSeedDefaultCurrency
  }
`;
