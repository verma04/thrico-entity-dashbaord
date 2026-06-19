import { gql, QueryHookOptions, useQuery, useMutation, MutationHookOptions } from "@apollo/client";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

export interface Interest {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------
// GET INTERESTS
// ---------------------------------------------------------

export interface GetInterestsData {
  getInterests: Interest[];
}

export interface GetInterestsVars {
  search?: string;
  limit?: number;
  offset?: number;
}

export const GET_INTERESTS = gql`
  query GetInterests($search: String, $limit: Int, $offset: Int) {
    getInterests(search: $search, limit: $limit, offset: $offset) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useGetInterests(options?: QueryHookOptions<GetInterestsData, GetInterestsVars>) {
  return useQuery<GetInterestsData, GetInterestsVars>(GET_INTERESTS, options);
}

// ---------------------------------------------------------
// ADD INTEREST
// ---------------------------------------------------------

export interface AddInterestInput {
  title: string;
}

export interface AddInterestResponse {
  addInterest: Interest;
}

export const ADD_INTEREST = gql`
  mutation AddInterest($input: AddInterestInput!) {
    addInterest(input: $input) {
      id
      title
      createdAt
    }
  }
`;

export function useAddInterest(
  options?: MutationHookOptions<AddInterestResponse, { input: AddInterestInput }>,
) {
  return useMutation<AddInterestResponse, { input: AddInterestInput }>(
    ADD_INTEREST,
    options,
  );
}

// ---------------------------------------------------------
// UPDATE INTEREST
// ---------------------------------------------------------

export interface UpdateInterestInput {
  id: string;
  title: string;
}

export interface UpdateInterestResponse {
  updateInterest: Interest;
}

export const UPDATE_INTEREST = gql`
  mutation UpdateInterest($input: UpdateInterestInput!) {
    updateInterest(input: $input) {
      id
      title
      updatedAt
    }
  }
`;

export function useUpdateInterest(
  options?: MutationHookOptions<UpdateInterestResponse, { input: UpdateInterestInput }>,
) {
  return useMutation<UpdateInterestResponse, { input: UpdateInterestInput }>(
    UPDATE_INTEREST,
    options,
  );
}

// ---------------------------------------------------------
// DELETE INTEREST
// ---------------------------------------------------------

export interface DeleteInterestInput {
  id: string;
}

export interface DeleteInterestResponse {
  deleteInterest: Interest;
}

export const DELETE_INTEREST = gql`
  mutation DeleteInterest($input: DeleteInterestInput!) {
    deleteInterest(input: $input) {
      id
      title
    }
  }
`;

export function useDeleteInterest(
  options?: MutationHookOptions<DeleteInterestResponse, { input: DeleteInterestInput }>,
) {
  return useMutation<DeleteInterestResponse, { input: DeleteInterestInput }>(
    DELETE_INTEREST,
    options,
  );
}

// ---------------------------------------------------------
// BULK ADD INTERESTS
// ---------------------------------------------------------

export interface BulkAddInterestInput {
  titles: string[];
}

export interface BulkAddInterestResponse {
  bulkAddInterests: Interest[];
}

export const BULK_ADD_INTERESTS = gql`
  mutation BulkAddInterests($input: BulkAddInterestInput!) {
    bulkAddInterests(input: $input) {
      id
      title
    }
  }
`;

export function useBulkAddInterests(
  options?: MutationHookOptions<BulkAddInterestResponse, { input: BulkAddInterestInput }>,
) {
  return useMutation<BulkAddInterestResponse, { input: BulkAddInterestInput }>(
    BULK_ADD_INTERESTS,
    options,
  );
}

// ---------------------------------------------------------
// GET USERS BY INTEREST
// ---------------------------------------------------------

export interface InterestUser {
  id: string;
  globalUserId: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  headline: string | null;
}

export interface GetUsersByInterestResponse {
  getUsersByInterestNeo4j: {
    data: InterestUser[];
    totalCount: number;
    hasNextPage: boolean;
    cursor: string | null;
  };
}

export interface GetUsersByInterestVars {
  interestId: string;
  limit?: number;
  cursor?: string;
}

export const GET_USERS_BY_INTEREST_NEO4J = gql`
  query GetUsersByInterestNeo4j($interestId: ID!, $limit: Int, $cursor: String) {
    getUsersByInterestNeo4j(interestId: $interestId, limit: $limit, cursor: $cursor) {
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

export function useGetUsersByInterestNeo4j(
  options?: QueryHookOptions<GetUsersByInterestResponse, GetUsersByInterestVars>,
) {
  return useQuery<GetUsersByInterestResponse, GetUsersByInterestVars>(
    GET_USERS_BY_INTEREST_NEO4J,
    options,
  );
}

// ---------------------------------------------------------
// GET USER INTERESTS GRAPH
// ---------------------------------------------------------

export interface InterestGraphUser {
  id: string;
  globalUserId: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  headline: string | null;
}

export interface InterestGraphInterest {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInterestEdge {
  user: InterestGraphUser;
  interest: InterestGraphInterest;
}

export interface GetUserInterestsGraphData {
  getUserInterestsGraph: UserInterestEdge[];
}

export interface GetUserInterestsGraphVars {
  limit?: number;
}

export const GET_USER_INTERESTS_GRAPH = gql`
  query GetUserInterestsGraph($limit: Int) {
    getUserInterestsGraph(limit: $limit) {
      user {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      interest {
        id
        title
        createdAt
        updatedAt
      }
    }
  }
`;

export function useGetUserInterestsGraph(
  options?: QueryHookOptions<GetUserInterestsGraphData, GetUserInterestsGraphVars>,
) {
  return useQuery<GetUserInterestsGraphData, GetUserInterestsGraphVars>(
    GET_USER_INTERESTS_GRAPH,
    options,
  );
}
