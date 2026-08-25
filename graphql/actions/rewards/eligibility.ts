import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_REWARD_ELIGIBILITY_RULES,
  GET_REWARD_ELIGIBILITY_RULE_BY_ID,
  CREATE_REWARD_ELIGIBILITY_RULE,
  UPDATE_REWARD_ELIGIBILITY_RULE,
  DELETE_REWARD_ELIGIBILITY_RULE,
  GetRewardEligibilityRulesVariables,
  GetRewardEligibilityRulesResponse,
  GetRewardEligibilityRuleByIdVariables,
  GetRewardEligibilityRuleByIdResponse,
  CreateRewardEligibilityRuleVariables,
  CreateRewardEligibilityRuleResponse,
  UpdateRewardEligibilityRuleVariables,
  UpdateRewardEligibilityRuleResponse,
  DeleteRewardEligibilityRuleVariables,
  DeleteRewardEligibilityRuleResponse,
} from "../../quries/rewards/eligibility";

export * from "../../quries/rewards/eligibility/types";

export const useGetRewardEligibilityRules = (
  variables?: GetRewardEligibilityRulesVariables,
  options?: any
) =>
  useQuery<GetRewardEligibilityRulesResponse>(GET_REWARD_ELIGIBILITY_RULES, {
    variables,
    fetchPolicy: "cache-and-network",
    ...options,
  });

export const useLazyGetRewardEligibilityRules = (options?: any) =>
  useLazyQuery<GetRewardEligibilityRulesResponse>(
    GET_REWARD_ELIGIBILITY_RULES,
    {
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );

export const useGetRewardEligibilityRuleById = (
  id: string,
  options?: any
) =>
  useQuery<GetRewardEligibilityRuleByIdResponse>(
    GET_REWARD_ELIGIBILITY_RULE_BY_ID,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "cache-and-network",
      ...options,
    }
  );

export const useCreateRewardEligibilityRule = (options?: any) =>
  useMutation<
    CreateRewardEligibilityRuleResponse,
    CreateRewardEligibilityRuleVariables
  >(CREATE_REWARD_ELIGIBILITY_RULE, {
    refetchQueries: [{ query: GET_REWARD_ELIGIBILITY_RULES }],
    ...options,
  });

export const useUpdateRewardEligibilityRule = (options?: any) =>
  useMutation<
    UpdateRewardEligibilityRuleResponse,
    UpdateRewardEligibilityRuleVariables
  >(UPDATE_REWARD_ELIGIBILITY_RULE, {
    refetchQueries: [{ query: GET_REWARD_ELIGIBILITY_RULES }],
    ...options,
  });

export const useDeleteRewardEligibilityRule = (options?: any) =>
  useMutation<
    DeleteRewardEligibilityRuleResponse,
    DeleteRewardEligibilityRuleVariables
  >(DELETE_REWARD_ELIGIBILITY_RULE, {
    refetchQueries: [{ query: GET_REWARD_ELIGIBILITY_RULES }],
    ...options,
  });
