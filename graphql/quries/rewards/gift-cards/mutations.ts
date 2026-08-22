import { gql } from "@apollo/client";

export const TOPUP_REWARD_WALLET = gql`
  mutation TopupRewardWallet(
    $amount: Float!
    $paymentReference: String!
    $notes: String
  ) {
    topupRewardWallet(
      amount: $amount
      paymentReference: $paymentReference
      notes: $notes
    ) {
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

export const CREATE_REWARD_WALLET_TOPUP_ORDER = gql`
  mutation CreateRewardWalletTopupOrder($input: CreateWalletTopupOrderInput!) {
    createRewardWalletTopupOrder(input: $input) {
      orderId
      amount
      amountInPaise
      currency
      razorpayKeyId
      entityId
    }
  }
`;

export const VERIFY_REWARD_WALLET_TOPUP_PAYMENT = gql`
  mutation VerifyRewardWalletTopupPayment(
    $input: VerifyWalletTopupPaymentInput!
  ) {
    verifyRewardWalletTopupPayment(input: $input) {
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


export const CREATE_DIGITAL_CARD_RULE = gql`
  mutation CreateDigitalCardRule($input: CreateDigitalCardRuleInput!) {
    createDigitalCardRule(input: $input) {
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
    }
  }
`;

export const UPDATE_DIGITAL_CARD_RULE = gql`
  mutation UpdateDigitalCardRule(
    $id: ID!
    $input: UpdateDigitalCardRuleInput!
  ) {
    updateDigitalCardRule(id: $id, input: $input) {
      id
      title
      description
      image
      faceValue
      serviceFee
      totalCost
      validityDays
      isActive
      status
      updatedAt
    }
  }
`;

export const DELETE_DIGITAL_CARD_RULE = gql`
  mutation DeleteDigitalCardRule($id: ID!) {
    deleteDigitalCardRule(id: $id)
  }
`;


export const CONNECT_PROVIDER = gql`
  mutation ConnectProvider($input: ConnectProviderInput!) {
    connectProvider(input: $input) {
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

export const SYNC_PROVIDER_PRODUCTS = gql`
  mutation SyncProviderProducts($provider: String, $country: String) {
    syncProviderProducts(provider: $provider, country: $country)
  }
`;

export const ISSUE_REWARD = gql`
  mutation IssueReward($input: IssueRewardInput!) {
    issueReward(input: $input) {
      success
      issuanceId
      rewardId
      rewardTitle
      rewardType
      provider
      code
      pin
      cardUrl
      faceValue
      serviceFee
      currency
      status
      expiresAt
      error
    }
  }
`;

export const SIMULATE_REWARD_ISSUANCE = gql`
  mutation SimulateRewardIssuance($input: SimulateRewardIssuanceInput!) {
    simulateRewardIssuance(input: $input) {
      success
      issuanceId
      rewardId
      rewardTitle
      rewardType
      provider
      code
      pin
      cardUrl
      faceValue
      serviceFee
      currency
      status
      expiresAt
      error
    }
  }
`;
