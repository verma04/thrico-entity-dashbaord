import type { EmailTemplate, EmailDomain } from "@/graphql/actions/email";

export type { EmailTemplate, EmailDomain };
export type EmailUsage = {
  emailsSent: number;
  numberOfEmailsPerMonth: number;
  usagePercent: number;
  remaining: number;
  periodEnd?: string;
};

export type RecipientMode = "manual" | "csv" | "community";

export interface SendEmailState {
  step: number;
  recipients: string[];
  emailInput: string;
  recipientMode: RecipientMode;
  selectedTemplateId: string | null;
  subject: string;
  showConfirm: boolean;
}
