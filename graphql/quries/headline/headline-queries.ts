import { gql, useQuery } from "@apollo/client";

export const GET_USER_HEADLINE_GRAPH = gql`
  query GetUserHeadlineGraph($limit: Int) {
    getUserHeadlineGraph(limit: $limit) {
      user {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      headline {
        id
        title
      }
    }
  }
`;

export interface HeadlineGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface HeadlineGraphHeadline {
  id: string;
  title: string;
}

export interface HeadlineGraphEdge {
  user: HeadlineGraphUser;
  headline: HeadlineGraphHeadline;
}

export interface GetUserHeadlineGraphResponse {
  getUserHeadlineGraph: HeadlineGraphEdge[];
}

export function useGetUserHeadlineGraph(options?: any) {
  return useQuery<GetUserHeadlineGraphResponse>(
    GET_USER_HEADLINE_GRAPH,
    options
  );
}
