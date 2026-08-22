import { gql } from "@apollo/client";

export const GET_ENTITY_REWARD_WALLET = gql`
  query GetEntityRewardWallet {
    getEntityRewardWallet {
      id
      entityId
      balance
      currency
      totalFunded
      totalSpent
      totalFeesPaid
      lowBalanceThreshold
      createdAt
      updatedAt
    }
  }
`;

export const GET_DIGITAL_CARD_RULES = gql`
  query GetDigitalCardRules($page: Int, $limit: Int, $search: String) {
    getDigitalCardRules(page: $page, limit: $limit, search: $search) {
      total
      page
      limit
      totalPages
      items {
        id
        provider
        providerProductId
        brandName
        title
        description
        image
        faceValue
        serviceFee
        totalCost
        currency
        country
        validityDays
        isActive
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_DIGITAL_CARD_RULE_BY_ID = gql`
  query GetDigitalCardRuleById($id: ID!) {
    getDigitalCardRuleById(id: $id) {
      id
      entityId
      provider
      providerProductId
      brandName
      title
      description
      image
      faceValue
      serviceFee
      totalCost
      currency
      country
      validityDays
      isActive
      status
      metadata
      createdAt
      updatedAt
    }
  }
`;


export const GET_REWARD_LEDGER = gql`
  query GetRewardLedger($pagination: PaginationInput) {
    getRewardLedger(pagination: $pagination) {
      items {
        id
        entityId
        userId
        user {
          id
          firstName
          lastName
          email
          avatar
        }
        issuanceId
        entryType
        rewardValue
        serviceFee
        totalAmount
        balanceBefore
        balanceAfter
        referenceId
        notes
        createdAt
      }
      total
    }
  }
`;

export const GET_REWARD_ISSUANCES = gql`
  query GetRewardIssuances(
    $status: String
    $provider: String
    $pagination: PaginationInput
  ) {
    getRewardIssuances(
      status: $status
      provider: $provider
      pagination: $pagination
    ) {
      items {
        id
        entityId
        userId
        user {
          id
          firstName
          lastName
          email
          avatar
        }
        rewardId
        reward {
          id
          title
          image
          tcCost
        }
        gameType
        provider
        providerProductId
        code
        pin
        cardUrl
        faceValue
        serviceFee
        currency
        status
        issuedAt
        claimedAt
        redeemedAt
        expiresAt
        createdAt
      }
      total
    }
  }
`;

export const GET_PROVIDER_PRODUCTS = gql`
  query GetProviderProducts($provider: String, $country: String) {
    getProviderProducts(provider: $provider, country: $country) {
      id
      provider
      productId
      brand
      name
      description
      logoUrl
      country
      currency
      minPrice
      maxPrice
      denominations
      terms
      isActive
    }
  }
`;

export const GET_PROVIDER_CONNECTIONS = gql`
  query GetProviderConnections {
    getProviderConnections {
      id
      entityId
      provider
      merchantId
      environment
      status
      providerBalance
      lastSyncAt
      lastBalanceSync
    }
  }
`;
