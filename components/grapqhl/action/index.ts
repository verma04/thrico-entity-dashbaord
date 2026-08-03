"use client";
import { gql } from "@apollo/client";
import { COMPLETE_KYC, GET_USER, GET_ORG_DETAILS, ENTITY_DETAILS, CHECK_USER_ONLINE } from "../queries";
import { MutationHookOptions, QueryHookOptions, useMutation, useQuery } from "@apollo/client/react";

// Types for GetUser
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isApproved: boolean;
  isRequested: boolean;
  avatar: string;
  cover: string;
  location: any;
  about: {
    headline: string;
  };
  status: string;
}
export interface GetUserData {
  getUser: User;
}

// Types for GetOrgDetails
export interface OrgDetails {
  name: string;
  logo: string;
  favicon: string;
}
export interface GetOrgDetailsData {
  getOrgDetails: OrgDetails;
}

// Types for CompleteKyc
export interface CompleteKycInput {
  // define fields as per your schema
}
export interface CompleteKycData {
  completeKyc: {
    success: boolean;
  };
}

export const useGetUser = (
  options?: QueryHookOptions<GetUserData, any>
) => useQuery<GetUserData, any>(GET_USER, options);

export const useGetOrgDetails = (
  options?: QueryHookOptions<GetOrgDetailsData, any>
) => useQuery<GetOrgDetailsData, any>(GET_ORG_DETAILS, options);

export const useCompleteKyc = (
  options?: MutationHookOptions<CompleteKycData, { input: CompleteKycInput }>
) => useMutation<CompleteKycData, { input: CompleteKycInput }>(COMPLETE_KYC, options);

export const SWITCH_ACCOUNT = gql`
  mutation SwitchAccount($input: inputSwitchAccount) {
    switchAccount(input: $input) {
      token
      domain
      theme {
        colorPrimary
      }
    }
  }
`;

export interface SwitchAccountData {
  switchAccount: {
    token: string;
    domain: string;
    theme: {
      colorPrimary: string;
    };
  };
}

export const switchUserAccount = (options?: MutationHookOptions<SwitchAccountData, any>) =>
  useMutation<SwitchAccountData, any>(SWITCH_ACCOUNT, options);

// Types for GetEntityDetails
export interface EntityModule {
  name: string;
  icon: string;
  showInMobileNavigation: boolean;
  isPopular: boolean;
  showInMobileNavigationSortNumber: number;
  enabled: boolean;
}

export interface EntitySubscription {
  status: boolean;
  modules: EntityModule[];
}

export interface EntityTheme {
  primaryColor: string;
  colorPrimary: string;
  borderRadius: string;
  colorBgContainer: string;
}

export interface EntityDetailsData {
  subscription: EntitySubscription | null;
  name: string;
  logo: string;
  theme: EntityTheme | null;
}

export interface GetEntityDetailsResponse {
  entityDetails: EntityDetailsData;
}

export const useGetEntityDetails = (
  options?: QueryHookOptions<GetEntityDetailsResponse, any>
) => useQuery<GetEntityDetailsResponse, any>(ENTITY_DETAILS, options);

export interface CheckUserOnlineData {
  checkUserOnline: {
    status: string;
    message: string;
  };
}

export const useCheckUserOnline = (
  options?: QueryHookOptions<CheckUserOnlineData, any>
) => useQuery<CheckUserOnlineData, any>(CHECK_USER_ONLINE, options);
