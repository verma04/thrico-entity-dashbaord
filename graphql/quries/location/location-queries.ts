import { gql, useQuery } from "@apollo/client";

export const GET_USER_LOCATION_GRAPH = gql`
  query GetUserLocationGraph($search: String, $limit: Int, $offset: Int) {
    getUserLocationGraph(search: $search, limit: $limit, offset: $offset) {
      user {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      location {
        id
        title
      }
    }
  }
`;

export interface LocationGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface LocationGraphLocation {
  id: string;
  title: string;
}

export interface LocationGraphEdge {
  user: LocationGraphUser;
  location: LocationGraphLocation;
}

export interface GetUserLocationGraphResponse {
  getUserLocationGraph: LocationGraphEdge[];
}

export function useGetUserLocationGraph(options?: any) {
  return useQuery<GetUserLocationGraphResponse>(
    GET_USER_LOCATION_GRAPH,
    options
  );
}
