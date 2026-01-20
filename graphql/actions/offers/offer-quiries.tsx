import { gql, QueryHookOptions, useQuery } from "@apollo/client";

export interface OfferCategory {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  offersCount: number;
  createdAt: string;
}

export const GET_OFFER_CATEGORIES = gql`
  query GetOfferCategories {
    getOfferCategories {
      id
      name
      color
      isActive
      offersCount
      createdAt
    }
  }
`;

export function useGetOfferCategories(
  options?: QueryHookOptions<{ getOfferCategories: OfferCategory[] }>,
) {
  return useQuery<{ getOfferCategories: OfferCategory[] }>(
    GET_OFFER_CATEGORIES,
    options,
  );
}
