import { gql } from "@apollo/client";

/**
 * Thrico Email System — GraphQL Queries & Mutations
 */

// 1. Domain Setup & Verification (SES)
export const EMAIL_DNS_RECORDS_FRAGMENT = gql`
  fragment EmailDNSRecords on EmailDomainDNS {
    txtRecord
    txtValue
    txtVerified
    dkimRecords {
      name
      value
      verified
    }
    spfRecord
    spfVerified
  }
`;

export const GET_EMAIL_DOMAIN = gql`
  query GetEmailDomain {
    getEmailDomain {
      id
      entity
      domain
      verificationToken
      dkimTokens
      spfRecord
      status
      dnsRecords {
        ...EmailDNSRecords
      }
      verifiedAt
      createdAt
      updatedAt
    }
  }
  ${EMAIL_DNS_RECORDS_FRAGMENT}
`;

export const ADD_EMAIL_DOMAIN = gql`
  mutation AddEmailDomain($domain: String!) {
    addEmailDomain(input: { domain: $domain }) {
      id
      domain
      status
    }
  }
`;

export const CHECK_EMAIL_VERIFICATION = gql`
  mutation CheckEmailVerification {
    checkEmailDomainVerification {
      domain
      status
      verified
    }
  }
`;

export const DELETE_EMAIL_DOMAIN = gql`
  mutation DeleteEmailDomain($id: ID!) {
    deleteEmailDomain(id: $id) {
      success
    }
  }
`;

// 2. Email Operations
export const SEND_EMAIL = gql`
  mutation SendEmail($to: [String!]!, $subject: String!, $templateId: ID!) {
    sendEmail(input: { to: $to, subject: $subject, templateId: $templateId }) {
      success
      message
    }
  }
`;

export const CREATE_EMAIL_TEMPLATE = gql`
  mutation CreateTemplate($name: String!, $subject: String!, $html: String!, $json: String) {
    createEmailTemplate(input: { name: $name, subject: $subject, html: $html, json: $json }) {
      id
      name
      json
    }
  }
`;

export const GET_EMAIL_TEMPLATES = gql`
  query GetEmailTemplates {
    getEmailTemplates {
      id
      entity
      name
      slug
      subject
      html
      json
      isActive
      isDeletable
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMAIL_TEMPLATE = gql`
  query GetTemplate($id: ID!) {
    getEmailTemplate(id: $id) {
      id
      name
      subject
      html
      json
      isActive
      updatedAt
    }
  }
`;

export const UPDATE_EMAIL_TEMPLATE = gql`
  mutation UpdateTemplate($id: ID!, $name: String!, $subject: String!, $html: String!, $json: String) {
    updateEmailTemplate(id: $id, input: { name: $name, subject: $subject, html: $html, json: $json }) {
      success
      message
    }
  }
`;

// 3. Usage & Account Overview
export const GET_EMAIL_OVERVIEW = gql`
  query GetEmailOverview {
    getEmailOverview {
      usage {
        emailsSent
        numberOfEmailsPerMonth
        usagePercent
        remaining
        periodEnd
      }
      subscription {
        plan
        status
      }
      recentEmails {
        to
        subject
        status
        sentAt
      }
    }
  }
`;

// 4. Subscriptions & Limit Management
export const SET_EMAIL_SUBSCRIPTION = gql`
  mutation SetPlan($plan: EmailSubscriptionPlan!) {
    setEmailSubscription(input: { plan: $plan }) {
      plan
      numberOfEmailsPerMonth
    }
  }
`;

export const ADD_EMAIL_TOPUP = gql`
  mutation AddTopup($extra: Int!) {
    addEmailTopup(input: { extraEmails: $extra }) {
      id
      extraEmails
    }
  }
`;

export const DELETE_EMAIL_TEMPLATE = gql`
  mutation DeleteTemplate($id: ID!) {
    deleteEmailTemplate(id: $id) {
      success
    }
  }
`;

// 5. User Groups for Email Targeting
export const GET_EMAIL_USER_GROUPS = gql`
  query GetEmailUserGroups {
    getEmailUserGroups {
      name
      emails
      count
    }
  }
`;

// 6. Logs & History
export const GET_EMAIL_LOGS = gql`
  query GetEmailLogs($input: EmailLogFilterInput) {
    getEmailLogs(input: $input) {
      id
      to
      subject
      senderAddress
      status
      sentAt
      sesMessageId
    }
  }
`;

export const GET_EMAIL_TOPUP_HISTORY = gql`
  query GetEmailTopupHistory {
    getEmailTopupHistory {
      id
      extraEmails
      purchasedAt
    }
  }
`;

// 7. Topups & Purchases
export const GET_EMAIL_TOPUPS = gql`
  query GetEmailTopups {
    getEmailTopups {
      topupId
      name
      numberOfEmails
      price
      countryCode
      status
      order
    }
  }
`;

export const BUY_EMAIL_TOPUP = gql`
  mutation BuyEmailTopup($input: BuyEmailTopupInput!) {
    buyEmailTopup(input: $input) {
      success
      message
      billingId
      razorpayOrderId
      amount
      taxAmount
      totalAmount
      currency
      taxName
      taxPercentage
    }
  }
`;

export const VERIFY_EMAIL_TOPUP_PAYMENT = gql`
  mutation VerifyEmailTopupPayment($input: VerifyEmailTopupPaymentInput!) {
    verifyEmailTopupPayment(input: $input) {
      message
      messageId
      success
    }
  }
`;
// 8. Performance Analytics
export const GET_EMAIL_DELIVERY_PERFORMANCE = gql`
  query GetEmailDeliveryPerformance {
    getEmailDeliveryPerformance {
      day
      sent
      delivered
    }
  }
`;
// 9. Automation Campaigns
export const CREATE_EMAIL_CAMPAIGN = gql`
  mutation CreateEmailCampaign($input: CreateEmailCampaignInput!) {
    createEmailCampaign(input: $input) {
      id
      name
      status
      frequency
      module
      channelType
      targetUsers
      description
      createdAt
    }
  }
`;

export const GET_EMAIL_CAMPAIGNS = gql`
  query GetEmailCampaigns {
    getEmailCampaigns {
      id
      name
      status
      frequency
      module
      channelType
      targetUsers
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMAIL_CAMPAIGN = gql`
  query GetEmailCampaign($id: ID!) {
    getEmailCampaign(id: $id) {
      id
      name
      status
      frequency
      module
      channelType
      targetUsers
      description
      canvasNodes
      canvasEdges
      cronType
      cronDay
      cronDate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMAIL_CAMPAIGN = gql`
  mutation UpdateEmailCampaign($id: ID!, $input: UpdateEmailCampaignInput!) {
    updateEmailCampaign(id: $id, input: $input) {
      id
      name
      status
      canvasNodes
      canvasEdges
      cronType
      cronDay
      cronDate
      updatedAt
    }
  }
`;
