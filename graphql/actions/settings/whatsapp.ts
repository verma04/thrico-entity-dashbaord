import { gql, useMutation, useQuery, type QueryHookOptions, type MutationHookOptions } from "@apollo/client";
import type {
  WhatsAppTemplateStatus,
  WhatsAppMessageStatus,
  WhatsAppParameterFormat,
  WhatsAppTemplateComponent,
  CreateInAppWhatsAppTemplateInput,
  SendWhatsAppStagingTestInput,
  WhatsAppTestSendResult,
  WhatsAppWallet,
  WhatsAppAnalytics,
} from "@/types/whatsapp";

export type {
  WhatsAppTemplateStatus,
  WhatsAppMessageStatus,
  WhatsAppParameterFormat,
  WhatsAppTemplateComponent,
  CreateInAppWhatsAppTemplateInput,
  SendWhatsAppStagingTestInput,
  WhatsAppTestSendResult,
  WhatsAppWallet,
  WhatsAppAnalytics,
};


export enum WhatsAppConnectionStatus {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  PENDING = "PENDING",
  ERROR = "ERROR",
}

export interface WhatsAppConnection {
  id: string;
  entityId: string;
  provider: string;
  environment?: string;
  wabaId?: string;
  phoneNumberId?: string;
  businessId?: string;
  phoneNumber?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  qualityRating?: string;
  status: WhatsAppConnectionStatus;
  statusDetails?: Record<string, unknown>;
  isDefault: boolean;
  hasAccessToken: boolean;
  hasAppSecret: boolean;
  hasWebhookVerifyToken: boolean;
  accessTokenMasked?: string;
  lastSyncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConnectWhatsAppEmbeddedSignupInput {
  code: string;
  wabaId?: string;
  phoneNumberId?: string;
  businessId?: string;
}

export interface WhatsAppConnectionStatusResult {
  connected: boolean;
  phoneNumber?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  qualityRating?: string;
  codeVerificationStatus?: string;
  error?: string;
}

export interface WhatsAppTemplate {
  id: string;
  entityId?: string;
  connectionId?: string;
  providerTemplateId?: string;
  name: string;
  language: string;
  category: string;
  status: WhatsAppTemplateStatus | string;
  parameterFormat?: WhatsAppParameterFormat;
  components?: WhatsAppTemplateComponent[];
  sampleParameters?: Record<string, unknown>;
  lastSyncedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetWhatsAppConnectionsResponse {
  getWhatsAppConnections: WhatsAppConnection[];
}

export interface GetWhatsAppConnectionResponse {
  getWhatsAppConnection: WhatsAppConnection | null;
}

export interface ConnectWhatsAppEmbeddedSignupResponse {
  connectWhatsAppEmbeddedSignup: WhatsAppConnection;
}

export interface TestWhatsAppConnectionResponse {
  testWhatsAppConnection: WhatsAppConnectionStatusResult;
}

export interface SyncWhatsAppTemplatesResponse {
  syncWhatsAppTemplates: WhatsAppTemplate[];
}

// ==========================================
// GRAPHQL QUERIES
// ==========================================

export const GET_WHATSAPP_CONNECTIONS = gql`
  query GetWhatsAppConnections($environment: String) {
    getWhatsAppConnections(environment: $environment) {
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
      statusDetails
      isDefault
      hasAccessToken
      hasAppSecret
      hasWebhookVerifyToken
      accessTokenMasked
      lastSyncedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_WHATSAPP_CONNECTION = gql`
  query GetWhatsAppConnection($id: ID!) {
    getWhatsAppConnection(id: $id) {
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
      statusDetails
      isDefault
      hasAccessToken
      hasAppSecret
      hasWebhookVerifyToken
      accessTokenMasked
      lastSyncedAt
      createdAt
      updatedAt
    }
  }
`;

// ==========================================
// GRAPHQL MUTATIONS
// ==========================================

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
      isDefault
      accessTokenMasked
      lastSyncedAt
      createdAt
      updatedAt
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
    }
  }
`;

// ==========================================
// APOLLO HOOKS
// ==========================================

export const useGetWhatsAppConnections = (
  options?: QueryHookOptions<GetWhatsAppConnectionsResponse, { environment?: string }>
) => {
  return useQuery<GetWhatsAppConnectionsResponse, { environment?: string }>(
    GET_WHATSAPP_CONNECTIONS,
    {
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};

export const useGetWhatsAppConnection = (
  id: string,
  options?: QueryHookOptions<GetWhatsAppConnectionResponse, { id: string }>
) => {
  return useQuery<GetWhatsAppConnectionResponse, { id: string }>(
    GET_WHATSAPP_CONNECTION,
    {
      variables: { id },
      skip: !id,
      ...options,
    }
  );
};

export const useConnectWhatsAppEmbeddedSignup = (
  options?: MutationHookOptions<
    ConnectWhatsAppEmbeddedSignupResponse,
    { input: ConnectWhatsAppEmbeddedSignupInput }
  >
) => {
  return useMutation<
    ConnectWhatsAppEmbeddedSignupResponse,
    { input: ConnectWhatsAppEmbeddedSignupInput }
  >(CONNECT_WHATSAPP_EMBEDDED_SIGNUP, {
    refetchQueries: [{ query: GET_WHATSAPP_CONNECTIONS }],
    awaitRefetchQueries: true,
    ...options,
  });
};

export const useTestWhatsAppConnection = (
  options?: MutationHookOptions<
    TestWhatsAppConnectionResponse,
    { connectionId: string }
  >
) => {
  return useMutation<
    TestWhatsAppConnectionResponse,
    { connectionId: string }
  >(TEST_WHATSAPP_CONNECTION, options);
};

export const useSyncWhatsAppTemplates = (
  options?: MutationHookOptions<
    SyncWhatsAppTemplatesResponse,
    { connectionId: string }
  >
) => {
  return useMutation<
    SyncWhatsAppTemplatesResponse,
    { connectionId: string }
  >(SYNC_WHATSAPP_TEMPLATES, options);
};

export interface WhatsAppConfig {
  appId: string;
  configId: string;
  graphApiVersion: string;
}

export interface GetWhatsAppConfigResponse {
  getWhatsAppConfig: WhatsAppConfig;
}

export const GET_WHATSAPP_CONFIG = gql`
  query GetWhatsAppConfig {
    getWhatsAppConfig {
      appId
      configId
      graphApiVersion
    }
  }
`;

export const useGetWhatsAppConfig = (
  options?: QueryHookOptions<GetWhatsAppConfigResponse>
) => {
  return useQuery<GetWhatsAppConfigResponse>(GET_WHATSAPP_CONFIG, {
    fetchPolicy: "cache-first",
    ...options,
  });
};

// ==========================================
// DIRECT CONNECT (Test Key / Sandbox Mode)
// ==========================================

export const CONNECT_WHATSAPP_DIRECT = gql`
  mutation ConnectWhatsApp($input: ConnectWhatsAppInput!) {
    connectWhatsApp(input: $input) {
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
      isDefault
      accessTokenMasked
      lastSyncedAt
      createdAt
      updatedAt
    }
  }
`;

export interface ConnectWhatsAppDirectInput {
  provider?: string;
  environment?: string;
  wabaId: string;
  phoneNumberId: string;
  businessId?: string;
  phoneNumber?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  accessToken: string;
  appSecret?: string;
  webhookVerifyToken?: string;
  isDefault?: boolean;
}

export interface ConnectWhatsAppDirectResponse {
  connectWhatsApp: WhatsAppConnection;
}

export const useConnectWhatsAppDirect = (
  options?: MutationHookOptions<
    ConnectWhatsAppDirectResponse,
    { input: ConnectWhatsAppDirectInput }
  >
) => {
  return useMutation<
    ConnectWhatsAppDirectResponse,
    { input: ConnectWhatsAppDirectInput }
  >(CONNECT_WHATSAPP_DIRECT, {
    refetchQueries: [{ query: GET_WHATSAPP_CONNECTIONS }],
    awaitRefetchQueries: true,
    ...options,
  });
};

// ==========================================
// TEMPLATE, WALLET & ANALYTICS QUERIES & MUTATIONS
// ==========================================

export const GET_WHATSAPP_TEMPLATES = gql`
  query GetWhatsAppTemplates($status: String) {
    getWhatsAppTemplates(status: $status) {
      id
      entityId
      connectionId
      providerTemplateId
      name
      language
      category
      status
      parameterFormat
      components
      sampleParameters
      lastSyncedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_WHATSAPP_WALLET = gql`
  query GetWhatsAppWallet {
    getWhatsAppWallet {
      id
      entityId
      balance
      currency
      autoRechargeEnabled
      autoRechargeThreshold
      autoRechargeAmount
      lowBalanceAlertSent
      updatedAt
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
      queuedCount
      deliveryRatePercent
      readRatePercent
      failureRatePercent
    }
  }
`;

export const CREATE_IN_APP_WHATSAPP_TEMPLATE = gql`
  mutation CreateInAppWhatsAppTemplate($input: CreateInAppWhatsAppTemplateInput!) {
    createInAppWhatsAppTemplate(input: $input) {
      id
      name
      language
      category
      status
      parameterFormat
      components
      createdAt
    }
  }
`;

export const CHECK_WHATSAPP_TEMPLATE_STATUS = gql`
  mutation CheckWhatsAppTemplateStatus($templateId: ID!) {
    checkWhatsAppTemplateStatus(templateId: $templateId) {
      id
      name
      language
      category
      status
      lastSyncedAt
      updatedAt
    }
  }
`;

export const DELETE_IN_APP_WHATSAPP_TEMPLATE = gql`
  mutation DeleteInAppWhatsAppTemplate($id: ID!) {
    deleteInAppWhatsAppTemplate(id: $id)
  }
`;

export const SEND_WHATSAPP_STAGING_TEST_MESSAGE = gql`
  mutation SendWhatsAppStagingTestMessage($input: SendWhatsAppStagingTestInput!) {
    sendWhatsAppStagingTestMessage(input: $input) {
      success
      messageId
      providerMessageId
      status
      error
      shouldFallback
    }
  }
`;

// ==========================================
// TEMPLATE, WALLET & ANALYTICS HOOKS
// ==========================================

export const useGetWhatsAppTemplates = (
  status?: string,
  options?: QueryHookOptions<{ getWhatsAppTemplates: WhatsAppTemplate[] }>
) => {
  return useQuery<{ getWhatsAppTemplates: WhatsAppTemplate[] }>(GET_WHATSAPP_TEMPLATES, {
    variables: { status },
    fetchPolicy: "cache-and-network",
    ...options,
  });
};

export const useCreateInAppWhatsAppTemplate = (
  options?: MutationHookOptions<
    { createInAppWhatsAppTemplate: WhatsAppTemplate },
    { input: CreateInAppWhatsAppTemplateInput }
  >
) => {
  return useMutation<
    { createInAppWhatsAppTemplate: WhatsAppTemplate },
    { input: CreateInAppWhatsAppTemplateInput }
  >(CREATE_IN_APP_WHATSAPP_TEMPLATE, {
    refetchQueries: [{ query: GET_WHATSAPP_TEMPLATES }],
    awaitRefetchQueries: true,
    ...options,
  });
};

export const useCheckWhatsAppTemplateStatus = (
  options?: MutationHookOptions<
    { checkWhatsAppTemplateStatus: WhatsAppTemplate },
    { templateId: string }
  >
) => {
  return useMutation<
    { checkWhatsAppTemplateStatus: WhatsAppTemplate },
    { templateId: string }
  >(CHECK_WHATSAPP_TEMPLATE_STATUS, options);
};

export const useDeleteInAppWhatsAppTemplate = (
  options?: MutationHookOptions<{ deleteInAppWhatsAppTemplate: boolean }, { id: string }>
) => {
  return useMutation<{ deleteInAppWhatsAppTemplate: boolean }, { id: string }>(
    DELETE_IN_APP_WHATSAPP_TEMPLATE,
    {
      refetchQueries: [{ query: GET_WHATSAPP_TEMPLATES }],
      awaitRefetchQueries: true,
      ...options,
    }
  );
};

export const useSendWhatsAppStagingTestMessage = (
  options?: MutationHookOptions<
    { sendWhatsAppStagingTestMessage: WhatsAppTestSendResult },
    { input: SendWhatsAppStagingTestInput }
  >
) => {
  return useMutation<
    { sendWhatsAppStagingTestMessage: WhatsAppTestSendResult },
    { input: SendWhatsAppStagingTestInput }
  >(SEND_WHATSAPP_STAGING_TEST_MESSAGE, options);
};

export const useGetWhatsAppWallet = (
  options?: QueryHookOptions<{ getWhatsAppWallet: WhatsAppWallet }>
) => {
  return useQuery<{ getWhatsAppWallet: WhatsAppWallet }>(GET_WHATSAPP_WALLET, {
    fetchPolicy: "cache-and-network",
    ...options,
  });
};

export const useGetWhatsAppAnalytics = (
  days: number = 30,
  options?: QueryHookOptions<{ getWhatsAppAnalytics: WhatsAppAnalytics }>
) => {
  return useQuery<{ getWhatsAppAnalytics: WhatsAppAnalytics }>(GET_WHATSAPP_ANALYTICS, {
    variables: { days },
    fetchPolicy: "cache-and-network",
    ...options,
  });
};

