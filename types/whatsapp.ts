// types/whatsapp.ts

export type WhatsAppConnectionStatus = "CONNECTED" | "DISCONNECTED" | "PENDING" | "ERROR";
export type WhatsAppTemplateStatus = "APPROVED" | "PENDING" | "REJECTED" | "PAUSED" | "DISABLED";
export type WhatsAppMessageStatus = "CREATED" | "QUEUED" | "SENT" | "DELIVERED" | "READ" | "FAILED";
export type WhatsAppParameterFormat = "positional" | "named";

export interface WhatsAppConnection {
  id: string;
  entityId: string;
  provider: string;
  environment?: string;
  wabaId?: string;
  phoneNumberId?: string;
  businessId?: string;
  phoneNumber?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  qualityRating?: string;
  status: WhatsAppConnectionStatus;
  statusDetails?: Record<string, unknown>;
  isDefault: boolean;
  accessTokenMasked?: string;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppTemplateComponent {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
  format?: "TEXT" | "IMAGE" | "DOCUMENT" | "VIDEO";
  text?: string;
  example?: {
    body_text?: string[][]; // Positional: [["Alex", "10982"]]
    body_text_named_params?: Array<{ param_name: string; example: string }>; // Named
  };
  buttons?: Array<{
    type: "URL" | "QUICK_REPLY" | "PHONE_NUMBER";
    text: string;
    url?: string;
    phoneNumber?: string;
  }>;
}

export interface WhatsAppTemplate {
  id: string;
  entityId?: string;
  connectionId?: string;
  providerTemplateId?: string;
  name: string;
  language: string;
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  status: WhatsAppTemplateStatus;
  parameterFormat?: WhatsAppParameterFormat;
  components: WhatsAppTemplateComponent[];
  sampleParameters?: Record<string, unknown>;
  lastSyncedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInAppWhatsAppTemplateInput {
  name: string;
  language?: string;
  category?: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  parameterFormat?: WhatsAppParameterFormat;
  components: WhatsAppTemplateComponent[];
}

export interface SendWhatsAppStagingTestInput {
  connectionId?: string;
  recipientPhone: string;
  templateNameOrId: string;
  languageCode?: string;
  sampleVariables?: Record<string, string>;
}

export interface WhatsAppTestSendResult {
  success: boolean;
  messageId?: string;
  providerMessageId?: string;
  status: string;
  error?: string;
  shouldFallback?: boolean;
}

export interface WhatsAppWallet {
  id: string;
  entityId: string;
  balance: number;
  currency: string;
  autoRechargeEnabled: boolean;
  autoRechargeThreshold: number;
  autoRechargeAmount: number;
  lowBalanceAlertSent: boolean;
  updatedAt?: string;
}

export interface WhatsAppAnalytics {
  totalMessages: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  queuedCount: number;
  deliveryRatePercent: number;
  readRatePercent: number;
  failureRatePercent: number;
}
