import { useMutation, useQuery } from "@apollo/client";
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
  GET_VOUCHERS_BY_REWARD_MECHANISM,
} from "../../quries/rewards/rewards-queries";
import { GET_SPIN_SCRATCH_STATS } from "../../quries/rewards/stats";
import { TimeRange, DateRangeInput } from "../dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };

// Central exports for sub-modules
export * from "./spin-wheel";
export * from "./scratch-card";
export * from "./match-win";

export const useGetRewards = (variables?: {
  status?: string;
  search?: string;
  pagination?: { page: number; limit: number };
}) => useQuery(GET_REWARDS, { variables });

export const useGetRewardById = (id: string) =>
  useQuery(GET_REWARD_BY_ID, {
    variables: { getRewardByIdId: id },
    skip: !id,
  });

export const useGetVouchers = (variables: {
  rewardId: string;
  pagination?: { page: number; limit: number };
}) => useQuery(GET_VOUCHERS, { variables, skip: !variables.rewardId });

export const useGetAllVouchers = (variables?: {
  pagination?: { page: number; limit: number };
  status?: string;
  rewardId?: string;
}) => useQuery(GET_ALL_VOUCHERS, { variables });

export const useGetVouchersByRewardMechanism = (variables: {
  mechanism: string;
  pagination?: { page: number; limit: number };
}) => useQuery(GET_VOUCHERS_BY_REWARD_MECHANISM, { variables, skip: !variables.mechanism });

export const useGetRedemptions = (variables?: {
  userId?: string;
  status?: string;
  pagination?: { page: number; limit: number };
}) => useQuery(GET_REDEMPTIONS, { variables });

export const useGetRewardStats = (timeRange?: TimeRange, dateRange?: DateRangeInput) => 
  useQuery(GET_REWARD_STATS, { variables: { timeRange, dateRange } });


export const useGetRewardSecuritySettings = () =>
  useQuery(GET_REWARD_SECURITY_SETTINGS);

export const useCreateReward = (options?: any) =>
  useMutation(CREATE_REWARD, {
    ...options,
    refetchQueries: [{ query: GET_REWARDS }, { query: GET_REWARD_STATS }],
  });

export const useUpdateReward = (options?: any) =>
  useMutation(UPDATE_REWARD, {
    ...options,
    refetchQueries: [{ query: GET_REWARDS }, { query: GET_REWARD_STATS }],
  });

export const useUploadVouchers = (options?: any) =>
  useMutation(UPLOAD_VOUCHERS, {
    ...options,
    refetchQueries: [{ query: GET_REWARD_STATS }],
  });

export const useUpdateRewardSecuritySettings = (options?: any) =>
  useMutation(UPDATE_REWARD_SECURITY_SETTINGS, {
    ...options,
    refetchQueries: [{ query: GET_REWARD_SECURITY_SETTINGS }],
  });

export const useMarkVoucherAsUsed = (options?: any) =>
  useMutation(MARK_VOUCHER_AS_USED, {
    ...options,
    refetchQueries: [{ query: GET_ALL_VOUCHERS }],
  });

export const useDeleteVoucher = (options?: any) =>
  useMutation(DELETE_VOUCHER, {
    ...options,
    refetchQueries: [{ query: GET_ALL_VOUCHERS }, { query: GET_REWARD_STATS }],
  });

export const useGetSpinScratchStats = (timeRange?: TimeRange, dateRange?: DateRangeInput) => 
  useQuery(GET_SPIN_SCRATCH_STATS, { variables: { timeRange, dateRange } });
