import { useMutation, useQuery } from "@apollo/client";
import {
  GET_EMAIL_DOMAIN,
  ADD_EMAIL_DOMAIN,
  CHECK_EMAIL_VERIFICATION,
  DELETE_EMAIL_DOMAIN,
  SEND_EMAIL,
  CREATE_EMAIL_TEMPLATE,
  GET_EMAIL_TEMPLATES,
  GET_EMAIL_TEMPLATE,
  UPDATE_EMAIL_TEMPLATE,
  GET_EMAIL_OVERVIEW,
  SET_EMAIL_SUBSCRIPTION,
  ADD_EMAIL_TOPUP,
  DELETE_EMAIL_TEMPLATE,
  GET_EMAIL_USER_GROUPS,
  GET_EMAIL_LOGS,
  GET_EMAIL_TOPUP_HISTORY,
  GET_EMAIL_TOPUPS,
  BUY_EMAIL_TOPUP,
  VERIFY_EMAIL_TOPUP_PAYMENT,
  GET_EMAIL_DELIVERY_PERFORMANCE,
  CREATE_EMAIL_CAMPAIGN,
  GET_EMAIL_CAMPAIGNS,
  GET_EMAIL_CAMPAIGN,
  UPDATE_EMAIL_CAMPAIGN,
} from "../../quries/email";

// --- Types ---

export interface DnsRecords {
  txtRecord: string;
  txtValue: string;
  txtVerified: boolean;
  spfRecord: string;
  spfVerified: boolean;
  dkimRecords: {
    name: string;
    value: string;
    verified: boolean;
  }[];
}

export interface EmailDomain {
  id: string;
  entity: string;
  domain: string;
  verificationToken: string;
  dkimTokens: string[];
  spfRecord: string;
  status: "pending" | "verified" | "failed";
  dnsRecords: DnsRecords;
  verifiedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  entity?: string;
  name: string;
  slug?: string;
  subject: string;
  html: string;
  json: string;
  isActive: boolean;
  isDeletable?: boolean;
  createdAt?: string;
  updatedAt: string;
}

export interface EmailOverview {
  usage: {
    emailsSent: number;
    numberOfEmailsPerMonth: number;
    usagePercent: number;
    remaining: number;
    periodEnd: string;
  };
  subscription: {
    plan: "free" | "pro" | "enterprise";
    status: "active" | "inactive";
  };
  recentEmails: {
    to: string;
    subject: string;
    status: string;
    sentAt: string;
  }[];
}

export interface EmailUserGroup {
  name: string;
  emails: string[];
  count: number;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  senderAddress: string;
  status: string;
  sentAt: string;
  sesMessageId: string;
}

export interface EmailTopupHistory {
  id: string;
  extraEmails: number;
  purchasedAt: string;
}

export interface EmailTopupProduct {
  topupId: string;
  name: string;
  numberOfEmails: number;
  price: number;
  countryCode: string;
  status: "active" | "inactive";
  order: number;
}

export interface BuyTopupResponse {
  success: boolean;
  message: string;
  billingId: string;
  razorpayOrderId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  taxName: string;
  taxPercentage: number;
}

export interface VerifyEmailTopupPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  topupId: string;
}

export interface VerifyEmailTopupPaymentResponse {
  success: boolean;
  message: string;
  messageId: string;
}

export interface EmailDeliveryPerformance {
  day: string;
  sent: number;
  delivered: number;
}

export interface EmailCampaign {
  id: string;
  name: string;
  status: string;
  frequency: string;
  module: string;
  channelType: string;
  targetUsers: string;
  description?: string;
  canvasNodes?: string;
  canvasEdges?: string;
  cronType?: string;
  cronDay?: string;
  cronDate?: number;
  createdAt: string;
  updatedAt: string;
}

// --- Hooks ---

export const useGetEmailDomain = () =>
  useQuery<{ getEmailDomain: EmailDomain }>(GET_EMAIL_DOMAIN);

export const useAddEmailDomain = (options?: any) =>
  useMutation(ADD_EMAIL_DOMAIN, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_DOMAIN }],
  });

export const useCheckEmailVerification = (options?: any) =>
  useMutation(CHECK_EMAIL_VERIFICATION, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_DOMAIN }],
  });

export const useDeleteEmailDomain = (options?: any) =>
  useMutation(DELETE_EMAIL_DOMAIN, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_DOMAIN }],
  });

export const useSendEmail = (options?: any) => useMutation(SEND_EMAIL, options);

export const useCreateEmailTemplate = (options?: any) =>
  useMutation(CREATE_EMAIL_TEMPLATE, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_TEMPLATES }],
  });

export const useGetEmailTemplates = () =>
  useQuery<{ getEmailTemplates: EmailTemplate[] }>(GET_EMAIL_TEMPLATES);

export const useGetEmailTemplate = (id: string) =>
  useQuery<{ getEmailTemplate: EmailTemplate }>(GET_EMAIL_TEMPLATE, {
    variables: { id },
    skip: !id,
  });

export const useUpdateEmailTemplate = (options?: any) =>
  useMutation(UPDATE_EMAIL_TEMPLATE, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_TEMPLATES }],
  });

export const useGetEmailOverview = () =>
  useQuery<{ getEmailOverview: EmailOverview }>(GET_EMAIL_OVERVIEW);

export const useSetEmailSubscription = (options?: any) =>
  useMutation(SET_EMAIL_SUBSCRIPTION, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_OVERVIEW }],
  });

export const useAddEmailTopup = (options?: any) =>
  useMutation(ADD_EMAIL_TOPUP, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_OVERVIEW }],
  });

export const useDeleteEmailTemplate = (options?: any) =>
  useMutation(DELETE_EMAIL_TEMPLATE, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_TEMPLATES }],
  });

export const useGetEmailUserGroups = () =>
  useQuery<{ getEmailUserGroups: EmailUserGroup[] }>(GET_EMAIL_USER_GROUPS);

export const useGetEmailLogs = (input?: any) =>
  useQuery<{ getEmailLogs: EmailLog[] }>(GET_EMAIL_LOGS, {
    variables: { input },
  });

export const useGetEmailTopupHistory = () =>
  useQuery<{ getEmailTopupHistory: EmailTopupHistory[] }>(
    GET_EMAIL_TOPUP_HISTORY,
  );

export const useGetEmailTopups = () =>
  useQuery<{ getEmailTopups: EmailTopupProduct[] }>(GET_EMAIL_TOPUPS);

export const useBuyEmailTopup = (options?: any) =>
  useMutation<
    { buyEmailTopup: BuyTopupResponse },
    { input: { topupId: string } }
  >(BUY_EMAIL_TOPUP, options);

export const useVerifyEmailTopupPayment = (options?: any) =>
  useMutation<
    { verifyEmailTopupPayment: VerifyEmailTopupPaymentResponse },
    { input: VerifyEmailTopupPaymentInput }
  >(VERIFY_EMAIL_TOPUP_PAYMENT, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_OVERVIEW }],
  });

export const useGetEmailDeliveryPerformance = () =>
  useQuery<{ getEmailDeliveryPerformance: EmailDeliveryPerformance[] }>(
    GET_EMAIL_DELIVERY_PERFORMANCE,
  );

export const useCreateEmailCampaign = (options?: any) =>
  useMutation(CREATE_EMAIL_CAMPAIGN, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_CAMPAIGNS }],
  });

export const useGetEmailCampaigns = () =>
  useQuery<{ getEmailCampaigns: EmailCampaign[] }>(GET_EMAIL_CAMPAIGNS);

export const useGetEmailCampaign = (id: string) =>
  useQuery<{ getEmailCampaign: EmailCampaign }>(GET_EMAIL_CAMPAIGN, {
    variables: { id },
    skip: !id,
  });

export const useUpdateEmailCampaign = (options?: any) =>
  useMutation(UPDATE_EMAIL_CAMPAIGN, {
    ...options,
    refetchQueries: [{ query: GET_EMAIL_CAMPAIGNS }],
  });

export * from "./campaign-actions";
