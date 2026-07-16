import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ENTITY_CURRENCY_CONFIG,
  GET_ACTIVITY_CAPS,
  GET_TC_CONVERSION_CAP,
  GET_REDEMPTION_CAP,
  GET_CURRENCY_TRANSACTIONS,
  GET_CURRENCY_STATS,
  UPDATE_ENTITY_CURRENCY_CONFIG,
  UPSERT_ACTIVITY_CAP,
  UPDATE_TC_CONVERSION_CAP,
  UPDATE_REDEMPTION_CAP,
  RE_SEED_DEFAULT_CURRENCY,
} from "../../quries/currency/currency-queries";

export const useGetCurrencyStats = (timeRange: any, dateRange: any) =>
  useQuery(GET_CURRENCY_STATS, {
    variables: { timeRange, dateRange },
    fetchPolicy: "cache-and-network",
  });

export const useGetEntityCurrencyConfig = () =>
  useQuery(GET_ENTITY_CURRENCY_CONFIG);
export const useGetActivityCaps = () => useQuery(GET_ACTIVITY_CAPS);
export const useGetTCConversionCap = () => useQuery(GET_TC_CONVERSION_CAP);
export const useGetRedemptionCap = () => useQuery(GET_REDEMPTION_CAP);

export const useGetCurrencyTransactions = (variables?: {
  userId?: string | null;
  limit?: number;
  cursor?: string;
}) =>
  useQuery(GET_CURRENCY_TRANSACTIONS, { variables, skip: variables?.userId === "" });

export const useUpdateEntityCurrencyConfig = (options?: any) =>
  useMutation(UPDATE_ENTITY_CURRENCY_CONFIG, {
    ...options,
    refetchQueries: [{ query: GET_ENTITY_CURRENCY_CONFIG }],
  });

export const useUpsertActivityCap = (options?: any) =>
  useMutation(UPSERT_ACTIVITY_CAP, {
    ...options,
    refetchQueries: [{ query: GET_ACTIVITY_CAPS }],
  });

export const useUpdateTCConversionCap = (options?: any) =>
  useMutation(UPDATE_TC_CONVERSION_CAP, {
    ...options,
    refetchQueries: [{ query: GET_TC_CONVERSION_CAP }],
  });

export const useUpdateRedemptionCap = (options?: any) =>
  useMutation(UPDATE_REDEMPTION_CAP, {
    ...options,
    refetchQueries: [{ query: GET_REDEMPTION_CAP }],
  });

export const useReSeedDefaultCurrency = (options?: any) =>
  useMutation(RE_SEED_DEFAULT_CURRENCY, {
    ...options,
    refetchQueries: [
      { query: GET_ENTITY_CURRENCY_CONFIG },
      { query: GET_ACTIVITY_CAPS },
      { query: GET_TC_CONVERSION_CAP },
      { query: GET_REDEMPTION_CAP },
    ],
  });
