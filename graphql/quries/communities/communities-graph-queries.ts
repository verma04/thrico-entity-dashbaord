import { gql, useQuery } from "@apollo/client";

export const GET_COMMUNITY_USERS_GRAPH = gql`
  query GetCommunityUsersGraph($limit: Int, $search: String) {
    getCommunityUsersGraph(limit: $limit, search: $search) {
      community {
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
    }
  }
`;

export interface CommunitiesGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface CommunitiesGraphCommunity {
  id: string;
  title: string;
}

export interface CommunitiesGraphEdge {
  user: CommunitiesGraphUser;
  community: CommunitiesGraphCommunity;
}

export interface GetCommunityUsersGraphResponse {
  getCommunityUsersGraph: CommunitiesGraphEdge[];
}

export function useGetCommunityUsersGraph(options?: any) {
  return useQuery<GetCommunityUsersGraphResponse>(
    GET_COMMUNITY_USERS_GRAPH,
    options
  );
}
