import { gql, useQuery, QueryHookOptions } from "@apollo/client";

export const GET_COHORT_RETENTION = gql`
  query GetCohortRetention($period: String, $cohortCount: Int) {
    getCohortRetention(period: $period, cohortCount: $cohortCount) {
      periodType
      cohorts {
        cohortPeriod
        cohortSize
        retentionPeriods {
          periodIndex
          periodName
          retainedCount
          retentionPercent
        }
      }
    }
  }
`;

export interface RetentionPeriod {
  periodIndex: number;
  periodName: string;
  retainedCount: number;
  retentionPercent: number;
}

export interface CohortItem {
  cohortPeriod: string;
  cohortSize: number;
  retentionPeriods: RetentionPeriod[];
}

export interface CohortRetentionData {
  getCohortRetention: {
    periodType: "week" | "month" | string;
    cohorts: CohortItem[];
  };
}

export interface CohortRetentionVariables {
  period?: "week" | "month" | string;
  cohortCount?: number;
}

export const useCohortRetention = (
  variables: CohortRetentionVariables = { period: "week", cohortCount: 6 },
  options?: QueryHookOptions<CohortRetentionData, CohortRetentionVariables>
) => {
  return useQuery<CohortRetentionData, CohortRetentionVariables>(GET_COHORT_RETENTION, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });
};
