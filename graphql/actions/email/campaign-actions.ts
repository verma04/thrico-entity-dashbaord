import { useQuery, useMutation } from "@apollo/client";
import {
  GET_EMAIL_CAMPAIGN_DASHBOARD_OVERVIEW,
  GET_EMAIL_CAMPAIGNS_LIST,
  GET_EMAIL_CAMPAIGN_DETAIL,
  GET_EMAIL_CAMPAIGN_METRICS,
  GET_EMAIL_CAMPAIGN_LINKS,
  GET_EMAIL_CAMPAIGN_TIME_SERIES,
  GET_EMAIL_CAMPAIGN_RECIPIENTS,
  GET_USER_EMAIL_ACTIVITY,
  GET_EMAIL_SUPPRESSION_LIST,
  ADD_EMAIL_SUPPRESSION,
  REMOVE_EMAIL_SUPPRESSION,
  CREATE_NEW_EMAIL_CAMPAIGN,
  UPDATE_EMAIL_CAMPAIGN_DRAFT,
  SEND_EMAIL_CAMPAIGN,
} from "../../quries/email/email-campaign.graphql";

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface EmailCampaignKPIs {
  campaignId?: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  ctor: number;
  bounceRate: number;
  deliveryRate: number;
}

export interface EmailCampaignEntity {
  id: string;
  entityId: string;
  name: string;
  subject: string;
  previewText?: string;
  senderEmail?: string;
  senderName?: string;
  replyTo?: string;
  templateId?: string;
  htmlContent?: string;
  jsonContent?: string;
  status: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "PAUSED" | "CANCELLED" | "FAILED" | string;
  audienceType?: string;
  scheduledAt?: string;
  sentAt?: string;
  totalRecipients: number;
  successfulSent: number;
  failedSent: number;
  metrics?: EmailCampaignKPIs;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaignRecipient {
  id: string;
  campaignId: string;
  userId?: string;
  email: string;
  status: "PENDING" | "QUEUED" | "SENT" | "DELIVERED" | "OPENED" | "CLICKED" | "BOUNCED" | "COMPLAINED" | "UNSUBSCRIBED" | string;
  sesMessageId?: string;
  openCount: number;
  clickCount: number;
  firstOpenedAt?: string;
  lastOpenedAt?: string;
  firstClickedAt?: string;
  lastClickedAt?: string;
  bouncedAt?: string;
  bounceType?: string;
  complainedAt?: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EmailCampaignLink {
  id: string;
  campaignId: string;
  originalUrl: string;
  urlIndex: number;
  totalClicks: number;
  uniqueClicks: number;
  createdAt: string;
}

export interface EmailCampaignTimeSeriesPoint {
  date: string;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
}

export interface EmailSuppressionEntry {
  id: string;
  entityId: string;
  email: string;
  reason: string;
  campaignId?: string;
  notes?: string;
  createdAt: string;
}

export interface CampaignDashboardOverview {
  totalCampaigns: number;
  deliverabilityScore: number;
  overallKPIs: EmailCampaignKPIs;
  recentCampaigns: EmailCampaignEntity[];
  recentActivity: EmailCampaignRecipient[];
}

export interface CampaignRecipientFilterInput {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// React Apollo Hooks
// ─────────────────────────────────────────────────────────────────────────────

export const useGetEmailCampaignDashboardOverview = () =>
  useQuery<{
    getEmailCampaignDashboardOverview: CampaignDashboardOverview;
    getEmailUsage: any;
    getEmailDomain: any;
  }>(GET_EMAIL_CAMPAIGN_DASHBOARD_OVERVIEW, {
    fetchPolicy: "cache-and-network",
  });

export const useGetEmailCampaignsList = () =>
  useQuery<{ getEmailCampaigns: EmailCampaignEntity[] }>(GET_EMAIL_CAMPAIGNS_LIST);

export const useGetEmailCampaignDetail = (id: string) =>
  useQuery<{ getEmailCampaign: EmailCampaignEntity }>(GET_EMAIL_CAMPAIGN_DETAIL, {
    variables: { id },
    skip: !id,
  });

export const useGetEmailCampaignMetrics = (id: string) =>
  useQuery<{ getEmailCampaignMetrics: EmailCampaignKPIs }>(GET_EMAIL_CAMPAIGN_METRICS, {
    variables: { id },
    skip: !id,
    pollInterval: 15000,
  });

export const useGetEmailCampaignLinks = (id: string) =>
  useQuery<{ getEmailCampaignLinks: EmailCampaignLink[] }>(GET_EMAIL_CAMPAIGN_LINKS, {
    variables: { id },
    skip: !id,
  });

export const useGetEmailCampaignTimeSeries = (id?: string, days: number = 30) =>
  useQuery<{ getEmailCampaignTimeSeries: EmailCampaignTimeSeriesPoint[] }>(
    GET_EMAIL_CAMPAIGN_TIME_SERIES,
    {
      variables: { id, days },
    }
  );

export const useGetEmailCampaignRecipients = (
  id: string,
  filter?: CampaignRecipientFilterInput
) =>
  useQuery<{
    getEmailCampaignRecipients: {
      total: number;
      limit: number;
      offset: number;
      items: EmailCampaignRecipient[];
    };
  }>(GET_EMAIL_CAMPAIGN_RECIPIENTS, {
    variables: { id, filter },
    skip: !id,
  });

export const useGetUserEmailActivity = (userId?: string, email?: string) =>
  useQuery<{ getUserEmailActivity: EmailCampaignRecipient[] }>(GET_USER_EMAIL_ACTIVITY, {
    variables: { userId, email },
    skip: !userId && !email,
  });

export const useGetEmailSuppressionList = () =>
  useQuery<{ getEmailSuppressionList: EmailSuppressionEntry[] }>(
    GET_EMAIL_SUPPRESSION_LIST
  );

export const useAddEmailSuppression = (options?: any) =>
  useMutation(ADD_EMAIL_SUPPRESSION, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_SUPPRESSION_LIST }],
  });

export const useRemoveEmailSuppression = (options?: any) =>
  useMutation(REMOVE_EMAIL_SUPPRESSION, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_SUPPRESSION_LIST }],
  });

export const useCreateNewEmailCampaign = (options?: any) =>
  useMutation(CREATE_NEW_EMAIL_CAMPAIGN, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_CAMPAIGNS_LIST }],
  });

export const useUpdateEmailCampaignDraft = (options?: any) =>
  useMutation(UPDATE_EMAIL_CAMPAIGN_DRAFT, options);

export const useSendEmailCampaignImmediate = (options?: any) =>
  useMutation(SEND_EMAIL_CAMPAIGN, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_CAMPAIGNS_LIST }],
  });
