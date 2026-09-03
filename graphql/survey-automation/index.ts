import { gql } from "@apollo/client";

export type SurveyRuleTrigger =
  | "SURVEY_SUBMITTED"
  | "SURVEY_CREATED"
  | "SURVEY_COMPLETED";

export type SurveyRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG"
  | "WHATSAPP_TEMPLATE";

export interface SurveyRuleCondition {
  field: string;
  operator: string;
  value: any;
}

export interface SurveyRuleConditionInput {
  field: string;
  operator: string;
  value: any;
}

export interface SurveyRuleAction {
  type: SurveyRuleActionType;
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
  conditions?: SurveyRuleCondition[] | null;
  whatsAppTemplateName?: string | null;
  whatsAppLanguage?: string | null;
  whatsAppVariables?: string[] | null;
  fallbackToEmail?: boolean | null;
  fallbackChannel?: string | null;
  fallbackEmailSubject?: string | null;
  fallbackEmailBody?: string | null;
}

export interface SurveyRuleActionInput {
  type: SurveyRuleActionType;
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
  conditionOperator?: "AND" | "OR" | string | null;
  conditions?: SurveyRuleConditionInput[] | null;
  whatsAppTemplateName?: string | null;
  whatsAppLanguage?: string | null;
  whatsAppVariables?: string[] | null;
  fallbackToEmail?: boolean | null;
  fallbackChannel?: string | null;
  fallbackEmailSubject?: string | null;
  fallbackEmailBody?: string | null;
}

export interface SurveyAutomationRule {
  id: string;
  entityId: string;
  surveyId?: string | null;
  surveyName?: string | null;
  name: string;
  description?: string | null;
  trigger: SurveyRuleTrigger;
  conditionOperator?: "AND" | "OR" | string;
  conditions?: SurveyRuleCondition[] | null;
  actions: SurveyRuleAction[];
  isActive: boolean;
  priority?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSurveyAutomationRuleInput {
  surveyId?: string | null;
  name: string;
  description?: string | null;
  trigger: SurveyRuleTrigger;
  conditionOperator?: string;
  conditions?: SurveyRuleConditionInput[];
  actions: SurveyRuleActionInput[];
  isActive?: boolean;
  priority?: number;
}

export interface UpdateSurveyAutomationRuleInput {
  surveyId?: string | null;
  name?: string;
  description?: string | null;
  trigger?: SurveyRuleTrigger;
  conditionOperator?: string;
  conditions?: SurveyRuleConditionInput[];
  actions?: SurveyRuleActionInput[];
  isActive?: boolean;
  priority?: number;
}

export const GET_SURVEY_AUTOMATION_RULES = gql`
  query GetSurveyAutomationRules($surveyId: ID) {
    getSurveyAutomationRules(surveyId: $surveyId) {
      id
      entityId
      surveyId
      surveyName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
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
        conditionOperator
        conditions {
          field
          operator
          value
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_SURVEY_AUTOMATION_RULE = gql`
  query GetSurveyAutomationRule($id: ID!) {
    getSurveyAutomationRule(id: $id) {
      id
      entityId
      surveyId
      surveyName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
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
        conditionOperator
        conditions {
          field
          operator
          value
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SURVEY_AUTOMATION_RULE = gql`
  mutation CreateSurveyAutomationRule($input: CreateSurveyAutomationRuleInput!) {
    createSurveyAutomationRule(input: $input) {
      id
      entityId
      surveyId
      surveyName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
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
        conditionOperator
        conditions {
          field
          operator
          value
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SURVEY_AUTOMATION_RULE = gql`
  mutation UpdateSurveyAutomationRule(
    $id: ID!
    $input: UpdateSurveyAutomationRuleInput!
  ) {
    updateSurveyAutomationRule(id: $id, input: $input) {
      id
      entityId
      surveyId
      surveyName
      name
      description
      trigger
      conditionOperator
      isActive
      priority
      conditions {
        field
        operator
        value
      }
      actions {
        type
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
        conditionOperator
        conditions {
          field
          operator
          value
        }
      }
      updatedAt
    }
  }
`;

export const TOGGLE_SURVEY_AUTOMATION_RULE = gql`
  mutation ToggleSurveyAutomationRule($id: ID!, $isActive: Boolean!) {
    toggleSurveyAutomationRule(id: $id, isActive: $isActive) {
      id
      isActive
      updatedAt
    }
  }
`;

export const DELETE_SURVEY_AUTOMATION_RULE = gql`
  mutation DeleteSurveyAutomationRule($id: ID!) {
    deleteSurveyAutomationRule(id: $id)
  }
`;

export const REORDER_SURVEY_AUTOMATION_RULES = gql`
  mutation ReorderSurveyAutomationRules($ruleIds: [ID!]!) {
    reorderSurveyAutomationRules(ruleIds: $ruleIds)
  }
`;
