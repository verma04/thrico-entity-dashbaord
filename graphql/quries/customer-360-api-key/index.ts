import { gql } from "@apollo/client";

// ============================================
// QUERIES
// ============================================

export const GET_CUSTOMER_360_API_KEY = gql`
  query GetCustomer360ApiKey {
    getCustomer360ApiKey {
      id
      entityId
      apiKey
      name
      isActive
      allowedModules
      modules {
        module
        name
        description
        enabled
      }
      lastUsedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_AVAILABLE_CUSTOMER_360_MODULES = gql`
  query GetAvailableCustomer360Modules {
    getAvailableCustomer360Modules {
      module
      name
      description
      enabled
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_CUSTOMER_360_API_KEY = gql`
  mutation CreateCustomer360ApiKey($input: CreateCustomer360ApiKeyInput) {
    createCustomer360ApiKey(input: $input) {
      id
      entityId
      apiKey
      name
      isActive
      allowedModules
      modules {
        module
        name
        description
        enabled
      }
      lastUsedAt
      createdAt
      updatedAt
    }
  }
`;

export const REGENERATE_CUSTOMER_360_API_KEY = gql`
  mutation RegenerateCustomer360ApiKey {
    regenerateCustomer360ApiKey {
      id
      entityId
      apiKey
      name
      isActive
      allowedModules
      modules {
        module
        name
        description
        enabled
      }
      lastUsedAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CUSTOMER_360_API_KEY = gql`
  mutation UpdateCustomer360ApiKey($input: UpdateCustomer360ApiKeyInput!) {
    updateCustomer360ApiKey(input: $input) {
      id
      entityId
      apiKey
      name
      isActive
      allowedModules
      modules {
        module
        name
        description
        enabled
      }
      lastUsedAt
      createdAt
      updatedAt
    }
  }
`;

export const TOGGLE_CUSTOMER_360_API_KEY_MODULE = gql`
  mutation ToggleCustomer360ApiKeyModule($input: ToggleCustomer360ApiKeyModuleInput!) {
    toggleCustomer360ApiKeyModule(input: $input) {
      id
      entityId
      apiKey
      name
      isActive
      allowedModules
      modules {
        module
        name
        description
        enabled
      }
      lastUsedAt
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CUSTOMER_360_API_KEY = gql`
  mutation DeleteCustomer360ApiKey {
    deleteCustomer360ApiKey
  }
`;

// ============================================
// TYPES
// ============================================

export interface Customer360ApiKeyModule {
  module: string;
  name: string;
  description?: string | null;
  enabled: boolean;
}

export interface Customer360ApiKey {
  id: string;
  entityId: string;
  apiKey: string;
  name: string;
  isActive: boolean;
  allowedModules: string[];
  modules: Customer360ApiKeyModule[];
  lastUsedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer360ApiKeyModuleInput {
  module: string;
  enabled: boolean;
}

export interface CreateCustomer360ApiKeyInput {
  name?: string | null;
  allowedModules?: string[] | null;
  modules?: Customer360ApiKeyModuleInput[] | null;
  isActive?: boolean | null;
}

export interface UpdateCustomer360ApiKeyInput {
  name?: string | null;
  allowedModules?: string[] | null;
  modules?: Customer360ApiKeyModuleInput[] | null;
  isActive?: boolean | null;
}

export interface ToggleCustomer360ApiKeyModuleInput {
  module: string;
  enabled: boolean;
}

export interface GetCustomer360ApiKeyResponse {
  getCustomer360ApiKey: Customer360ApiKey | null;
}

export interface GetAvailableCustomer360ModulesResponse {
  getAvailableCustomer360Modules: Customer360ApiKeyModule[];
}

export interface CreateCustomer360ApiKeyResponse {
  createCustomer360ApiKey: Customer360ApiKey;
}

export interface RegenerateCustomer360ApiKeyResponse {
  regenerateCustomer360ApiKey: Customer360ApiKey;
}

export interface UpdateCustomer360ApiKeyResponse {
  updateCustomer360ApiKey: Customer360ApiKey;
}

export interface ToggleCustomer360ApiKeyModuleResponse {
  toggleCustomer360ApiKeyModule: Customer360ApiKey;
}

export interface DeleteCustomer360ApiKeyResponse {
  deleteCustomer360ApiKey: boolean;
}
