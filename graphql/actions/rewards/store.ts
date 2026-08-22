import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_STORE_DISCOUNT_RULES,
  GET_STORE_DISCOUNT_RULE_BY_ID,
  CREATE_STORE_DISCOUNT_RULE,
  UPDATE_STORE_DISCOUNT_RULE,
  DELETE_STORE_DISCOUNT_RULE,
  CreateStoreDiscountRuleInput,
  UpdateStoreDiscountRuleInput,
} from "../../quries/rewards/store";

export * from "../../quries/rewards/store/types";

export const useGetStoreDiscountRules = (
  variables?: { page?: number; limit?: number; search?: string },
  options?: any
) =>
  useQuery(GET_STORE_DISCOUNT_RULES, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useLazyGetStoreDiscountRules = (options?: any) =>
  useLazyQuery(GET_STORE_DISCOUNT_RULES, {
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetStoreDiscountRuleById = (id: string, options?: any) =>
  useQuery(GET_STORE_DISCOUNT_RULE_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useCreateStoreDiscountRule = (options?: any) =>
  useMutation(CREATE_STORE_DISCOUNT_RULE, {
    refetchQueries: ["GetStoreDiscountRules"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getStoreDiscountRules" });
      cache.gc();
    },
    ...options,
  });

export const useUpdateStoreDiscountRule = (options?: any) =>
  useMutation(UPDATE_STORE_DISCOUNT_RULE, {
    refetchQueries: ["GetStoreDiscountRules", "GetStoreDiscountRuleById"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getStoreDiscountRules" });
      cache.gc();
    },
    ...options,
  });

export const useDeleteStoreDiscountRule = (options?: any) =>
  useMutation(DELETE_STORE_DISCOUNT_RULE, {
    refetchQueries: ["GetStoreDiscountRules"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getStoreDiscountRules" });
      cache.gc();
    },
    ...options,
  });
