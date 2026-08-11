import { gql, useQuery } from "@apollo/client";

export const GET_USER_EXPERIENCE_GRAPH = gql`
  query GetUserExperienceGraph($search: String, $companyName: String, $limit: Int, $offset: Int) {
    getUserExperienceGraph(search: $search, companyName: $companyName, limit: $limit, offset: $offset) {
      user {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      company {
        id
        title
      }
    }
  }
`;

export interface ExperienceGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface ExperienceGraphCompany {
  id: string;
  title: string;
}

export interface ExperienceGraphEdge {
  user: ExperienceGraphUser;
  company: ExperienceGraphCompany;
}

export interface GetUserExperienceGraphResponse {
  getUserExperienceGraph: ExperienceGraphEdge[];
}

export function useGetUserExperienceGraph(options?: any) {
  return useQuery<GetUserExperienceGraphResponse>(
    GET_USER_EXPERIENCE_GRAPH,
    options
  );
}
