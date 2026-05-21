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

export const GET_INTERESTS = gql`
  query GetInterests {
    getInterests {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useGetInterests(options?: QueryHookOptions<GetInterestsData>) {
  return useQuery<GetInterestsData>(GET_INTERESTS, options);
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
