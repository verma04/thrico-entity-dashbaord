import { useQuery } from "@apollo/client";
import { GET_OFFER_STATS } from "@/graphql/quries/offers";
import { TimeRange } from "..";

export interface OfferStats {
  totalOffers: number;
  activeOffers: number;
  claims: number;
  views: number;
  totalOffersChange: number;
  activeOffersChange: number;
  claimsChange: number;
  viewsChange: number;
}

export interface GetOfferStatsResponse {
  getOfferStats: OfferStats;
}

export const useGetOfferStats = (timeRange: TimeRange, options?: any) =>
  useQuery<GetOfferStatsResponse, { timeRange: TimeRange }>(GET_OFFER_STATS, {
    variables: { timeRange },
    ...options,
  });
