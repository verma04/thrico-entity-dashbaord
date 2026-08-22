import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_MANUAL_VOUCHERS,
  GET_MANUAL_VOUCHER_BY_ID,
  GET_MANUAL_VOUCHER_BATCHES,
  GET_MANUAL_VOUCHER_BATCH_BY_ID,
  CREATE_MANUAL_VOUCHER_BATCH,
  CREATE_MANUAL_VOUCHER,
  UPDATE_MANUAL_VOUCHER,
  DELETE_MANUAL_VOUCHER,
  DELETE_MANUAL_VOUCHER_BATCH,
  VOID_MANUAL_VOUCHER,
  ManualVouchersFilterInput,
  CreateManualVoucherBatchInput,
  CreateManualVoucherEntryInput,
  UpdateManualVoucherInput,
} from "../../quries/rewards/manual";

export * from "../../quries/rewards/manual/types";

export const useGetManualVouchers = (
  variables?: { filter?: ManualVouchersFilterInput },
  options?: any
) =>
  useQuery(GET_MANUAL_VOUCHERS, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useLazyGetManualVouchers = (options?: any) =>
  useLazyQuery(GET_MANUAL_VOUCHERS, {
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetManualVoucherById = (id: string, options?: any) =>
  useQuery(GET_MANUAL_VOUCHER_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetManualVoucherBatches = (
  variables?: { rewardId?: string; page?: number; limit?: number },
  options?: any
) =>
  useQuery(GET_MANUAL_VOUCHER_BATCHES, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetManualVoucherBatchById = (id: string, options?: any) =>
  useQuery(GET_MANUAL_VOUCHER_BATCH_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useCreateManualVoucherBatch = (options?: any) =>
  useMutation(CREATE_MANUAL_VOUCHER_BATCH, {
    refetchQueries: [
      "GetManualVoucherBatches",
      "GetManualVouchers",
      "GetRewards",
      "GetRewardStats",
    ],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getManualVoucherBatches" });
      cache.evict({ fieldName: "getManualVouchers" });
      cache.gc();
    },
    ...options,
  });

export const useCreateManualVoucher = (options?: any) =>
  useMutation(CREATE_MANUAL_VOUCHER, {
    refetchQueries: [
      "GetManualVouchers",
      "GetManualVoucherBatches",
      "GetRewards",
    ],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getManualVouchers" });
      cache.evict({ fieldName: "getManualVoucherBatches" });
      cache.gc();
    },
    ...options,
  });

export const useUpdateManualVoucher = (options?: any) =>
  useMutation(UPDATE_MANUAL_VOUCHER, {
    refetchQueries: ["GetManualVouchers", "GetManualVoucherById"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getManualVouchers" });
      cache.gc();
    },
    ...options,
  });

export const useDeleteManualVoucher = (options?: any) =>
  useMutation(DELETE_MANUAL_VOUCHER, {
    refetchQueries: [
      "GetManualVouchers",
      "GetManualVoucherBatches",
      "GetRewardStats",
    ],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getManualVouchers" });
      cache.evict({ fieldName: "getManualVoucherBatches" });
      cache.gc();
    },
    ...options,
  });

export const useDeleteManualVoucherBatch = (options?: any) =>
  useMutation(DELETE_MANUAL_VOUCHER_BATCH, {
    refetchQueries: [
      "GetManualVoucherBatches",
      "GetManualVouchers",
      "GetRewardStats",
    ],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getManualVoucherBatches" });
      cache.evict({ fieldName: "getManualVouchers" });
      cache.gc();
    },
    ...options,
  });

export const useVoidManualVoucher = (options?: any) =>
  useMutation(VOID_MANUAL_VOUCHER, {
    refetchQueries: ["GetManualVouchers", "GetManualVoucherById"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getManualVouchers" });
      cache.gc();
    },
    ...options,
  });
