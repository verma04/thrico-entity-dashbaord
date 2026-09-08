import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
} from "@apollo/client";
import {
  GET_CUSTOMER_360_API_KEY,
  GET_AVAILABLE_CUSTOMER_360_MODULES,
  CREATE_CUSTOMER_360_API_KEY,
  REGENERATE_CUSTOMER_360_API_KEY,
  UPDATE_CUSTOMER_360_API_KEY,
  TOGGLE_CUSTOMER_360_API_KEY_MODULE,
  DELETE_CUSTOMER_360_API_KEY,
  GetCustomer360ApiKeyResponse,
  GetAvailableCustomer360ModulesResponse,
  CreateCustomer360ApiKeyResponse,
  CreateCustomer360ApiKeyInput,
  RegenerateCustomer360ApiKeyResponse,
  UpdateCustomer360ApiKeyResponse,
  UpdateCustomer360ApiKeyInput,
  ToggleCustomer360ApiKeyModuleResponse,
  ToggleCustomer360ApiKeyModuleInput,
  DeleteCustomer360ApiKeyResponse,
} from "../quries/customer-360-api-key";

export * from "../quries/customer-360-api-key";

// ============================================
// QUERY HOOKS
// ============================================

export const useGetCustomer360ApiKey = (
  options?: QueryHookOptions<GetCustomer360ApiKeyResponse>
) => {
  return useQuery<GetCustomer360ApiKeyResponse>(
    GET_CUSTOMER_360_API_KEY,
    options
  );
};

export const useGetAvailableCustomer360Modules = (
  options?: QueryHookOptions<GetAvailableCustomer360ModulesResponse>
) => {
  return useQuery<GetAvailableCustomer360ModulesResponse>(
    GET_AVAILABLE_CUSTOMER_360_MODULES,
    options
  );
};

// ============================================
// MUTATION HOOKS
// ============================================

export const useCreateCustomer360ApiKey = (
  options?: MutationHookOptions<
    CreateCustomer360ApiKeyResponse,
    { input?: CreateCustomer360ApiKeyInput }
  >
) => {
  return useMutation<
    CreateCustomer360ApiKeyResponse,
    { input?: CreateCustomer360ApiKeyInput }
  >(CREATE_CUSTOMER_360_API_KEY, {
    refetchQueries: [{ query: GET_CUSTOMER_360_API_KEY }],
    ...options,
  });
};

export const useRegenerateCustomer360ApiKey = (
  options?: MutationHookOptions<RegenerateCustomer360ApiKeyResponse>
) => {
  return useMutation<RegenerateCustomer360ApiKeyResponse>(
    REGENERATE_CUSTOMER_360_API_KEY,
    {
      refetchQueries: [{ query: GET_CUSTOMER_360_API_KEY }],
      ...options,
    }
  );
};

export const useUpdateCustomer360ApiKey = (
  options?: MutationHookOptions<
    UpdateCustomer360ApiKeyResponse,
    { input: UpdateCustomer360ApiKeyInput }
  >
) => {
  return useMutation<
    UpdateCustomer360ApiKeyResponse,
    { input: UpdateCustomer360ApiKeyInput }
  >(UPDATE_CUSTOMER_360_API_KEY, {
    refetchQueries: [{ query: GET_CUSTOMER_360_API_KEY }],
    ...options,
  });
};

export const useToggleCustomer360ApiKeyModule = (
  options?: MutationHookOptions<
    ToggleCustomer360ApiKeyModuleResponse,
    { input: ToggleCustomer360ApiKeyModuleInput }
  >
) => {
  return useMutation<
    ToggleCustomer360ApiKeyModuleResponse,
    { input: ToggleCustomer360ApiKeyModuleInput }
  >(TOGGLE_CUSTOMER_360_API_KEY_MODULE, {
    refetchQueries: [{ query: GET_CUSTOMER_360_API_KEY }],
    ...options,
  });
};

export const useDeleteCustomer360ApiKey = (
  options?: MutationHookOptions<DeleteCustomer360ApiKeyResponse>
) => {
  return useMutation<DeleteCustomer360ApiKeyResponse>(
    DELETE_CUSTOMER_360_API_KEY,
    {
      refetchQueries: [{ query: GET_CUSTOMER_360_API_KEY }],
      ...options,
    }
  );
};
