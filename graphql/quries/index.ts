import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      status
      email
      firstName
      lastName
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetEntity {
    getEntity {
      id
      name
      logo
      subscription {
        subscriptionId
        packageId
        planName
        planType
        billingCycle
        startDate
        endDate
        status
        subscriptionType
        graceUntil
      }
    }
  }
`;

export const CHECK_DOMAIN = gql`
  query CheckDomain($input: domainQuery) {
    checkDomain(input: $input) {
      success
    }
  }
`;

export const REGISTER_ORGANIZATION = gql`
  mutation Mutation($input: registerEntityInput) {
    registerEntity(input: $input) {
      success
    }
  }
`;
export const CHANGE_THEME_COLOR = gql`
  mutation ChangeThemeColor($input: InputTheme) {
    changeThemeColor(input: $input) {
      borderRadius
      colorBgContainer
      colorPrimary
    }
  }
`;

export const ENTITY_TYPE = gql`
  query GetEntityType {
    getEntityType {
      title
      id
    }
  }
`;
export const INDUSTRY_TYPE = gql`
  query GetIndustryType {
    getIndustryType {
      title
      id
    }
  }
`;

export const ENTITY_KYC = gql`
  query entityKYC {
    getIndustryType {
      id
      title
    }
    getEntityType {
      title
      id
    }
  }
`;

export const GET_ENTITY_SETTINGS = gql`
  query GetEntitySettings {
    getEntitySettings {
      id
      autoApproveUser
      autoApproveGroup
      autoApproveEvents
      autoApproveJobs
      autoApproveMarketPlace
      allowNewUser
      autoApproveDiscussionForum
      allowDiscussionForum
    }
  }
`;
export const UPDATE_ENTITY_SETTINGS = gql`
  mutation UpdateEntitySettings($input: EntityAutoApprovalSettingsInput) {
    updateEntitySettings(input: $input) {
      id
      autoApproveUser
      autoApproveGroup
      autoApproveEvents
      autoApproveJobs
      autoApproveMarketPlace
      entity
      allowNewUser
      autoApproveDiscussionForum
      allowDiscussionForum
    }
  }
`;

export const GET_KYC_COUNTRIES = gql`
  query GetKycCountries {
    getKycCountries {
      code
      name
    }
  }
`;

export const CHECK_ENTITY_SUBSCRIPTIONS = gql`
  query CheckEntitySubscription {
    checkEntitySubscription {
      subscriptionId
      packageId
      planName
      planType
      billingCycle
      startDate
      endDate
      status
      subscriptionType
      graceUntil
      modules {
        id
        name
        icon
        showInMobileNavigation
        showInWebNavigation
        enabled
        showInMobileNavigationSortNumber
        isPopular
      }
    }
  }
`;

export const GET_CURRENCY = gql`
  query GetEntityCurrency {
    getEntityCurrency
  }
`;

export const UPLOAD_ENTITY_LOGO = gql`
  mutation UploadEntityLogo($file: Upload!) {
    uploadEntityLogo(file: $file) {
      id
      name
      logo
      success
      message
    }
  }
`;

export const UPDATE_ENTITY_PROFILE = gql`
  mutation UpdateEntityProfile($input: UpdateEntityInput!) {
    updateEntityProfile(input: $input) {
      id
      name
      logo
      success
      message
    }
  }
`;

// GetAllEntityInvoice Query

export const GET_ALL_ENTITY_INVOICE = gql`
  query GetAllEntityInvoice {
    getAllEntityInvoice {
      amount
      billingCycle
      billingId
      updatedAt
      totalAmount
      taxAmount
      subscriptionId
      status
      prorationDetails {
        oldpackageId
        oldPlanName
        oldPlanProratedCost
        newpackageId
        newPlanName
        newPlanProratedCost
        creditApplied
        chargeAmount
      }
      planName
      paidAt
      packageId
      notes
      invoiceUrl
      entityId
      currency
      createdAt
    }
  }
`;

// TypeScript types for GetAllEntityInvoice

export interface ProrationDetails {
  oldpackageId: string;
  oldPlanName: string;
  oldPlanProratedCost: number;
  newpackageId: string;
  newPlanName: string;
  newPlanProratedCost: number;
  creditApplied: number;
  chargeAmount: number;
}

export interface EntityInvoice {
  amount: number;
  billingCycle: string;
  billingId: string;
  updatedAt: string;
  totalAmount: number;
  taxAmount: number;
  subscriptionId: string;
  status: string;
  prorationDetails: ProrationDetails;
  planName: string;
  paidAt: string;
  packageId: string;
  notes: string;
  invoiceUrl: string;
  entityId: string;
  currency: string;
  createdAt: string;
}

export interface GetAllEntityInvoiceResponse {
  getAllEntityInvoice: EntityInvoice[];
}
