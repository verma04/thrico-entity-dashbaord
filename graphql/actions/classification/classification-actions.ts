import { gql, useQuery, useMutation } from "@apollo/client";

export const GET_CLASSIFICATION_TAB_ORDER = gql`
  query GetClassificationTabOrder {
    getClassificationTabOrder {
      tabs
    }
  }
`;

export const UPDATE_CLASSIFICATION_TAB_ORDER = gql`
  mutation UpdateClassificationTabOrder($input: UpdateClassificationTabOrderInput!) {
    updateClassificationTabOrder(input: $input) {
      tabs
    }
  }
`;

export const useGetClassificationTabOrder = () => {
  return useQuery(GET_CLASSIFICATION_TAB_ORDER, {
    fetchPolicy: "network-only",
  });
};

export const useUpdateClassificationTabOrder = () => {
  return useMutation(UPDATE_CLASSIFICATION_TAB_ORDER);
};
