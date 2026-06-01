import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
} from "@apollo/client";
import {
  GET_OFFER_STATS,
  GET_OFFERS,
  GET_OFFER_CATEGORIES,
  CREATE_OFFER,
  UPDATE_OFFER,
  DELETE_OFFER,
  VERIFY_OFFER,
  CHANGE_OFFER_STATUS,
} from "@/graphql/quries/offers";
export * from "./offer-quiries";
export * from "./offers-mutation";
import { DateRangeInput, TimeRange } from "../dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };
import { OfferCategory } from "./offer-quiries";

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
  verification?: {
    isVerified: boolean;
    verificationReason: string;
  };
  createdAt: string;
  addedBy?: string;
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
