import { MutationHookOptions, useMutation } from "@apollo/client";
import {
  CREATE_OFFER_CATEGORY,
  UPDATE_OFFER_CATEGORY,
  DELETE_OFFER_CATEGORY,
  VERIFY_OFFER,
  CHANGE_OFFER_STATUS,
} from "@/graphql/quries/offers";
import { OfferCategory } from "./offer-quiries";
import {
  VerifyOfferInput,
  Offer,
  VerifyOfferResponse,
  ChangeOfferStatusInput,
} from "./index";

export interface CreateOfferCategoryInput {
  name: string;
  color?: string;
  isActive?: boolean;
}

export interface UpdateOfferCategoryInput extends Partial<CreateOfferCategoryInput> {}

export const useCreateOfferCategory = (
  options?: MutationHookOptions<
    { createOfferCategory: OfferCategory },
    { input: CreateOfferCategoryInput }
  >,
) =>
  useMutation<
    { createOfferCategory: OfferCategory },
    { input: CreateOfferCategoryInput }
  >(CREATE_OFFER_CATEGORY, options);

export const useUpdateOfferCategory = (
  options?: MutationHookOptions<
    { updateOfferCategory: OfferCategory },
    { updateOfferCategoryId: string; input: UpdateOfferCategoryInput }
  >,
) =>
  useMutation<
    { updateOfferCategory: OfferCategory },
    { updateOfferCategoryId: string; input: UpdateOfferCategoryInput }
  >(UPDATE_OFFER_CATEGORY, options);

export const useDeleteOfferCategory = (
  options?: MutationHookOptions<
    { deleteOfferCategory: boolean },
    { deleteOfferCategoryId: string }
  >,
) =>
  useMutation<
    { deleteOfferCategory: boolean },
    { deleteOfferCategoryId: string }
  >(DELETE_OFFER_CATEGORY, options);

export const useVerifyOffer = (
  options?: MutationHookOptions<
    { verifyOffer: VerifyOfferResponse },
    { input: VerifyOfferInput }
  >,
) =>
  useMutation<
    { verifyOffer: VerifyOfferResponse },
    { input: VerifyOfferInput }
  >(VERIFY_OFFER, options);

export const useChangeOfferStatus = (
  options?: MutationHookOptions<
    { changeOfferStatus: Offer },
    { input: ChangeOfferStatusInput }
  >,
) =>
  useMutation<{ changeOfferStatus: Offer }, { input: ChangeOfferStatusInput }>(
    CHANGE_OFFER_STATUS,
    options,
  );
