import { gql, useMutation, useQuery } from "@apollo/client";
import {
  CHANGE_THEME_COLOR,
  CHECK_DOMAIN,
  CHECK_ENTITY_SUBSCRIPTIONS,
  ENTITY_KYC,
  GET_CURRENCY,
  GET_ENTITY_SETTINGS,
  GET_KYC_COUNTRIES,
  GET_ORGANIZATION,
  GET_USER,
  REGISTER_ORGANIZATION,
  UPDATE_ENTITY_SETTINGS,
  UPLOAD_ENTITY_LOGO,
  UPDATE_ENTITY_PROFILE,
} from "../quries";
import { GET_MEMBERS_TERMS_AND_CONDITIONS } from "../quries/user";

// import { CHECK_PAYMENTS } from "../../../payments/graphql/quries";

export const useGetUser = () => useQuery(GET_USER);

export type Subscription = {
  subscriptionId: string;
  packageId: string;
  planName: string;
  planType: string;
  billingCycle: string;
  startDate: string;
  endDate: string;
  status:
    | "active"
    | "scheduled_downgrade"
    | "scheduled_upgrade"
    | "cancelled"
    | "suspended";
  subscriptionType: string;
  graceUntil?: string;
  modules?: {
    id: string;
    name: string;
    icon: string;
  }[];
};

export type Entity = {
  id: string;
  name: string;
  logo: string;
  subscription: Subscription;
};

export type GetEntityResponse = {
  getEntity: Entity;
};

export const useGetEntity = () => useQuery<GetEntityResponse>(GET_ORGANIZATION);

export const useCheckDomain = (options: any) => useQuery(CHECK_DOMAIN, options);

export const useRegisterOrganization = (onCompleted: any) =>
  useMutation(REGISTER_ORGANIZATION, onCompleted);

export const useChangeThemeColor = (onCompleted: any) =>
  useMutation(CHANGE_THEME_COLOR, onCompleted);

// export const checkPaymentKyc = () => useQuery(CHECK_PAYMENTS);

export const useEntityKYC = () => useQuery(ENTITY_KYC);

export const useEntitySettings = () => useQuery(GET_ENTITY_SETTINGS);

export const useUpdateEntitySettings = (options: any) =>
  useMutation(UPDATE_ENTITY_SETTINGS, {
    ...options,
    refetchQueries: [
      {
        query: GET_ENTITY_SETTINGS,
      },
    ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const useMembersTermsAndConditions = () =>
  useQuery(GET_MEMBERS_TERMS_AND_CONDITIONS);

// export const getDiscussionForumTermsAndConditions = () =>
//   useQuery(GET_DISCUSSION_FORUM_TERMS_AND_CONDITIONS);

export const useKycCountries = () => useQuery(GET_KYC_COUNTRIES);

export const useCheckEntitySubscription = () =>
  useQuery<CheckEntitySubscriptionQuery>(CHECK_ENTITY_SUBSCRIPTIONS);

export interface SubscriptionDetails {
  subscriptionId: string;
  packageId: string;
  planName: string;
  planType: "Standard" | "Custom";
  billingCycle: "monthly" | "yearly";
  price: number;
  startDate: string | Date;
  endDate: string | Date;
  status:
    | "active"
    | "scheduled_downgrade"
    | "scheduled_upgrade"
    | "cancelled"
    | "suspended";
  subscriptionType: "trial" | "paid";
  graceUntil: string | null;
  modules?: {
    id: string;
    name: string;
    icon: string;
    showInMobileNavigation: boolean;
    showInMobileNavigationSortNumber?: number;
    showInWebNavigation: boolean;
    enabled: boolean;
    isPopular: boolean;
  }[];
}
export interface CheckEntitySubscriptionQuery {
  checkEntitySubscription: SubscriptionDetails | null;
}

export const useEntityCurrency = () => useQuery(GET_CURRENCY);

export const useUploadEntityLogo = (options: any) =>
  useMutation(UPLOAD_ENTITY_LOGO, {
    ...options,
    refetchQueries: [
      {
        query: GET_ORGANIZATION,
      },
    ],
    awaitRefetchQueries: true,
  });

export const useUpdateEntityProfile = (options: any) =>
  useMutation(UPDATE_ENTITY_PROFILE, {
    ...options,
    refetchQueries: [
      {
        query: GET_ORGANIZATION,
      },
    ],
    awaitRefetchQueries: true,
  });

export interface InputUpdateEntityModule {
  icon: string | null;
  id: string | null;
  name: string | null;
  isEnabled: boolean;
  showInMobileNavigation: boolean;
  showInMobileNavigationSortNumber?: number;
  showInWebNavigation: boolean;
  isPopular: boolean;
}

export interface UpdateEntityModuleResponse {
  updateEntityModule: {
    success: boolean;
  };
}

export const UPDATE_ENTITY_MODULE = gql`
  mutation UpdateEntityModule($input: [inputUpdateEntityModule]) {
    updateEntityModule(input: $input) {
      success
    }
  }
`;

export function useUpdateEntityModule() {
  return useMutation<
    UpdateEntityModuleResponse,
    { input: InputUpdateEntityModule[] }
  >(UPDATE_ENTITY_MODULE);
}

// Upload Image Mutation
export const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file)
  }
`;

export interface UploadImageResponse {
  uploadImage: string;
}

export const useUploadImage = (options?: any) =>
  useMutation<UploadImageResponse, { file: File }>(UPLOAD_IMAGE, options);

// Action for GetAllEntityInvoice
import { GET_ALL_ENTITY_INVOICE, GetAllEntityInvoiceResponse } from "../quries";

export const useGetAllEntityInvoice = () =>
  useQuery<GetAllEntityInvoiceResponse>(GET_ALL_ENTITY_INVOICE);

// Website Actions
export * from "./website";
