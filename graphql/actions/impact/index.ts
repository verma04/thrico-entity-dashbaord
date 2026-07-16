import { useMutation, useQuery } from "@apollo/client";
import {
  GET_IMPACT_TEMPLATES,
  GET_IMPACT_RULES,
  GET_IMPACT_RULE_BY_ID,
  CREATE_IMPACT_TEMPLATE,
  CREATE_IMPACT_RULE,
  GET_IMPACT_ACTIVITY_LOG,
  TOGGLE_IMPACT_RULE,
  GET_IMPACT_USERS,
} from "../../quries/impact";

export const useGetImpactRuleById = (id: string, options?: any) =>
  useQuery(GET_IMPACT_RULE_BY_ID, {
    variables: { id },
    skip: !id,
    ...options,
  });

export const useGetImpactUsers = (options?: any) =>
  useQuery(GET_IMPACT_USERS, options);

export const useGetImpactActivityLog = (options?: any) =>
  useQuery(GET_IMPACT_ACTIVITY_LOG, options);

export const useGetImpactTemplates = (options?: any) =>
  useQuery(GET_IMPACT_TEMPLATES, options);

export const useGetImpactRules = (options?: any) =>
  useQuery(GET_IMPACT_RULES, options);

export const useCreateImpactTemplate = (options?: any) =>
  useMutation(CREATE_IMPACT_TEMPLATE, {
    ...options,
  });

export const useCreateImpactRule = (options?: any) =>
  useMutation(CREATE_IMPACT_RULE, {
    ...options,
  });

export const useToggleImpactRule = (options?: any) =>
  useMutation(TOGGLE_IMPACT_RULE, {
    ...options,
  });
