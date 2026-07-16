import { gql, useQuery, useMutation } from "@apollo/client";

export const GET_SPONSOR_CATEGORIES = gql`
  query GetSponsorCategories {
    getSponsorCategories {
      id
      title
      displayOrder
      entityId
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPONSOR_CATEGORY = gql`
  query GetSponsorCategory($id: ID!) {
    getSponsorCategory(id: $id) {
      id
      title
      displayOrder
      entityId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SPONSOR_CATEGORY = gql`
  mutation CreateSponsorCategory($input: CreateSponsorCategoryInput!) {
    createSponsorCategory(input: $input) {
      id
      title
    }
  }
`;

export const UPDATE_SPONSOR_CATEGORY = gql`
  mutation UpdateSponsorCategory($id: ID!, $input: UpdateSponsorCategoryInput!) {
    updateSponsorCategory(id: $id, input: $input) {
      id
      title
    }
  }
`;

export const DELETE_SPONSOR_CATEGORY = gql`
  mutation DeleteSponsorCategory($id: ID!) {
    deleteSponsorCategory(id: $id)
  }
`;

export const REORDER_SPONSOR_CATEGORIES = gql`
  mutation ReorderSponsorCategories($input: [ReorderSponsorCategoryInput!]!) {
    reorderSponsorCategories(input: $input)
  }
`;

export const useGetSponsorCategories = () => {
  return useQuery(GET_SPONSOR_CATEGORIES, {
    fetchPolicy: "network-only",
  });
};

export const useGetSponsorCategory = (id: string) => {
  return useQuery(GET_SPONSOR_CATEGORY, {
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });
};

export const useCreateSponsorCategory = () => {
  return useMutation(CREATE_SPONSOR_CATEGORY, {
    refetchQueries: [{ query: GET_SPONSOR_CATEGORIES }],
  });
};

export const useUpdateSponsorCategory = () => {
  return useMutation(UPDATE_SPONSOR_CATEGORY, {
    refetchQueries: [{ query: GET_SPONSOR_CATEGORIES }],
  });
};

export const useDeleteSponsorCategory = () => {
  return useMutation(DELETE_SPONSOR_CATEGORY, {
    refetchQueries: [{ query: GET_SPONSOR_CATEGORIES }],
  });
};

export const useReorderSponsorCategories = () => {
  return useMutation(REORDER_SPONSOR_CATEGORIES, {
    refetchQueries: [{ query: GET_SPONSOR_CATEGORIES }],
  });
};
