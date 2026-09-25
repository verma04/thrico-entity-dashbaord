import type {
  WhatsAppTemplate,
  WhatsAppTemplateComponent,
} from "@/graphql/actions/settings/whatsapp";

export type { WhatsAppTemplate, WhatsAppTemplateComponent };

export interface WhatsAppMessage {
  id: string;
  recipientPhone: string;
  recipientName: string;
  templateName: string;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
  failureReason?: string;
}

export interface WhatsAppAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  deliveryRate: number;
  readRate: number;
  templateBreakdown: Array<{
    name: string;
    sent: number;
    delivered: number;
    read: number;
  }>;
}

export const INITIAL_TEMPLATES: WhatsAppTemplate[] = [];
export const INITIAL_MESSAGES: WhatsAppMessage[] = [];
export const INITIAL_ANALYTICS: WhatsAppAnalytics = {
  totalSent: 0,
  totalDelivered: 0,
  totalRead: 0,
  totalFailed: 0,
  deliveryRate: 0,
  readRate: 0,
  templateBreakdown: [],
};

