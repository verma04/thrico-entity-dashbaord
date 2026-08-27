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
  GET_LISTING_TREND,
  GET_LISTING_CATEGORY_DISTRIBUTION,
} from "../../quries/listing";

export type MemberEligibility =
  | "ALL"
  | "VERIFIED"
  | "TIERS"
  | "COMMUNITY"
  | "SPECIFIC_CUSTOMERS"
  | "OUTSIDE_PLATFORM";

export type ListingConditionEnum =
  | "NEW"
  | "USED_LIKE_NEW"
  | "USED_LIKE_GOOD"
  | "USED_LIKE_FAIR";

export type ListingStatus =
  | "ALL"
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "DISABLED"
  | "PAUSED";

export type LogAction = "STATUS" | "UPDATE";

export interface ListingEligibilityRule {
  id: string;
  memberEligibility: MemberEligibility;
  membershipTierId?: string[];
  eligibleTierIds?: string[];
  eligibleUserIds?: string[];
  eligibleSegmentIds?: string[];
  eligibleCommunityIds?: string[];
  communityIds?: string[];
  createdAt?: string;
  updatedAt?: string | null;
}

export interface ListingEligibilityInput {
  memberEligibility?: MemberEligibility;
  membershipTierId?: string[];
  eligibleTierIds?: string[];
  eligibleUserIds?: string[];
  eligibleSegmentIds?: string[];
  eligibleCommunityIds?: string[];
  communityIds?: string[];
}

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
  status: ListingStatus | string;
  category?: string;
  isApproved: boolean;
  isExpired?: boolean;
  numberOfViews: number;
  createdAt: string;
  condition: ListingConditionEnum | string;
  updatedAt: string;
  currency: string;
  sku?: string;
  slug: string;
  location: LocationObject;
  description?: string;
  tag?: string[];
  isFeatured?: boolean;
  interests?: string[];
  categories?: string[];
  media: { id?: string; url: string; createdAt?: string; updatedAt?: string }[];
  verification?: {
    id?: string;
    isVerified: boolean;
    verificationReason?: string | null;
    isVerifiedAt?: string | null;
    verifiedBy?: any;
  };
  addedBy?: string;
  communityId?: string;
  communityIds?: string[];
  entityId?: string;
  memberEligibility?: MemberEligibility;
  eligibilityRuleId?: string | null;
  eligibilityRule?: ListingEligibilityRule | null;
  eligibility?: ListingEligibilityRule | null;
  community?: any;
  postedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
};

export type GetListingInput = {
  status?: ListingStatus | string;
  userId?: string;
  memberEligibility?: MemberEligibility;
  communityId?: string;
  communityIds?: string[];
  offset?: number;
  limit?: number;
};

export type GetListingsVars = {
  input: GetListingInput;
};

export type GetListingResponse = {
  data: MarketPlaceListing[];
  total: number;
  offset: number;
  limit: number;
};

export type GetListingDetailsByIDInput = {
  listingId: string;
};

export type GetListingDetailsVars = {
  input: GetListingDetailsByIDInput;
};

export type ListingInput = {
  title: string;
  price: number;
  condition: ListingConditionEnum | string;
  description: string;
  category: string;
  sku?: string;
  interests?: string[];
  categories?: string[];
  location: LocationObject;
  media?: any[];
  tag?: string[];
  addedBy?: string;
  communityId?: string;
  communityIds?: string[];
  memberEligibility?: MemberEligibility;
  eligibilityRuleId?: string;
  eligibility?: ListingEligibilityInput;
  currency?: string;
};

export type AddListingVars = {
  input: ListingInput;
};

export type EditListingInput = {
  id: string;
  title: string;
  price: string;
  condition: ListingConditionEnum | string;
  description: string;
  category: string;
  sku?: string;
  interests?: string[];
  categories?: string[];
  location: LocationObject;
  reason?: string;
  media?: any[];
  addedBy?: string;
  communityId?: string;
  communityIds?: string[];
  memberEligibility?: MemberEligibility;
  eligibilityRuleId?: string;
  eligibility?: ListingEligibilityInput;
  currency?: string;
};

export type EditListingVars = {
  input: EditListingInput;
};

export type ChangeListingStatusInput = {
  listingId: string;
  action: string;
  reason?: string;
};

export type ChangeListingStatusVars = {
  input: ChangeListingStatusInput;
};

export type ListingStatsByIdInput = {
  listingId: string;
};

export type ListingStats = {
  totalListings?: string | number;
  listingsDiff?: string | number;
  activeListings?: string | number;
  activePercent?: string | number;
  verifiedListings?: string | number;
  verifiedPercent?: string | number;
  totalViews?: string | number;
  viewsPercent?: string | number;
};

export type ListingStatsById = {
  totalViews?: string | number;
  uniqueViews?: string | number;
  totalContactClicks?: string | number;
  contactRate?: string | number;
  thisWeekViews?: string | number;
  lastWeekViews?: string | number;
  weeklyViewsDiff?: string | number;
};

// --- Apollo Client Hooks ---

export function useGetListingStats() {
  return useQuery<{ getListingStats: ListingStats }>(GET_LISTINGS_STATS);
}

export function useGetListingStatsById(
  options: QueryHookOptions<
    { getListingStatsById: ListingStatsById },
    { input: { listingId: string } }
  >,
) {
  return useQuery<
    { getListingStatsById: ListingStatsById },
    { input: { listingId: string } }
  >(GET_LISTINGS_STATS_BY_ID, options);
}

export type ListingTrend = {
  name: string;
  listings: number;
};

export function useListingTrend(
  timeRange?: string,
  dateRange?: { startDate: string; endDate: string },
  options?: QueryHookOptions<
    { getListingTrend: ListingTrend[] },
    { timeRange?: string; dateRange?: { startDate: string; endDate: string } }
  >,
) {
  return useQuery(GET_LISTING_TREND, {
    variables: { timeRange, dateRange },
    ...options,
  });
}

export type ListingCategoryDistribution = {
  name: string;
  value: number;
  color: string;
};

export function useListingCategoryDistribution(
  timeRange?: string,
  dateRange?: { startDate: string; endDate: string },
  options?: QueryHookOptions<
    { getListingCategoryDistribution: ListingCategoryDistribution[] },
    { timeRange?: string; dateRange?: { startDate: string; endDate: string } }
  >,
) {
  return useQuery(GET_LISTING_CATEGORY_DISTRIBUTION, {
    variables: { timeRange, dateRange },
    ...options,
  });
}

export function useListings(
  options?: QueryHookOptions<
    { getListing: GetListingResponse },
    GetListingsVars
  >,
) {
  return useQuery<{ getListing: GetListingResponse }, GetListingsVars>(
    GET_LISTINGS,
    options,
  );
}

export function useListingDetails(
  options: QueryHookOptions<
    { getListingDetailsByID: MarketPlaceListing },
    GetListingDetailsVars
  >,
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
  >,
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
              getListing: {
                ...approvedData?.getListing,
                data: [addListing, ...(approvedData?.getListing?.data || [])],
                total: (approvedData?.getListing?.total || 0) + 1,
              },
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
              getListing: {
                ...allData?.getListing,
                data: [addListing, ...(allData?.getListing?.data || [])],
                total: (allData?.getListing?.total || 0) + 1,
              },
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
  >,
) {
  return useMutation(EDIT_LISTING, options as MutationHookOptions<any, any>);
}

export function useChangeListingStatus(
  options?: MutationHookOptions<any, any>,
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
  options?: MutationHookOptions<any, any>,
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
