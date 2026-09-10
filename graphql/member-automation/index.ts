import { gql } from "@apollo/client";

export type MemberRuleTrigger =
  | "MEMBER_JOINED"
  | "MEMBER_VERIFIED"
  | "MEMBER_APPROVED"
  | "MEMBER_REJECTED"
  | "MEMBER_DISABLED"
  | "MEMBER_BLOCKED";

export type MemberRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "WHATSAPP_TEMPLATE"
  | "CUSTOM_WEBHOOK"
  | "WEBHOOK"
  | "AWARD_POINTS";

export interface WebhookHeader {
  key: string;
  value: string;
}

export interface WebhookFieldMapping {
  field: string;
  value: string;
}

export interface AutomationWebhookActionInput {
  url: string;
  method: string;
  authType?: string | null;
  authToken?: string | null;
  authHeaderKey?: string | null;
  authHeaderValue?: string | null;
  headers?: WebhookHeader[] | null;
  mapping?: WebhookFieldMapping[] | null;
  customBody?: string | null;
}

export interface TriggerAvailableField {
  category: string;
  key: string;
  label: string;
  path: string;
  type: string;
}

export interface MemberRuleCondition {
  field: string;
  operator: string;
  value: any;
  branch?: string | null;
}

export interface MemberRuleConditionInput {
  field: string;
  operator: string;
  value: any;
  branch?: string | null;
}

export interface MemberRuleAction {
  type: MemberRuleActionType;
  branch?: string | null;
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
  whatsAppTemplateName?: string | null;
  whatsAppLanguage?: string | null;
  whatsAppVariables?: string[] | null;
  fallbackToEmail?: boolean | null;
  fallbackChannel?: string | null;
  fallbackEmailSubject?: string | null;
  fallbackEmailBody?: string | null;
  webhook?: AutomationWebhookActionInput | null;
  points?: number | null;
}

export interface MemberRuleActionInput {
  type: MemberRuleActionType;
  branch?: string | null;
  tierId?: string | null;
  templateId?: string | null;
  emailSubject?: string | null;
  emailBody?: string | null;
  communityId?: string | null;
  tags?: string[] | null;
  notificationMessage?: string | null;
  pushTitle?: string | null;
  pushBody?: string | null;
  push?: boolean | null;
  whatsAppTemplateName?: string | null;
  whatsAppLanguage?: string | null;
  whatsAppVariables?: string[] | null;
  fallbackToEmail?: boolean | null;
  fallbackChannel?: string | null;
  fallbackEmailSubject?: string | null;
  fallbackEmailBody?: string | null;
  webhook?: AutomationWebhookActionInput | null;
  points?: number | null;
}

export interface MemberRuleBranchItem {
  id: string;
  name: string;
  isDefault?: boolean | null;
  hasNoPath?: boolean | null;
}

export interface MemberAutomationRule {
  id: string;
  entityId: string;
  name: string;
  description?: string | null;
  trigger: MemberRuleTrigger;
  conditionOperator?: "AND" | "OR" | string;
  conditions?: MemberRuleCondition[] | null;
  actions: MemberRuleAction[];
  branches?: MemberRuleBranchItem[] | null;
  isActive: boolean;
  priority?: number | null;
  createdAt?: string;
  updatedAt?: string;
  executionCount?: number | null;
  lastRunAt?: string | null;
}

export interface CreateMemberAutomationRuleInput {
  name: string;
  description?: string | null;
  trigger: MemberRuleTrigger;
  conditionOperator?: string;
  conditions?: MemberRuleConditionInput[];
  actions: MemberRuleActionInput[];
  branches?: MemberRuleBranchItem[];
  isActive?: boolean;
  priority?: number;
}

export interface UpdateMemberAutomationRuleInput {
  name?: string;
  description?: string | null;
  trigger?: MemberRuleTrigger;
  conditionOperator?: string;
  conditions?: MemberRuleConditionInput[];
  actions?: MemberRuleActionInput[];
  branches?: MemberRuleBranchItem[];
  isActive?: boolean;
  priority?: number;
}

export const GET_MEMBER_AUTOMATION_RULES = gql`
  query GetMemberAutomationRules {
    getMemberAutomationRules {
      id
      entityId
      name
      description
      trigger
      conditionOperator
      conditions {
        field
        operator
        value
        branch
      }
      actions {
        type
        branch
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        tags
        notificationMessage
        pushTitle
        pushBody
        push
        points
        webhook {
          url
          method
          authType
          authToken
          authHeaderKey
          authHeaderValue
          headers { key value }
          mapping { field value }
          customBody
        }
      }
      branches {
        id
        name
        isDefault
        hasNoPath
      }
      isActive
      priority
      createdAt
      updatedAt
      executionCount
      lastRunAt
    }
  }
`;

export const GET_MEMBER_AUTOMATION_RULE = gql`
  query GetMemberAutomationRule($id: ID!) {
    getMemberAutomationRule(id: $id) {
      id
      entityId
      name
      description
      trigger
      conditionOperator
      conditions {
        field
        operator
        value
        branch
      }
      actions {
        type
        branch
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        tags
        notificationMessage
        pushTitle
        pushBody
        push
        points
        webhook {
          url
          method
          authType
          authToken
          authHeaderKey
          authHeaderValue
          headers { key value }
          mapping { field value }
          customBody
        }
      }
      branches {
        id
        name
        isDefault
        hasNoPath
      }
      isActive
      priority
      createdAt
      updatedAt
      executionCount
      lastRunAt
    }
  }
`;

export const CREATE_MEMBER_AUTOMATION_RULE = gql`
  mutation CreateMemberAutomationRule($input: CreateMemberAutomationRuleInput!) {
    createMemberAutomationRule(input: $input) {
      id
      entityId
      name
      description
      trigger
      conditionOperator
      conditions {
        field
        operator
        value
        branch
      }
      actions {
        type
        branch
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        tags
        notificationMessage
        pushTitle
        pushBody
        push
        points
        webhook {
          url
          method
          authType
          authToken
          authHeaderKey
          authHeaderValue
          headers { key value }
          mapping { field value }
          customBody
        }
      }
      branches {
        id
        name
        isDefault
        hasNoPath
      }
      isActive
      priority
      createdAt
    }
  }
`;

export const UPDATE_MEMBER_AUTOMATION_RULE = gql`
  mutation UpdateMemberAutomationRule(
    $id: ID!
    $input: UpdateMemberAutomationRuleInput!
  ) {
    updateMemberAutomationRule(id: $id, input: $input) {
      id
      entityId
      name
      description
      trigger
      conditionOperator
      conditions {
        field
        operator
        value
        branch
      }
      actions {
        type
        branch
        tierId
        tierName
        templateId
        templateName
        emailSubject
        emailBody
        communityId
        communityName
        tags
        notificationMessage
        pushTitle
        pushBody
        push
        points
        webhook {
          url
          method
          authType
          authToken
          authHeaderKey
          authHeaderValue
          headers { key value }
          mapping { field value }
          customBody
        }
      }
      branches {
        id
        name
        isDefault
        hasNoPath
      }
      isActive
      priority
      updatedAt
    }
  }
`;

export const TOGGLE_MEMBER_AUTOMATION_RULE = gql`
  mutation ToggleMemberAutomationRule($id: ID!, $isActive: Boolean!) {
    toggleMemberAutomationRule(id: $id, isActive: $isActive) {
      id
      isActive
    }
  }
`;

export const DELETE_MEMBER_AUTOMATION_RULE = gql`
  mutation DeleteMemberAutomationRule($id: ID!) {
    deleteMemberAutomationRule(id: $id)
  }
`;

export const REORDER_MEMBER_AUTOMATION_RULES = gql`
  mutation ReorderMemberAutomationRules($ruleIds: [ID!]!) {
    reorderMemberAutomationRules(ruleIds: $ruleIds)
  }
`;

export const GET_TRIGGER_AVAILABLE_FIELDS = gql`
  query GetTriggerAvailableFields($trigger: String!) {
    getTriggerAvailableFields(trigger: $trigger) {
      category
      key
      label
      path
      type
    }
  }
`;

export const TEST_AUTOMATION_WEBHOOK = gql`
  mutation TestAutomationWebhook($input: TestWebhookInput!) {
    testAutomationWebhook(input: $input) {
      success
      statusCode
      responseBody
      requestHeaders
      requestBody
      errorMessage
      latencyMs
    }
  }
`;
