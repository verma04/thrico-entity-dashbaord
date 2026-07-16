import { gql, useQuery } from "@apollo/client";

export const GET_LISTING_USERS_GRAPH = gql`
  query GetListingUserGraph($limit: Int) {
    getListingUserGraph(limit: $limit) {
      listing {
        id
        title
      }
      creator {
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

export interface ListingGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface ListingGraphListing {
  id: string;
  title: string;
}

export interface ListingGraphEdge {
  creator: ListingGraphUser;
  listing: ListingGraphListing;
}

export interface GetListingUsersGraphResponse {
  getListingUserGraph: ListingGraphEdge[];
}

export function useGetListingUserGraph(options?: any) {
  return useQuery<GetListingUsersGraphResponse>(
    GET_LISTING_USERS_GRAPH,
    options
  );
}
