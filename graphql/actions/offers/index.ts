import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
} from "@apollo/client";
import {
  GET_OFFER_STATS,
  GET_OFFERS,
  GET_CREATED_OFFERS,
  GET_CLAIMED_OFFERS,
  GET_OFFER_CATEGORIES,
  CREATE_OFFER,
  UPDATE_OFFER,
  DELETE_OFFER,
  VERIFY_OFFER,
  CHANGE_OFFER_STATUS,
  GET_OFFER_BY_ID,
} from "@/graphql/quries/offers";
export * from "./offer-quiries";
export * from "./offers-mutation";
import { DateRangeInput, TimeRange } from "../dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };
import { OfferCategory } from "./offer-quiries";

export type MemberEligibility =
  | "ALL"
  | "VERIFIED"
  | "TIERS"
  | "COMMUNITY"
  | "SPECIFIC_CUSTOMERS"
  | "OUTSIDE_PLATFORM";

export interface OfferEligibilityRule {
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

export interface OfferEligibilityInput {
  memberEligibility?: MemberEligibility;
  membershipTierId?: string[];
  eligibleTierIds?: string[];
  eligibleUserIds?: string[];
  eligibleSegmentIds?: string[];
  eligibleCommunityIds?: string[];
  communityIds?: string[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  validityStart: string;
  validityEnd: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  claimsCount: number;
  viewsCount: number;
  isActive: boolean;
  category: OfferCategory;
  company?: string;
  location?: string;
  termsAndConditions?: string;
  timeline?: string;
  website?: string;
  addedBy?: string;
  communityId?: string;
  communityIds?: string[];
  memberEligibility?: MemberEligibility;
  eligibilityRuleId?: string | null;
  eligibilityRule?: OfferEligibilityRule | null;
  eligibility?: OfferEligibilityRule | null;
  verification?: {
    id?: string;
    isVerified: boolean;
    isVerifiedAt?: string | null;
    verificationReason?: string | null;
  };
  createdAt: string;
  updatedAt?: string;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

export interface GetOffersInput {
  categoryId?: string;
  status?: string;
  search?: string;
  memberEligibility?: MemberEligibility;
  communityId?: string;
  communityIds?: string[];
  limit?: number;
  offset?: number;
  pagination?: {
    limit?: number | null;
    offset?: number | null;
    page?: number | null;
  };
}

export interface CreateOfferInput {
  title: string;
  description: string;
  categoryId: string;
  discount: string;
  validityStart: string;
  validityEnd: string;
  image?: any;
  status?: string;
  company?: string;
  location?: string;
  termsAndConditions?: string;
  timeline?: string;
  website?: string;
  addedBy?: string;
  communityId?: string;
  communityIds?: string[];
  memberEligibility?: MemberEligibility;
  eligibilityRuleId?: string;
  eligibility?: OfferEligibilityInput;
  isActive?: boolean;
}

export interface VerifyOfferInput {
  isVerified: boolean;
  offerId: string;
  verificationReason: string;
}

export interface VerifyOfferResponse {
  id: string;
  isVerified: boolean;
  isVerifiedAt: string;
  verifiedBy: string;
  verificationReason: string;
  offerId: string;
}

export interface ChangeOfferStatusInput {
  action: "APPROVE" | "REJECT" | "EXPIRE" | "ACTIVATE" | "DEACTIVATE";
  id: string;
  reason?: string;
}

export interface UpdateOfferInput extends Partial<CreateOfferInput> {}

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

export const useGetOfferStats = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: any,
) =>
  useQuery<
    GetOfferStatsResponse,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >(GET_OFFER_STATS, {
    variables: { timeRange, dateRange },
    ...options,
  });

export const useGetOffers = (
  input?: GetOffersInput,
  options?: QueryHookOptions<
    { getOffers: Offer[] },
    { input?: GetOffersInput }
  >,
) =>
  useQuery<{ getOffers: Offer[] }, { input?: GetOffersInput }>(GET_OFFERS, {
    variables: { input },
    ...options,
  });

export interface GetOffersPaginatedResponse {
  data: Offer[];
  total: number;
  offset?: number;
  limit?: number;
}

export const useCreatedOffers = (
  userId: string,
  page: number = 1,
  limit: number = 10,
  options?: QueryHookOptions<
    { getCreatedOffersByUserId: GetOffersPaginatedResponse },
    { userId: string; page: number; limit: number }
  >
) =>
  useQuery<
    { getCreatedOffersByUserId: GetOffersPaginatedResponse },
    { userId: string; page: number; limit: number }
  >(GET_CREATED_OFFERS, {
    variables: { userId, page, limit },
    ...options,
  });

export const useClaimedOffers = (
  userId: string,
  page: number = 1,
  limit: number = 10,
  options?: QueryHookOptions<
    { getClaimedOffers: GetOffersPaginatedResponse },
    { userId: string; page: number; limit: number }
  >
) =>
  useQuery<
    { getClaimedOffers: GetOffersPaginatedResponse },
    { userId: string; page: number; limit: number }
  >(GET_CLAIMED_OFFERS, {
    variables: { userId, page, limit },
    ...options,
  });

export const useGetOfferById = (
  id: string,
  options?: QueryHookOptions<{ getOfferById: Offer }, { id: string }>,
) =>
  useQuery<{ getOfferById: Offer }, { id: string }>(GET_OFFER_BY_ID, {
    variables: { id },
    ...options,
  });

export const useCreateOffer = (
  options?: MutationHookOptions<
    { createOffer: Partial<Offer> },
    { input: CreateOfferInput }
  >,
) =>
  useMutation<{ createOffer: Partial<Offer> }, { input: CreateOfferInput }>(
    CREATE_OFFER,
    options,
  );

export const useUpdateOffer = (
  options?: MutationHookOptions<
    { updateOffer: Partial<Offer> },
    { id: string; input: UpdateOfferInput }
  >,
) =>
  useMutation<
    { updateOffer: Partial<Offer> },
    { id: string; input: UpdateOfferInput }
  >(UPDATE_OFFER, options);

export const useDeleteOffer = (
  options?: MutationHookOptions<{ deleteOffer: boolean }, { id: string }>,
) =>
  useMutation<{ deleteOffer: boolean }, { id: string }>(DELETE_OFFER, options);
