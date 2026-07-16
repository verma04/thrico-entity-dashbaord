import { gql, useQuery } from "@apollo/client";

export const GET_OFFERS_USERS_GRAPH = gql`
  query GetOfferUserGraph($limit: Int) {
    getOfferUserGraph(limit: $limit) {
      offer {
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

export interface OffersGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface OffersGraphOffer {
  id: string;
  title: string;
}

export interface OffersGraphEdge {
  creator: OffersGraphUser;
  offer: OffersGraphOffer;
}

export interface GetOffersUsersGraphResponse {
  getOfferUserGraph: OffersGraphEdge[];
}

export function useGetOfferUserGraph(options?: any) {
  return useQuery<GetOffersUsersGraphResponse>(
    GET_OFFERS_USERS_GRAPH,
    options
  );
}
