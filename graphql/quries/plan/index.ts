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

export const UPDATE_TO_YEARLY = gql`
  mutation UpdateToYearly($input: UpdateToYearlyInput!) {
    updateToYearly(input: $input) {
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
