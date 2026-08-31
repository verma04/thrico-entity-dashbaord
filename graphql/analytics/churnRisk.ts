import { gql, useQuery, QueryHookOptions } from "@apollo/client";

export const GET_CHURN_RISK_MEMBERS = gql`
  query GetChurnRiskMembers($limit: Int) {
    getChurnRiskMembers(limit: $limit) {
      userId
      healthScore
      rfmSegment
      lastActive
      daysInactive
      churnRiskLevel
      recommendedAction
    }
  }
`;

export interface ChurnRiskMember {
  userId: string;
  healthScore: number;
  rfmSegment: string;
  lastActive: string;
  daysInactive: number;
  churnRiskLevel: "HIGH" | "MEDIUM" | "LOW" | string;
  recommendedAction: string;
}

export interface ChurnRiskMembersData {
  getChurnRiskMembers: ChurnRiskMember[];
}

export interface ChurnRiskMembersVariables {
  limit?: number;
}

export const useChurnRiskMembers = (
  limit: number = 15,
  options?: QueryHookOptions<ChurnRiskMembersData, ChurnRiskMembersVariables>
) => {
  return useQuery<ChurnRiskMembersData, ChurnRiskMembersVariables>(GET_CHURN_RISK_MEMBERS, {
    variables: { limit },
    fetchPolicy: "cache-and-network",
    ...options,
  });
};
