import { gql } from "@apollo/client";

export const GET_CURRENCY = gql`
  query GetCurrency {
    getCurrency {
      cc
      symbol
    }
  }
`;

export const GET_TAGS = gql`
  query getEntityTag {
    getEntityTag {
      title
    }
  }
`;
export const GET_MODULE_FAQ = gql`
  query GetModuleFaq($input: faqModule) {
    getModuleFaq(input: $input) {
      description
      title
    }
  }
`;
