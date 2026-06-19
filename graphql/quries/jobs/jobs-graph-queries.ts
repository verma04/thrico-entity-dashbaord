import { gql, useQuery } from "@apollo/client";

export const GET_JOBS_USERS_GRAPH = gql`
  query GetJobsUsersGraph($limit: Int, $search: String) {
    getJobsUsersGraph(limit: $limit, search: $search) {
      job {
        id
        title
      }
      user {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      relationType
    }
  }
`;

export interface JobsGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface JobsGraphJob {
  id: string;
  title: string;
}

export interface JobsGraphEdge {
  user: JobsGraphUser;
  job: JobsGraphJob;
  relationType?: string;
}

export interface GetJobsUsersGraphResponse {
  getJobsUsersGraph: JobsGraphEdge[];
}

export function useGetJobsUsersGraph(options?: any) {
  return useQuery<GetJobsUsersGraphResponse>(
    GET_JOBS_USERS_GRAPH,
    options
  );
}
