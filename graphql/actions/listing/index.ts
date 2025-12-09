import {
  MutationHookOptions,
  QueryHookOptions,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  ADD_LISTING,
  CHANGE_LISTING_STATUS,
  CHANGE_LISTING_VERIFICATION,
  EDIT_LISTING,
  GET_LISTING_DETAILS,
  GET_LISTINGS,
  GET_LISTINGS_STATS,
  GET_LISTINGS_STATS_BY_ID,
} from "../../quries/listing";

export type ListingCategory = {
  id: string;
  name: string;
};

export type LocationObject = Record<string, any>;

// Listing Type
export type MarketPlaceListing = {
  id: string;
  title: string;
  price: string;
  status: string;
  category: string;
  isApproved: boolean;
  numberOfViews: number;
  createdAt: string;
  condition: string;
  updatedAt: string;
  currency: string;
  slug: string;
  location: string;
  description?: string;
  media: { id: string; url: string }[];
  verification?: {
    isVerified: boolean;
    verificationReason?: string;
    isVerifiedAt?: string;
  };
};

export type GetListingsVars = {
  input: {
    status?: string;
  };
};

export type GetListingDetailsVars = {
  input: {
    listingId: string;
  };
};

export type AddListingVars = {
  input: {
    title: string;
    price: string;
    condition: string;
    description: string;
    category: string;
    sku?: string;
    interests?: string[];
    categories?: string[];
    location: LocationObject;
  };
};

export type EditListingVars = {
  input: {
    id: string;
    title: string;
    price: string;
    condition: string;
    description: string;
    category: string;
    sku?: string;
    interests?: string[];
    categories?: string[];
    location: LocationObject;
    reason?: string;
  };
};

export type ChangeListingStatusVars = {
  input: {
    listingId: string;
    action: string;
    reason?: string;
  };
};
export type ListingStats = {
  totalListings: number;
  listingsDiff: number;
  activeListings: number;
  activePercent: number;
  verifiedListings: number;
  verifiedPercent: number;
  totalViews: number;
  viewsPercent: number;
};

export type ListingStatsById = {
  totalViews: number;
  uniqueViews: number;
  totalContactClicks: number;
  contactRate: number;
  thisWeekViews: number;
  lastWeekViews: number;
  weeklyViewsDiff: number;
};

// --- Apollo Client Hooks ---

export function useGetListingStats() {
  return useQuery<{ getListingStats: ListingStats }>(GET_LISTINGS_STATS);
}

export function useGetListingStatsById(
  options: QueryHookOptions<
    { getListingStatsById: ListingStatsById },
    { input: { listingId: string } }
  >
) {
  return useQuery<
    { getListingStatsById: ListingStatsById },
    { input: { listingId: string } }
  >(GET_LISTINGS_STATS_BY_ID, options);
}

export function useListings(
  options?: QueryHookOptions<
    { getListing: MarketPlaceListing[] },
    GetListingsVars
  >
) {
  return useQuery<{ getListing: MarketPlaceListing[] }, GetListingsVars>(
    GET_LISTINGS,
    options
  );
}

export function useListingDetails(
  options: QueryHookOptions<
    { getListingDetailsByID: MarketPlaceListing },
    GetListingDetailsVars
  >
) {
  return useQuery<
    { getListingDetailsByID: MarketPlaceListing },
    GetListingDetailsVars
  >(GET_LISTING_DETAILS, options);
}

export function useAddListing(
  options?: MutationHookOptions<
    { addListing: MarketPlaceListing },
    AddListingVars
  >
) {
  return useMutation(ADD_LISTING, {
    ...options,
    update(cache, { data }) {
      try {
        const addListing = data?.addListing;
        if (addListing && addListing.status === "APPROVED") {
          // Update for status: "APPROVED"
          const approvedData: any = cache.readQuery({
            query: GET_LISTINGS,
            variables: {
              input: {
                status: "APPROVED",
              },
            },
          });

          cache.writeQuery({
            query: GET_LISTINGS,
            data: {
              getListing: [addListing, ...(approvedData?.getListing || [])],
            },
            variables: {
              input: {
                status: "APPROVED",
              },
            },
          });

          // Update for status: "ALL"
          const allData: any = cache.readQuery({
            query: GET_LISTINGS,
            variables: {
              input: {
                status: "ALL",
              },
            },
          });

          cache.writeQuery({
            query: GET_LISTINGS,
            data: {
              getListing: [addListing, ...(allData?.getListing || [])],
            },
            variables: {
              input: {
                status: "ALL",
              },
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
}

export function useEditListing(
  options?: MutationHookOptions<
    { editListing: MarketPlaceListing },
    EditListingVars
  >
) {
  return useMutation(EDIT_LISTING, options as MutationHookOptions<any, any>);
}

export function useChangeListingStatus(
  options?: MutationHookOptions<any, any>
) {
  return useMutation(CHANGE_LISTING_STATUS, {
    ...options,
    refetchQueries: [
      {
        query: GET_LISTINGS,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_LISTINGS,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_LISTINGS,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },

      {
        query: GET_LISTINGS,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  });
}

export function useChangeListingVerification(
  options?: MutationHookOptions<any, any>
) {
  return useMutation(CHANGE_LISTING_VERIFICATION, {
    ...options,
    refetchQueries: [
      {
        query: GET_LISTINGS,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },

      {
        query: GET_LISTINGS,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  });
}
