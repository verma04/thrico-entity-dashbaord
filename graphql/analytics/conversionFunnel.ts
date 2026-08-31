import { gql, useQuery, QueryHookOptions } from "@apollo/client";

export const GET_CONVERSION_FUNNEL = gql`
  query GetConversionFunnel($funnelType: String!, $entityId: ID) {
    getConversionFunnel(funnelType: $funnelType, entityId: $entityId) {
      funnelType
      totalStarted
      totalCompleted
      overallConversionRate
      steps {
        stepIndex
        name
        eventType
        count
        conversionRate
        dropOffRate
      }
    }
  }
`;

export type ConversionFunnelType =
  | "EVENT_REGISTRATION"
  | "JOB_APPLICATION"
  | "COMMUNITY_ONBOARDING"
  | "COMMERCE"
  | string;

export interface ConversionFunnelStep {
  stepIndex: number;
  name: string;
  eventType: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface ConversionFunnelData {
  getConversionFunnel: {
    funnelType: string;
    totalStarted: number;
    totalCompleted: number;
    overallConversionRate: number;
    steps: ConversionFunnelStep[];
  };
}

export interface ConversionFunnelVariables {
  funnelType: ConversionFunnelType;
  entityId?: string;
}

export const useConversionFunnel = (
  funnelType: ConversionFunnelType = "EVENT_REGISTRATION",
  entityId?: string,
  options?: QueryHookOptions<ConversionFunnelData, ConversionFunnelVariables>
) => {
  return useQuery<ConversionFunnelData, ConversionFunnelVariables>(
    GET_CONVERSION_FUNNEL,
    {
      variables: { funnelType, entityId },
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );
};
