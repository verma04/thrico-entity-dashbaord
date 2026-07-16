import { gql, QueryHookOptions, useQuery, useMutation, MutationHookOptions } from "@apollo/client";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

export interface MemberFunction {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------------------------------------------
// GET FUNCTIONS
// ---------------------------------------------------------

export interface GetFunctionsData {
  getFunctions: MemberFunction[];
}

export const GET_FUNCTIONS = gql`
  query GetFunctions {
    getFunctions {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export function useGetFunctions(options?: QueryHookOptions<GetFunctionsData>) {
  return useQuery<GetFunctionsData>(GET_FUNCTIONS, options);
}

// ---------------------------------------------------------
// ADD FUNCTION
// ---------------------------------------------------------

export interface AddFunctionInput {
  title: string;
}

export interface AddFunctionResponse {
  addFunction: MemberFunction;
}

export const ADD_FUNCTION = gql`
  mutation AddFunction($input: AddFunctionInput!) {
    addFunction(input: $input) {
      id
      title
      createdAt
    }
  }
`;

export function useAddFunction(
  options?: MutationHookOptions<AddFunctionResponse, { input: AddFunctionInput }>,
) {
  return useMutation<AddFunctionResponse, { input: AddFunctionInput }>(
    ADD_FUNCTION,
    options,
  );
}

// ---------------------------------------------------------
// UPDATE FUNCTION
// ---------------------------------------------------------

export interface UpdateFunctionInput {
  id: string;
  title: string;
}

export interface UpdateFunctionResponse {
  updateFunction: MemberFunction;
}

export const UPDATE_FUNCTION = gql`
  mutation UpdateFunction($input: UpdateFunctionInput!) {
    updateFunction(input: $input) {
      id
      title
      updatedAt
    }
  }
`;

export function useUpdateFunction(
  options?: MutationHookOptions<UpdateFunctionResponse, { input: UpdateFunctionInput }>,
) {
  return useMutation<UpdateFunctionResponse, { input: UpdateFunctionInput }>(
    UPDATE_FUNCTION,
    options,
  );
}

// ---------------------------------------------------------
// DELETE FUNCTION
// ---------------------------------------------------------

export interface DeleteFunctionInput {
  id: string;
}

export interface DeleteFunctionResponse {
  deleteFunction: MemberFunction;
}

export const DELETE_FUNCTION = gql`
  mutation DeleteFunction($input: DeleteFunctionInput!) {
    deleteFunction(input: $input) {
      id
      title
    }
  }
`;

export function useDeleteFunction(
  options?: MutationHookOptions<DeleteFunctionResponse, { input: DeleteFunctionInput }>,
) {
  return useMutation<DeleteFunctionResponse, { input: DeleteFunctionInput }>(
    DELETE_FUNCTION,
    options,
  );
}

// ---------------------------------------------------------
// BULK ADD FUNCTIONS
// ---------------------------------------------------------

export interface BulkAddFunctionInput {
  titles: string[];
}

export interface BulkAddFunctionResponse {
  bulkAddFunctions: MemberFunction[];
}

export const BULK_ADD_FUNCTIONS = gql`
  mutation BulkAddFunctions($input: BulkAddFunctionInput!) {
    bulkAddFunctions(input: $input) {
      id
      title
    }
  }
`;

export function useBulkAddFunctions(
  options?: MutationHookOptions<BulkAddFunctionResponse, { input: BulkAddFunctionInput }>,
) {
  return useMutation<BulkAddFunctionResponse, { input: BulkAddFunctionInput }>(
    BULK_ADD_FUNCTIONS,
    options,
  );
}
