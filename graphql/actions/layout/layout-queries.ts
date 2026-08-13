import { gql } from "@apollo/client";

export const GET_TAB_ORDER = gql`
  query GetTabOrder($module: TabOrderModule!) {
    getTabOrder(module: $module) {
      tabs
    }
  }
`;

export const UPDATE_TAB_ORDER = gql`
  mutation UpdateTabOrder($input: UpdateTabOrderInput!) {
    updateTabOrder(input: $input) {
      tabs
    }
  }
`;
