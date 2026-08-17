import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";

// ==========================================
// ENUMS
// ==========================================

export enum CRMProvider {
  SALESFORCE = "SALESFORCE",
  ZOHO = "ZOHO",
  ODOO = "ODOO",
}

export enum CRMAuthType {
  OAUTH2 = "OAUTH2",
  API_KEY = "API_KEY",
  REST_CREDENTIALS = "REST_CREDENTIALS",
}

export enum CRMConnectionStatus {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  ERROR = "ERROR",
}

export enum CRMSyncType {
  INITIAL = "INITIAL",
  INCREMENTAL = "INCREMENTAL",
  MANUAL = "MANUAL",
  RECONCILIATION = "RECONCILIATION",
  EVENT = "EVENT",
}

export enum CRMSyncStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  PARTIAL_SUCCESS = "PARTIAL_SUCCESS",
  FAILED = "FAILED",
}

export enum CRMMemberStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DEACTIVATED = "DEACTIVATED",
  TERMINATED = "TERMINATED",
}

// ==========================================
// CONFIGURATION & METADATA
// ==========================================

export interface CRMProviderMetaConfig {
  provider: CRMProvider;
  name: string;
  category: "Enterprise CRM" | "Cloud CRM" | "Open Source CRM";
  color: string;
  description: string;
  defaultAuthType: CRMAuthType;
  supportedAuthTypes: CRMAuthType[];
  requiresTenant?: boolean;
  tenantLabel?: string;
  requiresDatabase?: boolean;
  databaseLabel?: string;
  urlPlaceholder: string;
  hint: string;
  docsUrl?: string;
}

export const CRM_PROVIDERS_CONFIG: Record<string, CRMProviderMetaConfig> = {
  [CRMProvider.SALESFORCE]: {
    provider: CRMProvider.SALESFORCE,
    name: "Salesforce",
    category: "Enterprise CRM",
    color: "#00A1E0",
    description: "Sync Contacts, Leads, Accounts, and custom CRM objects from Salesforce.",
    defaultAuthType: CRMAuthType.OAUTH2,
    supportedAuthTypes: [CRMAuthType.OAUTH2],
    requiresTenant: false,
    urlPlaceholder: "https://your-instance.my.salesforce.com",
    hint: "Salesforce Setup → App Manager → New Connected App with OAuth scopes (api, refresh_token).",
    docsUrl: "https://help.thrico.com/docs/integrations/salesforce",
  },
  [CRMProvider.ZOHO]: {
    provider: CRMProvider.ZOHO,
    name: "Zoho CRM",
    category: "Cloud CRM",
    color: "#E42528",
    description: "Import contacts, leads, and customer lifecycle attributes from Zoho CRM.",
    defaultAuthType: CRMAuthType.OAUTH2,
    supportedAuthTypes: [CRMAuthType.OAUTH2, CRMAuthType.API_KEY],
    requiresTenant: false,
    urlPlaceholder: "https://www.zohoapis.com",
    hint: "Zoho API Console → Add Client (Server-based Application) → Scopes (ZohoCRM.modules.ALL).",
    docsUrl: "https://help.thrico.com/docs/integrations/zoho",
  },
  [CRMProvider.ODOO]: {
    provider: CRMProvider.ODOO,
    name: "Odoo CRM",
    category: "Open Source CRM",
    color: "#714B67",
    description: "Connect Odoo partners, customers, and custom models via JSON-RPC / REST API.",
    defaultAuthType: CRMAuthType.REST_CREDENTIALS,
    supportedAuthTypes: [CRMAuthType.REST_CREDENTIALS, CRMAuthType.API_KEY],
    requiresDatabase: true,
    databaseLabel: "Odoo Database Name",
    urlPlaceholder: "https://mycompany.odoo.com",
    hint: "Odoo Settings → Technical → Database & API Keys / User Credentials.",
    docsUrl: "https://help.thrico.com/docs/integrations/odoo",
  },
};

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface CRMProviderMeta {
  provider: CRMProvider;
  name: string;
  authType: CRMAuthType;
  description: string;
}

export interface CRMConnection {
  id: string;
  entityId: string;
  provider: CRMProvider;
  tenantName?: string;
  baseUrl: string;
  databaseName?: string;
  authType: CRMAuthType;
  status: CRMConnectionStatus | string;
  autoSyncEnabled: boolean;
  syncScheduleCron?: string;
  deactivateOnDelete: boolean;
  lastSchemaSyncAt?: string;
  lastSyncAt?: string;
  lastSyncStatus?: CRMSyncStatus | string;
  lastErrorMessage?: string;
  installedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CRMMember {
  id: string;
  entityId: string;
  provider: CRMProvider;
  objectType: string;
  externalId: string;
  thricoUserId?: string;
  email?: string;
  status: CRMMemberStatus;
  customFields?: string;
  lastSyncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CRMDiscoveredField {
  externalFieldName: string;
  displayName: string;
  dataType: string;
  required: boolean;
  custom: boolean;
  readable: boolean;
  writable: boolean;
  referenceObject?: string;
  options?: string[];
}

export interface CRMDiscoveredRelationship {
  sourceFieldName: string;
  targetObjectName: string;
  relationshipType: string;
}

export interface CRMDiscoveredObject {
  id?: string;
  externalObjectName: string;
  displayName: string;
  objectType: string;
  queryable: boolean;
  updateable: boolean;
  fields?: CRMDiscoveredField[];
  relationships?: CRMDiscoveredRelationship[];
}

export interface CRMSchemaResult {
  connectionId: string;
  provider: CRMProvider;
  lastSchemaSyncAt?: string;
  objects: CRMDiscoveredObject[];
}

export interface CRMFieldMappingInput {
  sourceObject: string;
  sourceField: string;
  targetType: string;
  targetField: string;
  transformConfig?: string;
  syncDirection?: string;
  enabled?: boolean;
}

export interface CRMFieldMapping {
  sourceObject: string;
  sourceField: string;
  targetType: string;
  targetField: string;
  transformConfig?: string;
  syncDirection?: string;
  enabled: boolean;
}

export interface CRMMappingVersionResult {
  versionId: string;
  version: number;
  mappingCount: number;
}

export interface CRMMappingsResult {
  version: number;
  mappings: CRMFieldMapping[];
}

export interface CRMMappingPreviewResult {
  rawRecord: string;
  normalizedRecord: string;
  isValid: boolean;
  validationErrors: string[];
}

export interface CRMSyncLog {
  id: string;
  entityId: string;
  provider: CRMProvider;
  syncId: string;
  syncType: CRMSyncType;
  status: CRMSyncStatus;
  readCount: number;
  createdCount: number;
  updatedCount: number;
  deactivatedCount: number;
  failedCount: number;
  startedAt: string;
  completedAt?: string;
  details?: string;
}

export interface CRMHubStats {
  totalConnectedProviders: number;
  totalRecordsSynced: number;
  activeMembersCount: number;
  deactivatedMembersCount: number;
  lastSyncAt?: string;
  healthyProvidersCount: number;
}

export interface CRMTestConnectionResult {
  success: boolean;
  provider?: CRMProvider;
  message: string;
}

export interface CRMSyncJobResult {
  success: boolean;
  syncId?: string;
  message: string;
}

export interface PaginatedCRMMembers {
  members: CRMMember[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedCRMSyncLogs {
  logs: CRMSyncLog[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CRMCommunityRule {
  id: string;
  entityId: string;
  provider: CRMProvider;
  name: string;
  sourceField: string;
  operator: string;
  matchValue: string;
  communityId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConnectCRMProviderInput {
  provider: CRMProvider;
  baseUrl: string;
  tenantName?: string;
  databaseName?: string;
  authType?: CRMAuthType;
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  username?: string;
  accessKey?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenEndpoint?: string;
  customHeaders?: string;
  autoSyncEnabled?: boolean;
  syncScheduleCron?: string;
  deactivateOnDelete?: boolean;
  redirectUri?: string;
}

export interface TestCRMConnectionInput {
  provider: CRMProvider;
  baseUrl: string;
  tenantName?: string;
  databaseName?: string;
  authType?: CRMAuthType;
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  username?: string;
  accessKey?: string;
  accessToken?: string;
  tokenEndpoint?: string;
  customHeaders?: string;
}

export interface UpdateCRMConfigInput {
  provider: CRMProvider;
  autoSyncEnabled?: boolean;
  syncScheduleCron?: string;
  deactivateOnDelete?: boolean;
}

export interface CRMMemberPaginationInput {
  page?: number;
  limit?: number;
  search?: string;
  objectType?: string;
  status?: CRMMemberStatus;
}

export interface CRMSyncLogPaginationInput {
  page?: number;
  limit?: number;
}

export interface UpsertCRMCommunityRuleInput {
  id?: string;
  provider: CRMProvider;
  name: string;
  sourceField: string;
  operator?: string;
  matchValue: string;
  communityId: string;
  isActive?: boolean;
}

export interface ConnectCRMResponse {
  success: boolean;
  message: string;
  authUrl?: string;
  mode?: string;
  connection?: CRMConnection;
}

// ==========================================
// GRAPHQL QUERIES
// ==========================================

export const GET_CRM_PROVIDERS = gql`
  query GetCRMProviders {
    getCRMProviders {
      provider
      name
      authType
      description
    }
  }
`;

export const GET_CRM_CONNECTIONS = gql`
  query GetCRMConnections {
    getCRMConnections {
      id
      entityId
      provider
      tenantName
      baseUrl
      databaseName
      authType
      status
      autoSyncEnabled
      syncScheduleCron
      deactivateOnDelete
      lastSchemaSyncAt
      lastSyncAt
      lastSyncStatus
      lastErrorMessage
      installedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_CRM_CONNECTION = gql`
  query GetCRMConnection($provider: CRMProvider!) {
    getCRMConnection(provider: $provider) {
      id
      entityId
      provider
      tenantName
      baseUrl
      databaseName
      authType
      status
      autoSyncEnabled
      syncScheduleCron
      deactivateOnDelete
      lastSchemaSyncAt
      lastSyncAt
      lastSyncStatus
      lastErrorMessage
      installedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_CRM_MEMBERS = gql`
  query GetCRMMembers($provider: CRMProvider, $input: CRMMemberPaginationInput) {
    getCRMMembers(provider: $provider, input: $input) {
      members {
        id
        entityId
        provider
        objectType
        externalId
        thricoUserId
        email
        status
        customFields
        lastSyncedAt
        createdAt
        updatedAt
      }
      totalCount
      page
      limit
      totalPages
    }
  }
`;

export const GET_CRM_SYNC_LOGS = gql`
  query GetCRMSyncLogs($provider: CRMProvider, $input: CRMSyncLogPaginationInput) {
    getCRMSyncLogs(provider: $provider, input: $input) {
      logs {
        id
        entityId
        provider
        syncId
        syncType
        status
        readCount
        createdCount
        updatedCount
        deactivatedCount
        failedCount
        startedAt
        completedAt
        details
      }
      totalCount
      page
      limit
      totalPages
    }
  }
`;

export const GET_CRM_HUB_STATS = gql`
  query GetCRMHubStats {
    getCRMHubStats {
      totalConnectedProviders
      totalRecordsSynced
      activeMembersCount
      deactivatedMembersCount
      lastSyncAt
      healthyProvidersCount
    }
  }
`;

export const GET_CRM_SCHEMA = gql`
  query GetCRMSchema($provider: CRMProvider!) {
    getCRMSchema(provider: $provider) {
      connectionId
      provider
      lastSchemaSyncAt
      objects {
        id
        externalObjectName
        displayName
        objectType
        queryable
        updateable
        fields {
          externalFieldName
          displayName
          dataType
          required
          custom
          readable
          writable
          referenceObject
          options
        }
        relationships {
          sourceFieldName
          targetObjectName
          relationshipType
        }
      }
    }
  }
`;

export const GET_CRM_MAPPINGS = gql`
  query GetCRMMappings($provider: CRMProvider!) {
    getCRMMappings(provider: $provider) {
      version
      mappings {
        sourceObject
        sourceField
        targetType
        targetField
        transformConfig
        syncDirection
        enabled
      }
    }
  }
`;

export const GET_CRM_SUGGESTED_MAPPINGS = gql`
  query GetCRMSuggestedMappings($provider: CRMProvider!, $sourceObjectName: String) {
    getCRMSuggestedMappings(provider: $provider, sourceObjectName: $sourceObjectName) {
      sourceObject
      sourceField
      targetType
      targetField
      transformConfig
      syncDirection
      enabled
    }
  }
`;

export const GET_CRM_COMMUNITY_RULES = gql`
  query GetCRMCommunityRules($provider: CRMProvider) {
    getCRMCommunityRules(provider: $provider) {
      id
      entityId
      provider
      name
      sourceField
      operator
      matchValue
      communityId
      isActive
      createdAt
      updatedAt
    }
  }
`;

// ==========================================
// GRAPHQL MUTATIONS
// ==========================================

export const CONNECT_CRM_PROVIDER = gql`
  mutation ConnectCRMProvider($input: ConnectCRMProviderInput!) {
    connectCRMProvider(input: $input) {
      success
      message
      authUrl
      mode
      connection {
        id
        entityId
        provider
        tenantName
        baseUrl
        databaseName
        authType
        status
        autoSyncEnabled
        syncScheduleCron
        deactivateOnDelete
        lastSchemaSyncAt
        lastSyncAt
        lastSyncStatus
        lastErrorMessage
        installedAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const TEST_CRM_CONNECTION = gql`
  mutation TestCRMConnection($input: TestCRMConnectionInput!) {
    testCRMConnection(input: $input) {
      success
      provider
      message
    }
  }
`;

export const DISCONNECT_CRM_PROVIDER = gql`
  mutation DisconnectCRMProvider($provider: CRMProvider!) {
    disconnectCRMProvider(provider: $provider)
  }
`;

export const TRIGGER_CRM_SYNC = gql`
  mutation TriggerCRMSync($provider: CRMProvider!, $syncType: CRMSyncType, $async: Boolean) {
    triggerCRMSync(provider: $provider, syncType: $syncType, async: $async) {
      success
      syncId
      message
    }
  }
`;

export const UPDATE_CRM_CONFIG = gql`
  mutation UpdateCRMConfig($input: UpdateCRMConfigInput!) {
    updateCRMConfig(input: $input) {
      id
      entityId
      provider
      tenantName
      baseUrl
      databaseName
      authType
      status
      autoSyncEnabled
      syncScheduleCron
      deactivateOnDelete
      lastSchemaSyncAt
      lastSyncAt
      lastSyncStatus
      lastErrorMessage
      installedAt
      createdAt
      updatedAt
    }
  }
`;

export const DISCOVER_CRM_SCHEMA = gql`
  mutation DiscoverCRMSchema($provider: CRMProvider!, $objectNames: [String!]) {
    discoverCRMSchema(provider: $provider, objectNames: $objectNames) {
      connectionId
      provider
      lastSchemaSyncAt
      objects {
        id
        externalObjectName
        displayName
        objectType
        queryable
        updateable
        fields {
          externalFieldName
          displayName
          dataType
          required
          custom
          readable
          writable
          referenceObject
          options
        }
        relationships {
          sourceFieldName
          targetObjectName
          relationshipType
        }
      }
    }
  }
`;

export const SAVE_CRM_MAPPINGS = gql`
  mutation SaveCRMMappings($provider: CRMProvider!, $mappings: [CRMFieldMappingInput!]!) {
    saveCRMMappings(provider: $provider, mappings: $mappings) {
      versionId
      version
      mappingCount
    }
  }
`;

export const PREVIEW_CRM_MAPPING = gql`
  mutation PreviewCRMMapping(
    $provider: CRMProvider!
    $sourceObjectName: String!
    $mappings: [CRMFieldMappingInput!]!
    $sampleRecordId: String
  ) {
    previewCRMMapping(
      provider: $provider
      sourceObjectName: $sourceObjectName
      mappings: $mappings
      sampleRecordId: $sampleRecordId
    ) {
      rawRecord
      normalizedRecord
      isValid
      validationErrors
    }
  }
`;

export const UPSERT_CRM_COMMUNITY_RULE = gql`
  mutation UpsertCRMCommunityRule($input: UpsertCRMCommunityRuleInput!) {
    upsertCRMCommunityRule(input: $input) {
      id
      entityId
      provider
      name
      sourceField
      operator
      matchValue
      communityId
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CRM_COMMUNITY_RULE = gql`
  mutation DeleteCRMCommunityRule($id: ID!) {
    deleteCRMCommunityRule(id: $id)
  }
`;

// ==========================================
// REACT HOOKS
// ==========================================

export const useGetCRMProviders = (options?: any) =>
  useQuery<{ getCRMProviders: CRMProviderMeta[] }>(GET_CRM_PROVIDERS, options);

export const useGetCRMConnections = (options?: any) =>
  useQuery<{ getCRMConnections: CRMConnection[] }>(GET_CRM_CONNECTIONS, options);

export const useGetCRMConnection = (
  variables: { provider: CRMProvider | string },
  options?: any
) =>
  useQuery<{ getCRMConnection: CRMConnection }>(GET_CRM_CONNECTION, {
    variables,
    ...options,
  });

export const useGetCRMMembers = (
  variables?: { provider?: CRMProvider | string; input?: CRMMemberPaginationInput },
  options?: any
) =>
  useQuery<{ getCRMMembers: PaginatedCRMMembers }>(GET_CRM_MEMBERS, {
    variables,
    ...options,
  });

export const useGetCRMSyncLogs = (
  variables?: { provider?: CRMProvider | string; input?: CRMSyncLogPaginationInput },
  options?: any
) =>
  useQuery<{ getCRMSyncLogs: PaginatedCRMSyncLogs }>(GET_CRM_SYNC_LOGS, {
    variables,
    ...options,
  });

export const useGetCRMHubStats = (options?: any) =>
  useQuery<{ getCRMHubStats: CRMHubStats }>(GET_CRM_HUB_STATS, options);

export const useGetCRMSchema = (
  variables: { provider: CRMProvider | string },
  options?: any
) =>
  useQuery<{ getCRMSchema: CRMSchemaResult }>(GET_CRM_SCHEMA, {
    variables,
    ...options,
  });

export const useGetCRMMappings = (
  variables: { provider: CRMProvider | string },
  options?: any
) =>
  useQuery<{ getCRMMappings: CRMMappingsResult }>(GET_CRM_MAPPINGS, {
    variables,
    ...options,
  });

export const useGetCRMSuggestedMappings = (
  variables: { provider: CRMProvider | string; sourceObjectName?: string },
  options?: any
) =>
  useQuery<{ getCRMSuggestedMappings: CRMFieldMapping[] }>(GET_CRM_SUGGESTED_MAPPINGS, {
    variables,
    ...options,
  });

export const useLazyGetCRMSuggestedMappings = (options?: any) =>
  useLazyQuery<{ getCRMSuggestedMappings: CRMFieldMapping[] }>(
    GET_CRM_SUGGESTED_MAPPINGS,
    options
  );


export const useGetCRMCommunityRules = (
  variables?: { provider?: CRMProvider | string },
  options?: any
) =>
  useQuery<{ getCRMCommunityRules: CRMCommunityRule[] }>(GET_CRM_COMMUNITY_RULES, {
    variables,
    ...options,
  });

export const useConnectCRMProvider = () => useMutation(CONNECT_CRM_PROVIDER);
export const useTestCRMConnection = () => useMutation(TEST_CRM_CONNECTION);
export const useDisconnectCRMProvider = () => useMutation(DISCONNECT_CRM_PROVIDER);
export const useTriggerCRMSync = () => useMutation(TRIGGER_CRM_SYNC);
export const useUpdateCRMConfig = () => useMutation(UPDATE_CRM_CONFIG);
export const useDiscoverCRMSchema = () => useMutation(DISCOVER_CRM_SCHEMA);
export const useSaveCRMMappings = () => useMutation(SAVE_CRM_MAPPINGS);
export const usePreviewCRMMapping = () => useMutation(PREVIEW_CRM_MAPPING);
export const useUpsertCRMCommunityRule = () => useMutation(UPSERT_CRM_COMMUNITY_RULE);
export const useDeleteCRMCommunityRule = () => useMutation(DELETE_CRM_COMMUNITY_RULE);
