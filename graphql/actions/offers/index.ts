import {
  MutationHookOptions,
  QueryHookOptions,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  ADD_OFFER_MUTATION,
  CHANGE_OFFER_STATUS_MUTATION,
  EDIT_OFFER_MUTATION,
  GET_ALL_OFFER,
  GET_OFFER_STATS,
} from "../../quries/offers";

interface LocationInput {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface CompanyInput {
  id: string;
  name: string;
  logo?: string;
}

export interface AddOfferInput {
  title: string;
  description?: string;
  location: LocationInput;
  company: CompanyInput;
  timeline: string[];
  termsAndConditions?: string;
  website?: string;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  location: LocationInput;
  company: CompanyInput;
  timeline: string[];
  termsAndConditions?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  cover?: string;
}

export interface EditOfferInput {
  id: string;
  title?: string;
  description?: string;

  timeline?: string[];
  termsAndConditions?: string;
  website?: string;
}

export function useAddOffer(
  options?: MutationHookOptions<{ addOffer: Offer }, { input: AddOfferInput }>
) {
  return useMutation<{ addOffer: Offer }, { input: AddOfferInput }>(
    ADD_OFFER_MUTATION,
    {
      ...options,
      refetchQueries: [
        {
          query: GET_ALL_OFFER,
          variables: {
            input: {
              status: "ALL",
            },
          },
        },
        {
          query: GET_ALL_OFFER,
          variables: {
            input: {
              status: "ACTIVE",
            },
          },
        },
        {
          query: GET_ALL_OFFER,
          variables: {
            input: {
              status: "INACTIVE",
            },
          },
        },
      ],
    }
  );
}

export enum OfferStatus {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface GetAllOfferInput {
  status?: OfferStatus;
}

export function useGetAllOffer(
  options?: QueryHookOptions<
    { getAllOffer: Offer[] },
    { input?: GetAllOfferInput }
  >
) {
  return useQuery<{ getAllOffer: Offer[] }, { input?: GetAllOfferInput }>(
    GET_ALL_OFFER,
    options
  );
}

export function useEditOffer(
  options?: MutationHookOptions<{ editOffer: Offer }, { input: EditOfferInput }>
) {
  return useMutation<{ editOffer: Offer }, { input: EditOfferInput }>(
    EDIT_OFFER_MUTATION,
    {
      ...options,
      refetchQueries: [
        {
          query: GET_ALL_OFFER,
          variables: {
            input: {
              status: "ALL",
            },
          },
        },
        {
          query: GET_ALL_OFFER,
          variables: {
            input: {
              status: "ACTIVE",
            },
          },
        },
        {
          query: GET_ALL_OFFER,
          variables: {
            input: {
              status: "INACTIVE",
            },
          },
        },
      ],
    }
  );
}

export interface ChangeStatusInput {
  id?: string;
  isActive?: boolean;
}

export function useChangeOfferStatus(
  options?: MutationHookOptions<
    { changeOfferStatus: Offer },
    { input: ChangeStatusInput }
  >
) {
  return useMutation<
    { changeOfferStatus: Offer },
    { input: ChangeStatusInput }
  >(CHANGE_OFFER_STATUS_MUTATION, {
    ...options,
    refetchQueries: [
      {
        query: GET_ALL_OFFER,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_ALL_OFFER,
        variables: {
          input: {
            status: "ACTIVE",
          },
        },
      },
      {
        query: GET_ALL_OFFER,
        variables: {
          input: {
            status: "INACTIVE",
          },
        },
      },
    ],
  });
}

export interface OfferStats {
  total: number;
  active: number;
  inactive: number;
  thisMonth: number;
  activePercent: number;
  inactivePercent: number;
}

export function useGetOfferStats(
  options?: QueryHookOptions<{ getOfferStats: OfferStats }>
) {
  return useQuery<{ getOfferStats: OfferStats }>(GET_OFFER_STATS, options);
}
