import { gql, useMutation, useQuery } from "@apollo/client";

// ─── TypeScript Types ────────────────────────────────────────────────────────

// 1. White-Label Business Profile
export interface WhatsAppBusinessProfile {
  id: string;
  entityId: string;
  displayName: string;
  about?: string;
  description?: string;
  profilePictureUrl?: string;
  businessEmail?: string;
  website1?: string;
  website2?: string;
  address?: string;
  industryCategory: string;
  verificationStatus: string;
  lastSyncedAt?: string;
}

export interface UpdateWhatsAppBusinessProfileInput {
  displayName: string;
  about?: string;
  description?: string;
  profilePictureUrl?: string;
  businessEmail?: string;
  website1?: string;
  website2?: string;
  address?: string;
  industryCategory?: string;
}

// 2. Prepaid Credit Wallet & Rate Cards
export interface WhatsAppWallet {
  id: string;
  entityId: string;
  currency: string;
  balance: number;
  lifetimeSpent?: number;
  autoRechargeEnabled: boolean;
  autoRechargeThreshold?: number;
  autoRechargeAmount?: number;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface WhatsAppRateCard {
  countryCode: string;
  countryName: string;
  currency: string;
  utilityRate: number;
  marketingRate: number;
  authenticationRate: number;
  serviceRate: number;
}

// 3. Wallet Transaction Ledger
export interface WhatsAppWalletTransaction {
  id: string;
  amount: number;
  currency: string;
  balanceAfter: number;
  type: "TOPUP" | "MESSAGE_DEDUCTION" | "REFUND_ON_FAILURE" | string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}

// 4. WhatsApp Connection & Embedded Signup
export interface WhatsAppConnection {
  id: string;
  entityId?: string;
  provider?: string;
  environment?: string;
  wabaId: string;
  phoneNumberId: string;
  businessId?: string;
  phoneNumber?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  qualityRating?: string;
  status: string;
  hasAccessToken?: boolean;
  accessTokenMasked?: string;
  lastSyncedAt?: string;
  createdAt?: string;
}

export interface ConnectWhatsAppEmbeddedSignupInput {
  code: string;
  wabaId: string;
  phoneNumberId: string;
}

export interface ConnectWhatsAppInput {
  wabaId: string;
  phoneNumberId: string;
  businessId?: string;
  phoneNumber?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  accessToken?: string;
  appSecret?: string;
  webhookVerifyToken?: string;
  isDefault?: boolean;
}

export interface WhatsAppTestResult {
  connected: boolean;
  phoneNumber?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  qualityRating?: string;
  codeVerificationStatus?: string;
  error?: string;
}

// 5. In-App Template Studio
export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  category: string;
  status: string;
  components: any;
  sampleParameters?: string[];
  lastSyncedAt?: string;
  createdAt?: string;
}

export interface CreateInAppWhatsAppTemplateInput {
  name: string;
  language?: string;
  category?: string;
  components: any;
}

// 6. Testing & Diagnostics
export interface SendWhatsAppStagingTestInput {
  recipientPhone: string;
  templateName: string;
  language?: string;
  variables?: string[];
}

export interface WhatsAppTestMessageResult {
  success: boolean;
  messageId?: string;
  status?: string;
  providerMessageId?: string;
  error?: string;
  shouldFallback?: boolean;
}

export interface WhatsAppDiagnosticCheck {
  name: string;
  passed: boolean;
  message?: string;
}

export interface WhatsAppDiagnostics {
  healthy: boolean;
  environment: string;
  checks: WhatsAppDiagnosticCheck[];
}

export interface WhatsAppAnalytics {
  totalMessages: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  deliveryRatePercent: number;
  readRatePercent: number;
  failureRatePercent: number;
}

// ─── GraphQL Operations ──────────────────────────────────────────────────────

// ── 1. Embedded Signup & Connection Mutations ────────────────────────────────

export const CONNECT_WHATSAPP_EMBEDDED_SIGNUP = gql`
  mutation ConnectWhatsAppEmbeddedSignup($input: ConnectWhatsAppEmbeddedSignupInput!) {
    connectWhatsAppEmbeddedSignup(input: $input) {
      id
      entityId
      provider
      environment
      wabaId
      phoneNumberId
      businessId
      phoneNumber
      displayPhoneNumber
      verifiedName
      qualityRating
      status
      hasAccessToken
      accessTokenMasked
      createdAt
    }
  }
`;

export const TEST_WHATSAPP_CONNECTION = gql`
  mutation TestWhatsAppConnection($connectionId: ID!) {
    testWhatsAppConnection(connectionId: $connectionId) {
      connected
      phoneNumber
      displayPhoneNumber
      verifiedName
      qualityRating
      codeVerificationStatus
      error
    }
  }
`;

export const SYNC_WHATSAPP_TEMPLATES = gql`
  mutation SyncWhatsAppTemplates($connectionId: ID!) {
    syncWhatsAppTemplates(connectionId: $connectionId) {
      id
      name
      language
      category
      status
      components
      lastSyncedAt
    }
  }
`;

export const GET_WHATSAPP_CONNECTIONS = gql`
  query GetWhatsAppConnections($environment: String) {
    getWhatsAppConnections(environment: $environment) {
      id
      provider
      wabaId
      phoneNumberId
      businessId
      phoneNumber
      displayPhoneNumber
      verifiedName
      qualityRating
      status
      hasAccessToken
      accessTokenMasked
      lastSyncedAt
      createdAt
    }
  }
`;

export const CONNECT_WHATSAPP = gql`
  mutation ConnectWhatsApp($input: ConnectWhatsAppInput!) {
    connectWhatsApp(input: $input) {
      id
      wabaId
      phoneNumberId
      displayPhoneNumber
      verifiedName
      qualityRating
      status
      hasAccessToken
      accessTokenMasked
    }
  }
`;

// ── 2. White-Label Brand Profile ─────────────────────────────────────────────

export const UPDATE_WHATSAPP_BUSINESS_PROFILE = gql`
  mutation UpdateWhatsAppBusinessProfile($input: UpdateWhatsAppBusinessProfileInput!) {
    updateWhatsAppBusinessProfile(input: $input) {
      id
      entityId
      displayName
      about
      description
      profilePictureUrl
      businessEmail
      website1
      website2
      address
      industryCategory
      verificationStatus
      lastSyncedAt
    }
  }
`;

export const GET_WHATSAPP_BUSINESS_PROFILE = gql`
  query GetWhatsAppBusinessProfile {
    getWhatsAppBusinessProfile {
      id
      entityId
      displayName
      about
      description
      profilePictureUrl
      businessEmail
      website1
      website2
      address
      industryCategory
      verificationStatus
      lastSyncedAt
    }
  }
`;

// ── 3. In-App Template Studio ────────────────────────────────────────────────

export const CREATE_IN_APP_WHATSAPP_TEMPLATE = gql`
  mutation CreateInAppWhatsAppTemplate($input: CreateInAppWhatsAppTemplateInput!) {
    createInAppWhatsAppTemplate(input: $input) {
      id
      name
      language
      category
      status
      components
      createdAt
    }
  }
`;

export const GET_WHATSAPP_TEMPLATES = gql`
  query GetWhatsAppTemplates($status: String) {
    getWhatsAppTemplates(status: $status) {
      id
      name
      language
      category
      status
      components
      sampleParameters
      lastSyncedAt
      createdAt
    }
  }
`;

export const DELETE_IN_APP_WHATSAPP_TEMPLATE = gql`
  mutation DeleteInAppWhatsAppTemplate($id: ID!) {
    deleteInAppWhatsAppTemplate(id: $id)
  }
`;

// ── 4. Communication Credits & Billing ────────────────────────────────────────

export const GET_WHATSAPP_WALLET_AND_RATES = gql`
  query GetWhatsAppWalletAndRates {
    getWhatsAppWallet {
      id
      entityId
      currency
      balance
      lifetimeSpent
      autoRechargeEnabled
      autoRechargeThreshold
      autoRechargeAmount
      status
      updatedAt
    }
    getWhatsAppRateCards {
      countryCode
      countryName
      currency
      utilityRate
      marketingRate
      authenticationRate
      serviceRate
    }
  }
`;

export const GET_WHATSAPP_WALLET = gql`
  query GetWhatsAppWallet {
    getWhatsAppWallet {
      id
      entityId
      currency
      balance
      lifetimeSpent
      autoRechargeEnabled
      autoRechargeThreshold
      autoRechargeAmount
      status
      updatedAt
    }
  }
`;

export const GET_WHATSAPP_RATE_CARDS = gql`
  query GetWhatsAppRateCards {
    getWhatsAppRateCards {
      countryCode
      countryName
      currency
      utilityRate
      marketingRate
      authenticationRate
      serviceRate
    }
  }
`;

export const TOP_UP_WHATSAPP_CREDITS = gql`
  mutation TopUpWhatsAppCredits($amount: Float!, $paymentMethodId: String) {
    topUpWhatsAppCredits(amount: $amount, paymentMethodId: $paymentMethodId) {
      id
      balance
      currency
      lifetimeSpent
      status
    }
  }
`;

export const GET_WHATSAPP_WALLET_TRANSACTIONS = gql`
  query GetWhatsAppWalletTransactions($limit: Int, $offset: Int) {
    getWhatsAppWalletTransactions(limit: $limit, offset: $offset) {
      id
      amount
      currency
      balanceAfter
      type
      description
      referenceType
      referenceId
      createdAt
    }
  }
`;

export const CONFIGURE_WHATSAPP_AUTO_RECHARGE = gql`
  mutation ConfigureWhatsAppAutoRecharge($enabled: Boolean!, $threshold: Float, $amount: Float) {
    configureWhatsAppAutoRecharge(enabled: $enabled, threshold: $threshold, amount: $amount) {
      id
      entityId
      autoRechargeEnabled
      autoRechargeThreshold
      autoRechargeAmount
    }
  }
`;

// ── 5. Testing & Diagnostics ─────────────────────────────────────────────────

export const SEND_WHATSAPP_TEST_MESSAGE = gql`
  mutation SendWhatsAppTestMessage($input: SendWhatsAppStagingTestInput!) {
    sendWhatsAppStagingTestMessage(input: $input) {
      success
      messageId
      status
      providerMessageId
      error
      shouldFallback
    }
  }
`;

export const GET_WHATSAPP_DIAGNOSTICS = gql`
  query GetWhatsAppDiagnostics {
    getWhatsAppDiagnostics {
      healthy
      environment
      checks {
        name
        passed
        message
      }
    }
  }
`;

export const GET_WHATSAPP_ANALYTICS = gql`
  query GetWhatsAppAnalytics($days: Int) {
    getWhatsAppAnalytics(days: $days) {
      totalMessages
      sentCount
      deliveredCount
      readCount
      failedCount
      deliveryRatePercent
      readRatePercent
      failureRatePercent
    }
  }
`;

// ─── React Apollo Hooks ──────────────────────────────────────────────────────

// 1. Connection & Embedded Signup Hooks
export const useConnectWhatsAppEmbeddedSignup = (options?: any) =>
  useMutation<
    { connectWhatsAppEmbeddedSignup: WhatsAppConnection },
    { input: ConnectWhatsAppEmbeddedSignupInput }
  >(CONNECT_WHATSAPP_EMBEDDED_SIGNUP, {
    refetchQueries: [
      { query: GET_WHATSAPP_CONNECTIONS },
      { query: GET_WHATSAPP_BUSINESS_PROFILE },
      { query: GET_WHATSAPP_TEMPLATES },
      { query: GET_WHATSAPP_DIAGNOSTICS },
      { query: GET_WHATSAPP_WALLET_AND_RATES },
    ],
    awaitRefetchQueries: true,
    ...options,
  });

export const useConnectWhatsApp = (options?: any) =>
  useMutation<{ connectWhatsApp: WhatsAppConnection }, { input: ConnectWhatsAppInput }>(
    CONNECT_WHATSAPP,
    {
      refetchQueries: [
        { query: GET_WHATSAPP_CONNECTIONS },
        { query: GET_WHATSAPP_BUSINESS_PROFILE },
        { query: GET_WHATSAPP_DIAGNOSTICS },
      ],
      awaitRefetchQueries: true,
      ...options,
    },
  );

export const useTestWhatsAppConnection = (options?: any) =>
  useMutation<{ testWhatsAppConnection: WhatsAppTestResult }, { connectionId: string }>(
    TEST_WHATSAPP_CONNECTION,
    options,
  );

export const useSyncWhatsAppTemplates = (options?: any) =>
  useMutation<{ syncWhatsAppTemplates: WhatsAppTemplate[] }, { connectionId: string }>(
    SYNC_WHATSAPP_TEMPLATES,
    {
      refetchQueries: [{ query: GET_WHATSAPP_TEMPLATES }],
      awaitRefetchQueries: true,
      ...options,
    },
  );

export const useGetWhatsAppConnections = (options?: any) =>
  useQuery<{ getWhatsAppConnections: WhatsAppConnection[] }>(
    GET_WHATSAPP_CONNECTIONS,
    options,
  );

// 2. White-Label Brand Profile Hooks
export const useGetWhatsAppBusinessProfile = (options?: any) =>
  useQuery<{ getWhatsAppBusinessProfile: WhatsAppBusinessProfile }>(
    GET_WHATSAPP_BUSINESS_PROFILE,
    options,
  );

export const useUpdateWhatsAppBusinessProfile = (options?: any) =>
  useMutation<
    { updateWhatsAppBusinessProfile: WhatsAppBusinessProfile },
    { input: UpdateWhatsAppBusinessProfileInput }
  >(UPDATE_WHATSAPP_BUSINESS_PROFILE, {
    refetchQueries: [{ query: GET_WHATSAPP_BUSINESS_PROFILE }],
    awaitRefetchQueries: true,
    ...options,
  });

// 3. In-App Template Studio Hooks
export const useCreateInAppWhatsAppTemplate = (options?: any) =>
  useMutation<
    { createInAppWhatsAppTemplate: WhatsAppTemplate },
    { input: CreateInAppWhatsAppTemplateInput }
  >(CREATE_IN_APP_WHATSAPP_TEMPLATE, {
    refetchQueries: [{ query: GET_WHATSAPP_TEMPLATES }],
    awaitRefetchQueries: true,
    ...options,
  });

export const useGetWhatsAppTemplates = (variables?: { status?: string }, options?: any) =>
  useQuery<{ getWhatsAppTemplates: WhatsAppTemplate[] }>(
    GET_WHATSAPP_TEMPLATES,
    { variables, ...options },
  );

export const useDeleteInAppWhatsAppTemplate = (options?: any) =>
  useMutation<{ deleteInAppWhatsAppTemplate: boolean }, { id: string }>(
    DELETE_IN_APP_WHATSAPP_TEMPLATE,
    {
      refetchQueries: [{ query: GET_WHATSAPP_TEMPLATES }],
      awaitRefetchQueries: true,
      ...options,
    },
  );

// 4. Communication Credits & Billing Hooks
export const useGetWhatsAppWalletAndRates = (options?: any) =>
  useQuery<{
    getWhatsAppWallet: WhatsAppWallet;
    getWhatsAppRateCards: WhatsAppRateCard[];
  }>(GET_WHATSAPP_WALLET_AND_RATES, options);

export const useGetWhatsAppWallet = (options?: any) =>
  useQuery<{ getWhatsAppWallet: WhatsAppWallet }>(
    GET_WHATSAPP_WALLET,
    options,
  );

export const useGetWhatsAppRateCards = (options?: any) =>
  useQuery<{ getWhatsAppRateCards: WhatsAppRateCard[] }>(
    GET_WHATSAPP_RATE_CARDS,
    options,
  );

export const useTopUpWhatsAppCredits = (options?: any) =>
  useMutation<
    { topUpWhatsAppCredits: WhatsAppWallet },
    { amount: number; paymentMethodId?: string }
  >(TOP_UP_WHATSAPP_CREDITS, {
    refetchQueries: [
      { query: GET_WHATSAPP_WALLET },
      { query: GET_WHATSAPP_WALLET_AND_RATES },
      { query: GET_WHATSAPP_WALLET_TRANSACTIONS },
    ],
    awaitRefetchQueries: true,
    ...options,
  });

export const useGetWhatsAppWalletTransactions = (
  variables?: { limit?: number; offset?: number },
  options?: any,
) =>
  useQuery<{ getWhatsAppWalletTransactions: WhatsAppWalletTransaction[] }>(
    GET_WHATSAPP_WALLET_TRANSACTIONS,
    { variables, ...options },
  );

export const useConfigureWhatsAppAutoRecharge = (options?: any) =>
  useMutation<
    { configureWhatsAppAutoRecharge: WhatsAppWallet },
    { enabled: boolean; threshold?: number; amount?: number }
  >(CONFIGURE_WHATSAPP_AUTO_RECHARGE, {
    refetchQueries: [{ query: GET_WHATSAPP_WALLET }],
    awaitRefetchQueries: true,
    ...options,
  });

// 5. Testing & Diagnostics Hooks
export const useSendWhatsAppTestMessage = (options?: any) =>
  useMutation<
    { sendWhatsAppStagingTestMessage: WhatsAppTestMessageResult },
    { input: SendWhatsAppStagingTestInput }
  >(SEND_WHATSAPP_TEST_MESSAGE, options);

export const useGetWhatsAppDiagnostics = (options?: any) =>
  useQuery<{ getWhatsAppDiagnostics: WhatsAppDiagnostics }>(
    GET_WHATSAPP_DIAGNOSTICS,
    options,
  );

export const useGetWhatsAppAnalytics = (days?: number, options?: any) =>
  useQuery<{ getWhatsAppAnalytics: WhatsAppAnalytics }>(
    GET_WHATSAPP_ANALYTICS,
    { variables: { days: days || 30 }, ...options },
  );
