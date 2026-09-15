import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_REWARDS,
  GET_REWARD_BY_ID,
  GET_VOUCHERS,
  GET_ALL_VOUCHERS,
  GET_REDEMPTIONS,
  GET_REWARD_STATS,
  GET_REWARD_SECURITY_SETTINGS,
  CREATE_REWARD,
  UPDATE_REWARD,
  UPLOAD_VOUCHERS,
  UPDATE_REWARD_SECURITY_SETTINGS,
  MARK_VOUCHER_AS_USED,
  DELETE_VOUCHER,
  EDIT_VOUCHER,
  GET_VOUCHERS_BY_REWARD_MECHANISM,
  GET_VOUCHER,
  GET_VOUCHERS_PAGINATED,
  GET_POPULAR_REWARDS,
} from "../../quries/rewards/rewards-queries";
import { GET_SPIN_SCRATCH_STATS } from "../../quries/rewards/stats";
import { TimeRange, DateRangeInput } from "../dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };

// Central exports for sub-modules
export * from "./spin-wheel";
export * from "./scratch-card";
export * from "./match-win";
export { useGetEntityCurrencyConfig, useGetCurrencyConfig } from "../currency";
export * from "./manual";
export * from "./store";
export * from "./gift-cards";
export * from "./eligibility";


export const useGetRewards = (
  variables?: {
    status?: string;
    search?: string;
    pagination?: { page: number; limit: number };
  },
  options?: any
) =>
  useQuery(GET_REWARDS, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetRewardById = (id: string, options?: any) =>
  useQuery(GET_REWARD_BY_ID, {
    variables: { getRewardByIdId: id },
    skip: !id,
    fetchPolicy: "network-only",
    ...options,
  });

export const useGetVouchers = (variables: {
  rewardId: string;
  pagination?: { page: number; limit: number };
}) => useQuery(GET_VOUCHERS, { variables, skip: !variables.rewardId });

export const useGetVouchersPaginated = (variables: {
  rewardId: string;
  pagination?: { page: number; limit: number };
}) => useQuery(GET_VOUCHERS_PAGINATED, { variables, skip: !variables.rewardId });

export const useGetVoucher = (rewardId: string) =>
  useQuery(GET_VOUCHER, {
    variables: { rewardId },
    skip: !rewardId,
  });

export const useGetAllVouchers = (variables?: {
  pagination?: { page: number; limit: number };
  status?: string;
  rewardId?: string;
}) => useQuery(GET_ALL_VOUCHERS, { variables });

export const useGetVouchersByRewardMechanism = (
  variables: {
    mechanism: string;
    pagination?: { page: number; limit: number };
  },
  options?: any
) =>
  useQuery(GET_VOUCHERS_BY_REWARD_MECHANISM, {
    variables,
    skip: !variables.mechanism,
    ...options,
  });

export const useLazyGetVouchersByRewardMechanism = (options?: any) =>
  useLazyQuery(GET_VOUCHERS_BY_REWARD_MECHANISM, options);

export const useGetRedemptions = (variables?: {
  userId?: string;
  status?: string;
  pagination?: { page: number; limit: number };
}) => useQuery(GET_REDEMPTIONS, { variables });

export const useGetRewardStats = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
) => useQuery(GET_REWARD_STATS, { variables: { timeRange, dateRange } });

export const useGetRewardSecuritySettings = () =>
  useQuery(GET_REWARD_SECURITY_SETTINGS);

export const useCreateReward = (options?: any) =>
  useMutation(CREATE_REWARD, {
    refetchQueries: ["GetRewards", "GetRewardStats", "GetPopularRewards"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getRewards" });
      cache.evict({ fieldName: "getRewardStats" });
      cache.evict({ fieldName: "getPopularRewards" });
      cache.gc();
    },
    ...options,
  });

export const useUpdateReward = (options?: any) =>
  useMutation(UPDATE_REWARD, {
    refetchQueries: ["GetRewards", "GetRewardStats", "GetRewardById", "GetPopularRewards"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getRewards" });
      cache.evict({ fieldName: "getRewardStats" });
      cache.evict({ fieldName: "getRewardById" });
      cache.evict({ fieldName: "getPopularRewards" });
      cache.gc();
    },
    ...options,
  });

export const useUploadVouchers = (options?: any) =>
  useMutation(UPLOAD_VOUCHERS, {
    refetchQueries: [
      "GetRewardStats",
      "GetRewardById",
      "GetRewards",
      "GetVouchers",
      "GetAllVouchers",
    ],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getRewards" });
      cache.evict({ fieldName: "getRewardStats" });
      cache.evict({ fieldName: "getVouchers" });
      cache.evict({ fieldName: "getAllVouchers" });
      cache.gc();
    },
    ...options,
  });

export const useUpdateRewardSecuritySettings = (options?: any) =>
  useMutation(UPDATE_REWARD_SECURITY_SETTINGS, {
    ...options,
    refetchQueries: [{ query: GET_REWARD_SECURITY_SETTINGS }],
  });

export const useMarkVoucherAsUsed = (options?: any) =>
  useMutation(MARK_VOUCHER_AS_USED, {
    refetchQueries: [{ query: GET_ALL_VOUCHERS }, "GetRewards", "GetRewardStats"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getAllVouchers" });
      cache.evict({ fieldName: "getRewards" });
      cache.gc();
    },
    ...options,
  });

export const useDeleteVoucher = (options?: any) =>
  useMutation(DELETE_VOUCHER, {
    refetchQueries: [{ query: GET_ALL_VOUCHERS }, { query: GET_REWARD_STATS }, "GetRewards"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getAllVouchers" });
      cache.evict({ fieldName: "getRewardStats" });
      cache.evict({ fieldName: "getRewards" });
      cache.gc();
    },
    ...options,
  });

export const useEditVoucher = (options?: any) =>
  useMutation(EDIT_VOUCHER, {
    refetchQueries: [{ query: GET_ALL_VOUCHERS }, "GetVouchers"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getAllVouchers" });
      cache.evict({ fieldName: "getVouchers" });
      cache.gc();
    },
    ...options,
  });

export const useGetSpinScratchStats = (
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
) => useQuery(GET_SPIN_SCRATCH_STATS, { variables: { timeRange, dateRange } });

export const useGetPopularRewards = (limit?: number) =>
  useQuery(GET_POPULAR_REWARDS, { variables: { limit } });
