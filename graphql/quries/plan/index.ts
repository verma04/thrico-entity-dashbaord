import { gql } from "@apollo/client";

export const GET_COUNTRY_PACKAGES = gql`
  query GetCountryPackage {
    getCountryPackage {
      name
      accessType
      monthlyPrice
      yearlyPrice
      adminUsers
      numberOfUsers
      isPopular
      benefits
      packageId
      currency
      modules {
        name
        icon
      }
    }
  }
`;

export const UPDATE_TRAIL_TO_PACKAGE = gql`
  mutation UpdateTrialToPackage($input: UpdateTrialToPackageInput!) {
    updateTrialToPackage(input: $input) {
      id
      entity
      amount
      currency
      receipt
      status
      created_at
    }
  }
`;

export const GET_UPDATE_TO_YEARLY_SUMMARY = gql`
  query GetUpdateToYearlySummary {
    getUpdateToYearlySummary {
      basePrice
      addonsPrice
      taxAmount
      totalAmount
      taxName
      taxPercentage
      addons {
        addonId
        name
        type
        quantity
        unitPrice
        totalPrice
      }
      planName
      billingCycle
    }
  }
`;

export const UPDATE_TO_YEARLY = gql`
  mutation UpdateToYearly {
    updateToYearly {
      subscriptionId
      packageId
      planName
      planType
      billingCycle
      price
      startDate
      endDate
      status
      billingId
      billStatus
      billAmount
      razorpayOrder {
        id
        entity
        amount
        currency
        receipt
        status
        created_at
      }
      addons {
        addonId
        name
        type
        quantity
        unitPrice
        totalPrice
      }
      taxAmount
      totalAmount
      taxName
      taxPercentage
    }
  }
`;
export const VERIFY_RAZORPAY_PAYMENT = gql`
  mutation VerifyRazorpayPayment($input: RazorpayPaymentInput!) {
    verifyRazorpayPayment(input: $input) {
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
`;

export const GET_PLAN_OVERVIEW = gql`
  query GetPlanOverview {
    getPlanOverview {
      planName
      status
      billingCycle
      nextPaymentDate
      price
      adminUsers {
        used
        limit
        percent
      }
      modulesUsed {
        used
        limit
        percent
      }

      userUsage {
        used
        limit
        percent
      }
      subscriptionType
      package {
        name
        accessType
        monthlyPrice
        yearlyPrice
        adminUsers
        numberOfUsers
        isPopular
        benefits
        packageId
        currency
      }
      addons {
        addonId
        type
        name
        quantity
        unitPrice
        totalPrice
        isActive
        addedAt
        removedAt
        effectiveFrom
      }
    }
  }
`;

export const CREATE_CUSTOM_REQUEST = gql`
  mutation CreateCustomRequest($input: CreateCustomRequestInput!) {
    createCustomRequest(input: $input) {
      id
    }
  }
`;

export const GET_UPGRADE_PLAN_SUMMARY = gql`
  mutation GetUpgradePlanSummary($input: UpgradePlanSummaryInput!) {
    getUpgradePlanSummary(input: $input) {
      monthlyPrice
      yearlyPrice
      creditApplied
      monthsCovered
      upgradeSummaryText
      yearlyNextBillingDate
      monthlyBillingDate
      finalMonthlyPrice
      finalYearlyPrice
      creditAppliedMonthly
      creditAppliedYearly
    }
  }
`;
export const UPGRADE_PLAN = gql`
  mutation UpgradePlan($input: UpgradePlanInput!) {
    upgradePlan(input: $input) {
      id
      entity
      amount
      currency
      receipt
      status
      created_at
    }
  }
`;

export const GET_ADDON_PRICING = gql`
  query GetAddonPricing {
    getAddonPricing {
      addons {
        countryCode
        addonPricingId
        type
        name
        description
        unitLabel
        monthlyUnitPrice
        yearlyUnitPrice
        isActive
        order
        createdAt
        updatedAt
      }
      currency
    }
  }
`;

export const ADD_ADDON = gql`
  mutation AddAddon($input: AddAddonInput!) {
    addAddon(input: $input) {
      success
      message
      billingId
      amount
      currency
      razorpayOrder {
        id
        amount
        currency
      }
    }
  }
`;

export const GET_COUNTRY = gql`
  query Country {
    country {
      code
      name
      currency
      taxName
      taxPercentage
      taxType
      taxIncluded
    }
  }
`;
