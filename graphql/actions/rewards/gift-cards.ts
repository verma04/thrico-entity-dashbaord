import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_ENTITY_REWARD_WALLET,
  GET_DIGITAL_CARD_RULES,
  GET_DIGITAL_CARD_RULE_BY_ID,
  GET_REWARD_LEDGER,
  GET_REWARD_ISSUANCES,
  GET_PROVIDER_PRODUCTS,
  GET_PROVIDER_CONNECTIONS,
  TOPUP_REWARD_WALLET,
  CREATE_REWARD_WALLET_TOPUP_ORDER,
  VERIFY_REWARD_WALLET_TOPUP_PAYMENT,
  CREATE_DIGITAL_CARD_RULE,
  UPDATE_DIGITAL_CARD_RULE,
  DELETE_DIGITAL_CARD_RULE,
  CONNECT_PROVIDER,
  SYNC_PROVIDER_PRODUCTS,
  ISSUE_REWARD,
  SIMULATE_REWARD_ISSUANCE,
  CreateDigitalCardRuleInput,
  UpdateDigitalCardRuleInput,
  CreateWalletTopupOrderInput,
  VerifyWalletTopupPaymentInput,
  ConnectProviderInput,
  IssueRewardInput,
  SimulateRewardIssuanceInput,
} from "../../quries/rewards/gift-cards";


export * from "../../quries/rewards/gift-cards/types";

export const useGetEntityRewardWallet = (options?: any) =>
  useQuery(GET_ENTITY_REWARD_WALLET, {
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useLazyGetEntityRewardWallet = (options?: any) =>
  useLazyQuery(GET_ENTITY_REWARD_WALLET, {
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetDigitalCardRules = (
  variables?: { page?: number; limit?: number; search?: string },
  options?: any
) =>
  useQuery(GET_DIGITAL_CARD_RULES, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useLazyGetDigitalCardRules = (options?: any) =>
  useLazyQuery(GET_DIGITAL_CARD_RULES, {
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetDigitalCardRuleById = (id: string, options?: any) =>
  useQuery(GET_DIGITAL_CARD_RULE_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetRewardLedger = (
  variables?: { pagination?: { page?: number; limit?: number } },
  options?: any
) =>
  useQuery(GET_REWARD_LEDGER, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetRewardIssuances = (
  variables?: {
    status?: string;
    provider?: string;
    pagination?: { page?: number; limit?: number };
  },
  options?: any
) =>
  useQuery(GET_REWARD_ISSUANCES, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetProviderProducts = (
  variables?: { provider?: string; country?: string },
  options?: any
) =>
  useQuery(GET_PROVIDER_PRODUCTS, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useGetProviderConnections = (options?: any) =>
  useQuery(GET_PROVIDER_CONNECTIONS, {
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useTopupRewardWallet = (options?: any) =>
  useMutation(TOPUP_REWARD_WALLET, {
    refetchQueries: ["GetEntityRewardWallet", "GetRewardLedger"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getEntityRewardWallet" });
      cache.evict({ fieldName: "getRewardLedger" });
      cache.gc();
    },
    ...options,
  });

export const useCreateRewardWalletTopupOrder = (options?: any) =>
  useMutation(CREATE_REWARD_WALLET_TOPUP_ORDER, {
    ...options,
  });

export const useVerifyRewardWalletTopupPayment = (options?: any) =>
  useMutation(VERIFY_REWARD_WALLET_TOPUP_PAYMENT, {
    refetchQueries: ["GetEntityRewardWallet", "GetRewardLedger"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getEntityRewardWallet" });
      cache.evict({ fieldName: "getRewardLedger" });
      cache.gc();
    },
    ...options,
  });


export const useCreateDigitalCardRule = (options?: any) =>
  useMutation(CREATE_DIGITAL_CARD_RULE, {
    refetchQueries: ["GetDigitalCardRules", "GetEntityRewardWallet"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getDigitalCardRules" });
      cache.gc();
    },
    ...options,
  });

export const useUpdateDigitalCardRule = (options?: any) =>
  useMutation(UPDATE_DIGITAL_CARD_RULE, {
    refetchQueries: ["GetDigitalCardRules", "GetDigitalCardRuleById"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getDigitalCardRules" });
      cache.gc();
    },
    ...options,
  });

export const useDeleteDigitalCardRule = (options?: any) =>
  useMutation(DELETE_DIGITAL_CARD_RULE, {
    refetchQueries: ["GetDigitalCardRules"],
    awaitRefetchQueries: true,
    update(cache) {
      cache.evict({ fieldName: "getDigitalCardRules" });
      cache.gc();
    },
    ...options,
  });

export const useConnectProvider = (options?: any) =>
  useMutation(CONNECT_PROVIDER, {
    refetchQueries: ["GetProviderConnections"],
    awaitRefetchQueries: true,
    ...options,
  });

export const useSyncProviderProducts = (options?: any) =>
  useMutation(SYNC_PROVIDER_PRODUCTS, {
    refetchQueries: ["GetProviderProducts"],
    awaitRefetchQueries: true,
    ...options,
  });

export const useIssueReward = (options?: any) =>
  useMutation(ISSUE_REWARD, {
    refetchQueries: [
      "GetEntityRewardWallet",
      "GetRewardLedger",
      "GetRewardIssuances",
    ],
    awaitRefetchQueries: true,
    ...options,
  });

export const useSimulateRewardIssuance = (options?: any) =>
  useMutation(SIMULATE_REWARD_ISSUANCE, {
    ...options,
  });
