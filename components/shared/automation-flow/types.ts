export type AutomationActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "WHATSAPP_TEMPLATE";

export interface SharedAutomationCondition {
  field: string;
  operator: string;
  value: any;
}

export interface SharedAutomationAction {
  type: AutomationActionType | string;
  tierId?: string | null;
  tierName?: string | null;
  templateId?: string | null;
  templateName?: string | null;
  emailSubject?: string | null;
  emailBody?: string | null;
  communityId?: string | null;
  communityName?: string | null;
  tags?: string[] | null;
  notificationMessage?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  push?: boolean | null;
  conditionOperator?: "AND" | "OR" | string | null;
  conditions?: SharedAutomationCondition[] | null;
  // WhatsApp Template fields
  whatsAppTemplateName?: string | null;
  whatsAppLanguage?: string | null;
  whatsAppVariables?: string[] | null;
  fallbackToEmail?: boolean | null;
  fallbackChannel?: "EMAIL" | "PUSH" | string | null;
  fallbackEmailSubject?: string | null;
  fallbackEmailBody?: string | null;
  [key: string]: any;
}

export interface SharedActionNodeData {
  action: SharedAutomationAction;
  index: number;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSelect?: () => void;
  simulationStatus?: "executed" | "skipped" | "idle" | "running";
  moduleType?: "member" | "survey";
  [key: string]: any;
}

export interface SharedAddActionNodeData {
  onAddAction: (type: AutomationActionType) => void;
  moduleType?: "member" | "survey";
  [key: string]: any;
}
