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

export const GET_INDUSTRIES = gql`
  query GetIndustries {
    getIndustries {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useGetIndustries(options?: QueryHookOptions<GetIndustriesData>) {
  return useQuery<GetIndustriesData>(GET_INDUSTRIES, options);
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
