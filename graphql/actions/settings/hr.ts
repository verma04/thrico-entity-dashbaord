import { gql, useMutation, useQuery } from "@apollo/client";

// Enums and Types based on Guide
export enum HRProvider {
  WORKDAY = "WORKDAY",
  SAP_SUCCESSFACTORS = "SAP_SUCCESSFACTORS",
  ORACLE_HCM = "ORACLE_HCM",
  DARWINBOX = "DARWINBOX",
  PEOPLESTRONG = "PEOPLESTRONG",
  GREYTHR = "GREYTHR",
  KEKA = "KEKA",
}

export interface HRProviderMetaConfig {
  provider: HRProvider;
  name: string;
  category: "Global Enterprise" | "India / APAC";
  color: string;
  description: string;
  requiresTenant: boolean;
  tenantLabel?: string;
  urlPlaceholder: string;
  hint: string;
}

export const HR_PROVIDERS_CONFIG: Record<string, HRProviderMetaConfig> = {
  [HRProvider.WORKDAY]: {
    provider: HRProvider.WORKDAY,
    name: "Workday",
    category: "Global Enterprise",
    color: "#0875E1",
    description: "Sync employees, supervisory orgs, locations, and worker lifecycle from Workday.",
    requiresTenant: true,
    tenantLabel: "Workday Tenant Name",
    urlPlaceholder: "https://wd2-impl-services1.workday.com",
    hint: "Workday Admin → Security → API Clients → Register API Client with Worker Read permissions.",
  },
  [HRProvider.SAP_SUCCESSFACTORS]: {
    provider: HRProvider.SAP_SUCCESSFACTORS,
    name: "SAP SuccessFactors",
    category: "Global Enterprise",
    color: "#0070F2",
    description: "Extract Employee Central worker directory, divisions, and positions via OData API.",
    requiresTenant: true,
    tenantLabel: "Company ID (Tenant)",
    urlPlaceholder: "https://api12preview.sapsf.com",
    hint: "Admin Center → Manage OAuth2 Client Applications → Register Client.",
  },
  [HRProvider.ORACLE_HCM]: {
    provider: HRProvider.ORACLE_HCM,
    name: "Oracle Cloud HCM",
    category: "Global Enterprise",
    color: "#F80000",
    description: "Replicate worker identities, assignments, and departments from Oracle Fusion HCM.",
    requiresTenant: false,
    urlPlaceholder: "https://fa-xxxx-saasfaprod1.fa.ocs.oraclecloud.com",
    hint: "Oracle Cloud Console → Security Console → API Access Management.",
  },
  [HRProvider.DARWINBOX]: {
    provider: HRProvider.DARWINBOX,
    name: "Darwinbox",
    category: "India / APAC",
    color: "#FF5722",
    description: "Sync employee master data, designations, and branches from Darwinbox.",
    requiresTenant: false,
    urlPlaceholder: "https://mycompany.darwinbox.in",
    hint: "Darwinbox Admin → Integrations → API Settings → Generate API Token.",
  },
  [HRProvider.PEOPLESTRONG]: {
    provider: HRProvider.PEOPLESTRONG,
    name: "PeopleStrong",
    category: "India / APAC",
    color: "#2B59FF",
    description: "Automate employee onboarding and worksite community assignment from PeopleStrong.",
    requiresTenant: false,
    urlPlaceholder: "https://myorg.peoplestrong.com",
    hint: "PeopleStrong Admin → Developer Settings → Outbound API Directory.",
  },
  [HRProvider.GREYTHR]: {
    provider: HRProvider.GREYTHR,
    name: "greytHR",
    category: "India / APAC",
    color: "#4CAF50",
    description: "Connect greytHR to import team members, departments, and joining milestones.",
    requiresTenant: false,
    urlPlaceholder: "https://mycompany.greythr.com",
    hint: "greytHR Portal → System Settings → Integrations → API Keys.",
  },
  [HRProvider.KEKA]: {
    provider: HRProvider.KEKA,
    name: "Keka",
    category: "India / APAC",
    color: "#8E24AA",
    description: "Live real-time employee syncing and webhooks from Keka Core HR.",
    requiresTenant: false,
    urlPlaceholder: "https://mycompany.keka.com",
    hint: "Keka Admin → Settings → Integrations → API & Webhooks → Generate API Key.",
  },
};

export enum HRSyncType {
  INITIAL = "INITIAL",
  SCHEDULED = "SCHEDULED",
  MANUAL = "MANUAL",
  WEBHOOK = "WEBHOOK",
}

export enum HRConnectionStatus {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

export enum HRSyncStatus {
  SUCCESS = "SUCCESS",
  PARTIAL_SUCCESS = "PARTIAL_SUCCESS",
  FAILED = "FAILED",
}

export enum HREmploymentStatus {
  ACTIVE = "ACTIVE",
  TERMINATED = "TERMINATED",
  ON_LEAVE = "ON_LEAVE",
}

// Interfaces
export interface HRConnection {
  id: string;
  provider: HRProvider;
  status: HRConnectionStatus;
  baseUrl: string;
  tenantName: string;
  lastSyncAt?: string;
  lastSyncStatus?: HRSyncStatus;
}

export interface TestHRConnectionInput {
  provider: HRProvider;
  baseUrl: string;
  tenantName: string;
  clientId: string;
  clientSecret: string;
  authType?: string;
}

export interface ConnectHRProviderInput {
  provider: HRProvider;
  baseUrl: string;
  tenantName: string;
  clientId: string;
  clientSecret: string;
  autoSyncEnabled?: boolean;
  autoGroupDepartment?: boolean;
  autoGroupLocation?: boolean;
  deactivateOnTermination?: boolean;
}

export interface HREmployeePaginationInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: HREmploymentStatus;
}

export interface HRSyncLogPaginationInput {
  page?: number;
  limit?: number;
}

// Queries
export const GET_HR_PROVIDERS = gql`
  query GetHRProviders {
    getHRProviders {
      provider
      name
      category
      supportsWebhooks
    }
  }
`;

export const GET_HR_CONNECTIONS = gql`
  query GetHRConnections {
    getHRConnections {
      id
      provider
      status
      baseUrl
      tenantName
      lastSyncAt
      lastSyncStatus
    }
  }
`;

export const GET_HR_CONNECTION = gql`
  query GetHRConnection($provider: HRProvider!) {
    getHRConnection(provider: $provider) {
      id
      provider
      status
      baseUrl
      tenantName
      lastSyncAt
      lastSyncStatus
    }
  }
`;

export const GET_HR_EMPLOYEES = gql`
  query GetHREmployees($provider: HRProvider, $input: HREmployeePaginationInput) {
    getHREmployees(provider: $provider, input: $input) {
      employees {
        id
        externalEmployeeId
        firstName
        lastName
        email
        jobTitle
        department
        location
        company
        employmentStatus
        lastSyncedAt
      }
      totalCount
      page
      limit
      totalPages
    }
  }
`;

export const GET_HR_SYNC_LOGS = gql`
  query GetHRSyncLogs($provider: HRProvider, $input: HRSyncLogPaginationInput) {
    getHRSyncLogs(provider: $provider, input: $input) {
      logs {
        id
        provider
        syncType
        status
        totalWorkersFetched
        createdMembersCount
        updatedMembersCount
        deactivatedMembersCount
        failedCount
        startedAt
        completedAt
        details {
          externalEmployeeId
          email
          error
        }
      }
      totalCount
      page
      totalPages
    }
  }
`;

export const GET_HR_HUB_STATS = gql`
  query GetHRHubStats {
    getHRHubStats {
      totalEmployees
      activeConnections
      syncStatusOverview
    }
  }
`;

// Mutations
export const TEST_HR_CONNECTION = gql`
  mutation TestHRConnection($input: TestHRConnectionInput!) {
    testHRConnection(input: $input) {
      success
      provider
      message
    }
  }
`;

export const CONNECT_HR_PROVIDER = gql`
  mutation ConnectHRProvider($input: ConnectHRProviderInput!) {
    connectHRProvider(input: $input)
  }
`;

export const TRIGGER_HR_SYNC = gql`
  mutation TriggerHRSync($provider: HRProvider!, $syncType: HRSyncType) {
    triggerHRSync(provider: $provider, syncType: $syncType) {
      success
      syncLogId
      message
    }
  }
`;

export const DISCONNECT_HR_PROVIDER = gql`
  mutation DisconnectHRProvider($provider: HRProvider!) {
    disconnectHRProvider(provider: $provider)
  }
`;

// Hooks
export const useGetHRProviders = (options?: any) =>
  useQuery(GET_HR_PROVIDERS, options);

export const useGetHRConnections = (options?: any) =>
  useQuery<{ getHRConnections: HRConnection[] }>(GET_HR_CONNECTIONS, options);

export const useGetHRConnection = (
  variables: { provider: HRProvider | string },
  options?: any
) => useQuery<{ getHRConnection: HRConnection }>(GET_HR_CONNECTION, { variables, ...options });

export const useTestHRConnection = () => useMutation(TEST_HR_CONNECTION);

export const useConnectHRProvider = () => useMutation(CONNECT_HR_PROVIDER);

export const useTriggerHRSync = () => useMutation(TRIGGER_HR_SYNC);

export const useDisconnectHRProvider = () => useMutation(DISCONNECT_HR_PROVIDER);

export const useGetHREmployees = (
  variables?: { provider?: HRProvider | string; input?: HREmployeePaginationInput },
  options?: any
) => useQuery(GET_HR_EMPLOYEES, { variables, ...options });

export const useGetHRSyncLogs = (
  variables?: { provider?: HRProvider | string; input?: HRSyncLogPaginationInput },
  options?: any
) => useQuery(GET_HR_SYNC_LOGS, { variables, ...options });

export const useGetHRHubStats = (options?: any) => useQuery(GET_HR_HUB_STATS, options);
