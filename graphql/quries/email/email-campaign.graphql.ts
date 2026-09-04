import { gql } from "@apollo/client";

// ─────────────────────────────────────────────────────────────────────────────
// 1. FRAGMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const EMAIL_CAMPAIGN_METRICS_FRAGMENT = gql`
  fragment EmailCampaignMetricsFields on EmailCampaignKPIs {
    campaignId
    sent
    delivered
    opened
    clicked
    converted
    bounced
    complained
    unsubscribed
    openRate
    clickRate
    ctor
    bounceRate
    deliveryRate
  }
`;

export const EMAIL_CAMPAIGN_FRAGMENT = gql`
  ${EMAIL_CAMPAIGN_METRICS_FRAGMENT}
  fragment EmailCampaignFields on EmailCampaign {
    id
    entityId
    name
    subject
    previewText
    senderEmail
    senderName
    replyTo
    templateId
    htmlContent
    jsonContent
    status
    audienceType
    scheduledAt
    sentAt
    totalRecipients
    successfulSent
    failedSent
    metrics {
      ...EmailCampaignMetricsFields
    }
    createdAt
    updatedAt
  }
`;

export const EMAIL_CAMPAIGN_RECIPIENT_FRAGMENT = gql`
  fragment EmailCampaignRecipientFields on EmailCampaignRecipient {
    id
    campaignId
    userId
    email
    status
    sesMessageId
    openCount
    clickCount
    firstOpenedAt
    lastOpenedAt
    firstClickedAt
    lastClickedAt
    bouncedAt
    bounceType
    complainedAt
    unsubscribedAt
    createdAt
    updatedAt
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 2. DASHBOARD & OVERVIEW QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main Deliverability Health & KPI Overview Dashboard
 */
export const GET_EMAIL_CAMPAIGN_DASHBOARD_OVERVIEW = gql`
  ${EMAIL_CAMPAIGN_METRICS_FRAGMENT}
  ${EMAIL_CAMPAIGN_FRAGMENT}
  ${EMAIL_CAMPAIGN_RECIPIENT_FRAGMENT}
  query GetEmailCampaignDashboardOverview {
    getEmailCampaignDashboardOverview {
      totalCampaigns
      deliverabilityScore
      overallKPIs {
        ...EmailCampaignMetricsFields
      }
      recentCampaigns {
        ...EmailCampaignFields
      }
      recentActivity {
        ...EmailCampaignRecipientFields
      }
    }
    getEmailUsage {
      id
      emailsSent
      numberOfEmailsPerMonth
      usagePercent
      remaining
      periodStart
      periodEnd
    }
    getEmailDomain {
      id
      domain
      status
      verifiedAt
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 3. CAMPAIGN LIST & DETAILS QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All Campaigns List (Table View)
 */
export const GET_EMAIL_CAMPAIGNS_LIST = gql`
  ${EMAIL_CAMPAIGN_FRAGMENT}
  query GetEmailCampaignsList {
    getEmailCampaigns {
      ...EmailCampaignFields
    }
  }
`;

/**
 * Single Campaign Full Details & Metrics
 */
export const GET_EMAIL_CAMPAIGN_DETAIL = gql`
  ${EMAIL_CAMPAIGN_FRAGMENT}
  query GetEmailCampaignDetail($id: ID!) {
    getEmailCampaign(id: $id) {
      ...EmailCampaignFields
    }
  }
`;

/**
 * Campaign Live KPI Metrics Only
 */
export const GET_EMAIL_CAMPAIGN_METRICS = gql`
  ${EMAIL_CAMPAIGN_METRICS_FRAGMENT}
  query GetEmailCampaignMetrics($id: ID!) {
    getEmailCampaignMetrics(id: $id) {
      ...EmailCampaignMetricsFields
    }
  }
`;

/**
 * Link-Level Click Breakdown Heatmap
 */
export const GET_EMAIL_CAMPAIGN_LINKS = gql`
  query GetEmailCampaignLinks($id: ID!) {
    getEmailCampaignLinks(id: $id) {
      id
      campaignId
      originalUrl
      urlIndex
      totalClicks
      uniqueClicks
      createdAt
    }
  }
`;

/**
 * Time-Series Chart Data (Hourly / Daily engagement)
 */
export const GET_EMAIL_CAMPAIGN_TIME_SERIES = gql`
  query GetEmailCampaignTimeSeries($id: ID, $days: Int) {
    getEmailCampaignTimeSeries(id: $id, days: $days) {
      date
      sent
      opened
      clicked
      bounced
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECIPIENT & PER-USER DRILLDOWN QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Campaign Recipients Table (with Status Filter & Pagination)
 */
export const GET_EMAIL_CAMPAIGN_RECIPIENTS = gql`
  ${EMAIL_CAMPAIGN_RECIPIENT_FRAGMENT}
  query GetEmailCampaignRecipients($id: ID!, $filter: CampaignRecipientFilterInput) {
    getEmailCampaignRecipients(id: $id, filter: $filter) {
      total
      limit
      offset
      items {
        ...EmailCampaignRecipientFields
      }
    }
  }
`;

/**
 * Individual User / Customer 360 Email Activity History
 */
export const GET_USER_EMAIL_ACTIVITY = gql`
  ${EMAIL_CAMPAIGN_RECIPIENT_FRAGMENT}
  query GetUserEmailActivity($userId: ID, $email: String) {
    getUserEmailActivity(userId: $userId, email: $email) {
      ...EmailCampaignRecipientFields
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 5. SUPPRESSION LIST QUERIES & MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch Suppression List
 */
export const GET_EMAIL_SUPPRESSION_LIST = gql`
  query GetEmailSuppressionList {
    getEmailSuppressionList {
      id
      entityId
      email
      reason
      campaignId
      notes
      createdAt
    }
  }
`;

/**
 * Manually Add Email to Suppression
 */
export const ADD_EMAIL_SUPPRESSION = gql`
  mutation AddEmailSuppression($input: AddEmailSuppressionInput!) {
    addEmailSuppression(input: $input) {
      id
      email
      reason
      notes
      createdAt
    }
  }
`;

/**
 * Remove Email from Suppression
 */
export const REMOVE_EMAIL_SUPPRESSION = gql`
  mutation RemoveEmailSuppression($id: ID!) {
    removeEmailSuppression(id: $id)
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 6. CAMPAIGN ACTION MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create Campaign Draft or Scheduled Campaign
 */
export const CREATE_NEW_EMAIL_CAMPAIGN = gql`
  ${EMAIL_CAMPAIGN_FRAGMENT}
  mutation CreateNewEmailCampaign($input: CreateEmailCampaignInput!) {
    createEmailCampaign(input: $input) {
      ...EmailCampaignFields
    }
  }
`;

/**
 * Update Campaign Draft
 */
export const UPDATE_EMAIL_CAMPAIGN_DRAFT = gql`
  ${EMAIL_CAMPAIGN_FRAGMENT}
  mutation UpdateEmailCampaignDraft($id: ID!, $input: UpdateEmailCampaignInput!) {
    updateEmailCampaign(id: $id, input: $input) {
      ...EmailCampaignFields
    }
  }
`;

/**
 * Dispatch / Send Campaign Immediately
 */
export const SEND_EMAIL_CAMPAIGN = gql`
  ${EMAIL_CAMPAIGN_FRAGMENT}
  mutation SendEmailCampaign($id: ID!) {
    sendEmailCampaign(id: $id) {
      ...EmailCampaignFields
    }
  }
`;
