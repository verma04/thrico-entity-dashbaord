import { gql, useQuery, QueryHookOptions } from "@apollo/client";

export const GET_CUSTOMER_360_AI_SUMMARY = gql`
  query GetCustomer360AiSummary($userId: ID!) {
    getCustomer360AiSummary(userId: $userId) {
      __typename
      ... on Customer360AiSummary {
        personaTitle
        summary
        keyStrengths
        riskFactors
        recommendedActions
        suggestedOutreachChannel
      }
      ... on Customer360AiSummaryMessage {
        message
      }
    }
  }
`;

export interface Customer360AiSummary {
  __typename?: "Customer360AiSummary";
  personaTitle: string;
  summary: string;
  keyStrengths: string[];
  riskFactors: string[];
  recommendedActions: string[];
  suggestedOutreachChannel?: string;
}

export interface Customer360AiSummaryMessage {
  __typename?: "Customer360AiSummaryMessage";
  message: string;
}

export type Customer360AiSummaryResult =
  | Customer360AiSummary
  | Customer360AiSummaryMessage;

export interface Customer360AiSummaryData {
  getCustomer360AiSummary: Customer360AiSummaryResult | null;
}

export const useCustomer360AiSummary = (
  userId: string,
  options?: QueryHookOptions<Customer360AiSummaryData, { userId: string }>
) => {
  return useQuery<Customer360AiSummaryData, { userId: string }>(
    GET_CUSTOMER_360_AI_SUMMARY,
    {
      variables: { userId },
      skip: !userId,
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      ...options,
    }
  );
};
