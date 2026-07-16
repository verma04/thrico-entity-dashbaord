import { gql, useMutation, useQuery } from "@apollo/client";

// Queries
export const GET_WALL_OF_FAME = gql`
  query GetWallOfFame($input: getAllWallOfFameInput) {
    getWallOfFame(input: $input) {
      id
      title
      achievement
      year
      order
      recognitionDate
      user {
        user {
          lastName
          firstName
          avatar
        }
      }
      category {
        id
        title
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_WALL_OF_FAME_BY_ID = gql`
  query GetWallOfFameById($getWallOfFameByIdId: ID!) {
    getWallOfFameById(id: $getWallOfFameByIdId) {
      id
      title
      achievement
      year
      order
      recognitionDate
      user {
        user {
          firstName
          lastName
          avatar
        }
      }
      category {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_WALL_OF_FAME_CATEGORIES = gql`
  query GetWallOfFameCategories {
    getWallOfFameCategories {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

// Mutations
export const ADD_TO_WALL_OF_FAME = gql`
  mutation AddToWallOfFame($input: wallOfFameInput) {
    addToWallOfFame(input: $input) {
      id
      title
      achievement
      year
      order
      recognitionDate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_WALL_OF_FAME = gql`
  mutation UpdateWallOfFame($updateWallOfFameId: ID!, $input: wallOfFameInput) {
    updateWallOfFame(id: $updateWallOfFameId, input: $input) {
      id
      title
      achievement
      year
      order
      recognitionDate
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_FROM_WALL_OF_FAME = gql`
  mutation RemoveFromWallOfFame($removeFromWallOfFameId: ID!) {
    removeFromWallOfFame(id: $removeFromWallOfFameId) {
      id
      title
    }
  }
`;

export const REORDER_WALL_OF_FAME = gql`
  mutation ReorderWallOfFame($input: [ReorderWallOfFameInput]) {
    reorderWallOfFame(input: $input) {
      id
      title
      achievement
      year
      order
      recognitionDate
      createdAt
      updatedAt
    }
  }
`;

export const ADD_WALL_OF_FAME_CATEGORY = gql`
  mutation AddWallOfFameCategory($input: wallOfFameCategoryInput) {
    addWallOfFameCategory(input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_WALL_OF_FAME_CATEGORY = gql`
  mutation UpdateWallOfFameCategory($updateWallOfFameCategoryId: ID!, $input: wallOfFameCategoryInput) {
    updateWallOfFameCategory(id: $updateWallOfFameCategoryId, input: $input) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_WALL_OF_FAME_CATEGORY = gql`
  mutation DeleteWallOfFameCategory($deleteWallOfFameCategoryId: ID!) {
    deleteWallOfFameCategory(id: $deleteWallOfFameCategoryId) {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

// Hooks
export const useGetWallOfFame = (variables?: any) => {
  return useQuery(GET_WALL_OF_FAME, {
    variables,
    fetchPolicy: "network-only",
  });
};

export const useGetWallOfFameById = (id: string) => {
  return useQuery(GET_WALL_OF_FAME_BY_ID, {
    variables: { getWallOfFameByIdId: id },
    skip: !id,
    fetchPolicy: "network-only",
  });
};

export const useGetWallOfFameCategories = () => {
  return useQuery(GET_WALL_OF_FAME_CATEGORIES, {
    fetchPolicy: "network-only",
  });
};

export const useAddToWallOfFame = () => {
  return useMutation(ADD_TO_WALL_OF_FAME);
};

export const useUpdateWallOfFame = () => {
  return useMutation(UPDATE_WALL_OF_FAME);
};

export const useRemoveFromWallOfFame = () => {
  return useMutation(REMOVE_FROM_WALL_OF_FAME);
};

export const useReorderWallOfFame = () => {
  return useMutation(REORDER_WALL_OF_FAME);
};

export const useAddWallOfFameCategory = () => {
  return useMutation(ADD_WALL_OF_FAME_CATEGORY);
};

export const useUpdateWallOfFameCategory = () => {
  return useMutation(UPDATE_WALL_OF_FAME_CATEGORY);
};

export const useDeleteWallOfFameCategory = () => {
  return useMutation(DELETE_WALL_OF_FAME_CATEGORY);
};
