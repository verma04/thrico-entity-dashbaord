import { gql, QueryHookOptions, useQuery, useMutation, MutationHookOptions } from "@apollo/client";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

export interface Industry {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------
// GET INDUSTRIES
// ---------------------------------------------------------

export interface GetIndustriesData {
  getIndustries: Industry[];
}

export interface GetIndustriesVars {
  search?: string;
  limit?: number;
  offset?: number;
}

export const GET_INDUSTRIES = gql`
  query GetIndustries($search: String, $limit: Int, $offset: Int) {
    getIndustries(search: $search, limit: $limit, offset: $offset) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useGetIndustries(options?: QueryHookOptions<GetIndustriesData, GetIndustriesVars>) {
  return useQuery<GetIndustriesData, GetIndustriesVars>(GET_INDUSTRIES, options);
}

// ---------------------------------------------------------
// ADD INDUSTRY
// ---------------------------------------------------------

export interface AddIndustryInput {
  title: string;
}

export interface AddIndustryResponse {
  addIndustry: Industry;
}

export const ADD_INDUSTRY = gql`
  mutation AddIndustry($input: AddIndustryInput!) {
    addIndustry(input: $input) {
      id
      title
      createdAt
    }
  }
`;

export function useAddIndustry(
  options?: MutationHookOptions<AddIndustryResponse, { input: AddIndustryInput }>,
) {
  return useMutation<AddIndustryResponse, { input: AddIndustryInput }>(
    ADD_INDUSTRY,
    options,
  );
}

// ---------------------------------------------------------
// UPDATE INDUSTRY
// ---------------------------------------------------------

export interface UpdateIndustryInput {
  id: string;
  title: string;
}

export interface UpdateIndustryResponse {
  updateIndustry: Industry;
}

export const UPDATE_INDUSTRY = gql`
  mutation UpdateIndustry($input: UpdateIndustryInput!) {
    updateIndustry(input: $input) {
      id
      title
      updatedAt
    }
  }
`;

export function useUpdateIndustry(
  options?: MutationHookOptions<UpdateIndustryResponse, { input: UpdateIndustryInput }>,
) {
  return useMutation<UpdateIndustryResponse, { input: UpdateIndustryInput }>(
    UPDATE_INDUSTRY,
    options,
  );
}

// ---------------------------------------------------------
// DELETE INDUSTRY
// ---------------------------------------------------------

export interface DeleteIndustryInput {
  id: string;
}

export interface DeleteIndustryResponse {
  deleteIndustry: Industry;
}

export const DELETE_INDUSTRY = gql`
  mutation DeleteIndustry($input: DeleteIndustryInput!) {
    deleteIndustry(input: $input) {
      id
      title
    }
  }
`;

export function useDeleteIndustry(
  options?: MutationHookOptions<DeleteIndustryResponse, { input: DeleteIndustryInput }>,
) {
  return useMutation<DeleteIndustryResponse, { input: DeleteIndustryInput }>(
    DELETE_INDUSTRY,
    options,
  );
}

// ---------------------------------------------------------
// BULK ADD INDUSTRIES
// ---------------------------------------------------------

export interface BulkAddIndustryInput {
  titles: string[];
}

export interface BulkAddIndustryResponse {
  bulkAddIndustries: Industry[];
}

export const BULK_ADD_INDUSTRIES = gql`
  mutation BulkAddIndustries($input: BulkAddIndustryInput!) {
    bulkAddIndustries(input: $input) {
      id
      title
    }
  }
`;

export function useBulkAddIndustries(
  options?: MutationHookOptions<BulkAddIndustryResponse, { input: BulkAddIndustryInput }>,
) {
  return useMutation<BulkAddIndustryResponse, { input: BulkAddIndustryInput }>(
    BULK_ADD_INDUSTRIES,
    options,
  );
}

// ---------------------------------------------------------
// GET USERS BY INDUSTRY
// ---------------------------------------------------------

export interface IndustryUser {
  id: string;
  globalUserId: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  headline: string | null;
}

export interface GetUsersByIndustryResponse {
  getUsersByIndustryNeo4j: {
    data: IndustryUser[];
    totalCount: number;
    hasNextPage: boolean;
    cursor: string | null;
  };
}

export interface GetUsersByIndustryVars {
  industryId: string;
  limit?: number;
  cursor?: string;
}

export const GET_USERS_BY_INDUSTRY_NEO4J = gql`
  query GetUsersByIndustryNeo4j($industryId: ID!, $limit: Int, $cursor: String) {
    getUsersByIndustryNeo4j(industryId: $industryId, limit: $limit, cursor: $cursor) {
      data {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      totalCount
      hasNextPage
      cursor
    }
  }
`;

export function useGetUsersByIndustryNeo4j(
  options?: QueryHookOptions<GetUsersByIndustryResponse, GetUsersByIndustryVars>,
) {
  return useQuery<GetUsersByIndustryResponse, GetUsersByIndustryVars>(
    GET_USERS_BY_INDUSTRY_NEO4J,
    options,
  );
}

// ---------------------------------------------------------
// GET USER INDUSTRIES GRAPH
// ---------------------------------------------------------

export interface IndustryGraphUser {
  id: string;
  globalUserId: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  headline: string | null;
}

export interface IndustryGraphIndustry {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserIndustryEdge {
  user: IndustryGraphUser;
  industry: IndustryGraphIndustry;
}

export interface GetUserIndustriesGraphData {
  getUserIndustriesGraph: UserIndustryEdge[];
}

export interface GetUserIndustriesGraphVars {
  limit?: number;
}

export const GET_USER_INDUSTRIES_GRAPH = gql`
  query GetUserIndustriesGraph($limit: Int) {
    getUserIndustriesGraph(limit: $limit) {
      user {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      industry {
        id
        title
        createdAt
        updatedAt
      }
    }
  }
`;

export function useGetUserIndustriesGraph(
  options?: QueryHookOptions<GetUserIndustriesGraphData, GetUserIndustriesGraphVars>,
) {
  return useQuery<GetUserIndustriesGraphData, GetUserIndustriesGraphVars>(
    GET_USER_INDUSTRIES_GRAPH,
    options,
  );
}
