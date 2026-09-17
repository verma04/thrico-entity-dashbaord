import { gql, useQuery, useMutation, MutationHookOptions } from "@apollo/client";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const GET_AI_WALLET_OVERVIEW = gql`
  query GetAiWalletOverview {
    getAiWalletOverview {
      quota {
        entityId
        balance
        usedThisMonth
        totalUsed
        usagePercent
      }
      topups {
        topupId
        name
        numberOfTokens
        price
        currency
        status
        order
      }
      billingHistory
    }
  }
`;

export const GET_MY_ACTIVE_ADAPTER = gql`
  query GetMyActiveAdapter {
    getMyActiveAdapter {
      id
      provider
      model
      hasKey
      createdAt
      updatedAt
    }
  }
`;

export const LIST_AI_SESSIONS = gql`
  query ListAiSessions {
    listAiSessions {
      sessionId
      title
    }
  }
`;

// ─── Mutations ───────────────────────────────────────────────────────────────

export const BUY_AI_TOPUP = gql`
  mutation BuyAiTopup($input: BuyAiTopupInput!) {
    buyAiTopup(input: $input) {
      billingId
      orderId
      amount
      currency
      razorpayKeyId
      numberOfTokens
    }
  }
`;

export const VERIFY_AI_TOPUP_PAYMENT = gql`
  mutation VerifyAiTopupPayment($input: VerifyAiTopupPaymentInput!) {
    verifyAiTopupPayment(input: $input)
  }
`;

export const EDIT_ADAPTER = gql`
  mutation EditAdapter($input: EditAdapterInput!) {
    editAdapter(input: $input) {
      id
      provider
      model
      hasKey
      updatedAt
    }
  }
`;

export const ADD_AI_KEY = gql`
  mutation AddKeys($input: AddAiKeyInput!) {
    addKeys(input: $input)
  }
`;

// ─── Hooks ───────────────────────────────────────────────────────────────────

export const useGetAiWalletOverview = () =>
  useQuery(GET_AI_WALLET_OVERVIEW, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

export const useGetMyActiveAdapter = () =>
  useQuery(GET_MY_ACTIVE_ADAPTER, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

export const useListAiSessions = () =>
  useQuery(LIST_AI_SESSIONS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

export const useBuyAiTopup = (options?: any) =>
  useMutation(BUY_AI_TOPUP, {
    ...options,
  });

export const useVerifyAiTopupPayment = (options?: any) =>
  useMutation(VERIFY_AI_TOPUP_PAYMENT, {
    refetchQueries: [{ query: GET_AI_WALLET_OVERVIEW }],
    ...options,
  });

export const useEditAdapter = (options?: any) =>
  useMutation(EDIT_ADAPTER, {
    refetchQueries: [{ query: GET_MY_ACTIVE_ADAPTER }],
    ...options,
  });

export const useAddAiKey = (options?: any) =>
  useMutation(ADD_AI_KEY, {
    refetchQueries: [{ query: GET_MY_ACTIVE_ADAPTER }],
    ...options,
  });

export const GET_AI_TOPUP_PACKAGES = gql`
  query GetAiTopupPackages($countryCode: String) {
    getAiTopupPackages(countryCode: $countryCode) {
      topupId
      name
      numberOfTokens
      price
      currency
      status
      order
    }
  }
`;

export const GET_AI_BILLING_HISTORY = gql`
  query GetAiBillingHistory {
    getAiBillingHistory
  }
`;

export const CLEAR_AI_SESSION = gql`
  mutation ClearAiSession($sessionId: ID!) {
    clearAiSession(sessionId: $sessionId)
  }
`;

export const useGetAiTopupPackages = (countryCode?: string) =>
  useQuery(GET_AI_TOPUP_PACKAGES, {
    variables: { countryCode },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

export const useGetAiBillingHistory = () =>
  useQuery(GET_AI_BILLING_HISTORY, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

export const useClearAiSession = (options?: any) =>
  useMutation(CLEAR_AI_SESSION, {
    refetchQueries: [{ query: LIST_AI_SESSIONS }],
    ...options,
  });

export const GET_AI_USAGE_HISTORY = gql`
  query GetAiUsageHistory($input: AiTokenUsageFilterInput) {
    getAiUsageHistory(input: $input) {
      items {
        id
        entityId
        module
        action
        description
        referenceId
        tokens
        promptTokens
        completionTokens
        model
        metadata
        createdAt
        costInr
        costUsd
      }
      total
      totalPages
      page
      limit
      totalTokens
      estimatedCostInr
      estimatedCostUsd
    }
  }
`;

export const useGetAiUsageHistory = (
  input?: AiTokenUsageFilterInput,
  options?: any
) =>
  useQuery<{ getAiUsageHistory: AiTokenUsageHistoryResponse }>(
    GET_AI_USAGE_HISTORY,
    {
      variables: { input },
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      ...options,
    }
  );

// ─── Types & Enums ──────────────────────────────────────────────────────────

export enum AiModuleEnum {
  MODERATION = "MODERATION",
  CUSTOMER_360 = "CUSTOMER_360",
  AGENT = "AGENT",
  ANALYTICS = "ANALYTICS",
  COMMUNITY = "COMMUNITY",
  JOB = "JOB",
  CONTENT = "CONTENT",
  OTHER = "OTHER",
}

export enum AiActionEnum {
  // Moderation
  MODERATE_POST = "MODERATE_POST",
  MODERATE_COMMENT = "MODERATE_COMMENT",
  MODERATE_USER = "MODERATE_USER",
  MODERATE_CONTENT = "MODERATE_CONTENT",

  // Customer 360 & Analytics
  CUSTOMER_360_SUMMARY = "CUSTOMER_360_SUMMARY",
  CHURN_ANALYSIS = "CHURN_ANALYSIS",
  COHORT_ANALYSIS = "COHORT_ANALYSIS",

  // AI Agent & Assistant
  AGENT_CHAT = "AGENT_CHAT",
  COMMUNITY_AGENT = "COMMUNITY_AGENT",
  JOB_AGENT = "JOB_AGENT",
  SUPERVISOR_ROUTING = "SUPERVISOR_ROUTING",

  // Content Generation & Search
  GENERATE_CONTENT = "GENERATE_CONTENT",
  GENERATE_BIO = "GENERATE_BIO",
  SEARCH_EXPANSION = "SEARCH_EXPANSION",
  EMBEDDING = "EMBEDDING",

  // Fallback
  OTHER = "OTHER",
}

export interface AiTokenUsageFilterInput {
  page?: number;
  limit?: number;
  module?: string;
  moduleEnum?: AiModuleEnum;
  action?: string;
  actionEnum?: AiActionEnum;
  referenceId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AiTokenUsageLog {
  id: string;
  entityId: string;
  module: string;
  action?: string;
  description?: string;
  referenceId?: string;
  tokens: number;
  promptTokens?: number;
  completionTokens?: number;
  model: string;
  metadata?: any;
  createdAt: string;
  costInr: number;
  costUsd: number;
}

export interface AiTokenUsageHistoryResponse {
  items: AiTokenUsageLog[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  totalTokens: number;
  estimatedCostInr: number;
  estimatedCostUsd: number;
}

// Re-export askAgent chat hook from aiAnalytics
export { useAiAnalyticsChat, ASK_AI_AGENT } from "../../analytics/aiAnalytics";
export type { AskAgentInput, AskAgentResponse } from "../../analytics/aiAnalytics";

// Re-export moderation settings hooks and types
export {
  useGetAiModerationSettings,
  useUpdateAiModerationSettings,
  useGetAiModerationDashboard,
  useGetAiModerationLogs,
  useGetAiTokenUsage,
} from "../../moderation/hooks";
export type {
  AiModerationSettings,
  AiModerationDashboard,
} from "../../moderation/types";

