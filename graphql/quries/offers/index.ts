import { gql } from "@apollo/client";

export const GET_OFFER_STATS = gql`
  query GetOfferStats($timeRange: TimeRange!) {
    getOfferStats(timeRange: $timeRange) {
      totalOffers
      activeOffers
      claims
      views
      totalOffersChange
      activeOffersChange
      claimsChange
      viewsChange
    }
  }
`;
