import { GetEmailOverviewQuery, GetEmailTemplatesQuery, GetEmailDomainQuery } from "@/graphql/generated/graphql";

export type EmailTemplate = NonNullable<GetEmailTemplatesQuery["getEmailTemplates"]>[number];
export type EmailUsage = NonNullable<GetEmailOverviewQuery["getEmailOverview"]>["usage"];
export type EmailDomain = NonNullable<GetEmailDomainQuery["getEmailDomain"]>;

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
