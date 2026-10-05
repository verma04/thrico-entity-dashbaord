import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
} from "@apollo/client";
import {
  GET_ENTERPRISE_CLIENT,
  GET_ENTERPRISE_LEADERBOARDS,
  GET_ENTERPRISE_LEADERBOARD,
  UPDATE_ENTERPRISE_CLIENT,
  REGENERATE_ENTERPRISE_CLIENT_SECRET,
  CREATE_ENTERPRISE_LEADERBOARD,
  UPDATE_ENTERPRISE_LEADERBOARD,
  DELETE_ENTERPRISE_LEADERBOARD,
  GetEnterpriseClientResponse,
  GetEnterpriseLeaderboardsResponse,
  GetEnterpriseLeaderboardResponse,
  UpdateEnterpriseClientResponse,
  UpdateEnterpriseClientInput,
  RegenerateEnterpriseClientSecretResponse,
  CreateEnterpriseLeaderboardResponse,
  CreateEnterpriseLeaderboardInput,
  UpdateEnterpriseLeaderboardResponse,
  UpdateEnterpriseLeaderboardInput,
  DeleteEnterpriseLeaderboardResponse,
} from "../quries/enterprise-leaderboard";

export * from "../quries/enterprise-leaderboard";

// ============================================
// QUERY HOOKS
// ============================================

export const useGetEnterpriseClient = (
  options?: QueryHookOptions<GetEnterpriseClientResponse>
) => {
  return useQuery<GetEnterpriseClientResponse>(
    GET_ENTERPRISE_CLIENT,
    options
  );
};

export const useGetEnterpriseLeaderboards = (
  options?: QueryHookOptions<GetEnterpriseLeaderboardsResponse>
) => {
  return useQuery<GetEnterpriseLeaderboardsResponse>(
    GET_ENTERPRISE_LEADERBOARDS,
    options
  );
};

export const useGetEnterpriseLeaderboard = (
  options?: QueryHookOptions<
    GetEnterpriseLeaderboardResponse,
    { id?: string; code?: string }
  >
) => {
  return useQuery<
    GetEnterpriseLeaderboardResponse,
    { id?: string; code?: string }
  >(GET_ENTERPRISE_LEADERBOARD, options);
};

// ============================================
// MUTATION HOOKS
// ============================================

export const useUpdateEnterpriseClient = (
  options?: MutationHookOptions<
    UpdateEnterpriseClientResponse,
    { input: UpdateEnterpriseClientInput }
  >
) => {
  return useMutation<
    UpdateEnterpriseClientResponse,
    { input: UpdateEnterpriseClientInput }
  >(UPDATE_ENTERPRISE_CLIENT, {
    refetchQueries: [{ query: GET_ENTERPRISE_CLIENT }],
    ...options,
  });
};

export const useRegenerateEnterpriseClientSecret = (
  options?: MutationHookOptions<RegenerateEnterpriseClientSecretResponse>
) => {
  return useMutation<RegenerateEnterpriseClientSecretResponse>(
    REGENERATE_ENTERPRISE_CLIENT_SECRET,
    {
      refetchQueries: [{ query: GET_ENTERPRISE_CLIENT }],
      ...options,
    }
  );
};

export const useCreateEnterpriseLeaderboard = (
  options?: MutationHookOptions<
    CreateEnterpriseLeaderboardResponse,
    { input: CreateEnterpriseLeaderboardInput }
  >
) => {
  return useMutation<
    CreateEnterpriseLeaderboardResponse,
    { input: CreateEnterpriseLeaderboardInput }
  >(CREATE_ENTERPRISE_LEADERBOARD, {
    refetchQueries: [{ query: GET_ENTERPRISE_LEADERBOARDS }],
    ...options,
  });
};

export const useUpdateEnterpriseLeaderboard = (
  options?: MutationHookOptions<
    UpdateEnterpriseLeaderboardResponse,
    { id: string; input: UpdateEnterpriseLeaderboardInput }
  >
) => {
  return useMutation<
    UpdateEnterpriseLeaderboardResponse,
    { id: string; input: UpdateEnterpriseLeaderboardInput }
  >(UPDATE_ENTERPRISE_LEADERBOARD, {
    refetchQueries: [{ query: GET_ENTERPRISE_LEADERBOARDS }],
    ...options,
  });
};

export const useDeleteEnterpriseLeaderboard = (
  options?: MutationHookOptions<
    DeleteEnterpriseLeaderboardResponse,
    { id: string }
  >
) => {
  return useMutation<
    DeleteEnterpriseLeaderboardResponse,
    { id: string }
  >(DELETE_ENTERPRISE_LEADERBOARD, {
    refetchQueries: [{ query: GET_ENTERPRISE_LEADERBOARDS }],
    ...options,
  });
};
