import { gql } from "@apollo/client";

export type MemberRuleTrigger =
  | "MEMBER_JOINED"
  | "MEMBER_VERIFIED"
  | "MEMBER_APPROVED";

export type MemberRuleActionType =
  | "ASSIGN_MEMBERSHIP_TIER"
  | "EMAIL"
  | "NOTIFICATION"
  | "COMMUNITY_JOIN"
  | "ADD_MEMBER_TAG";

export interface MemberRuleCondition {
  field: string;
  operator: string;
  value: any;
}

export interface MemberRuleConditionInput {
  field: string;
  operator: string;
  value: any;
}

export interface MemberRuleAction {
  type: MemberRuleActionType;
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
}

export interface MemberRuleActionInput {
  type: MemberRuleActionType;
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
  isActive: boolean;
  priority?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMemberAutomationRuleInput {
  name: string;
  description?: string | null;
  trigger: MemberRuleTrigger;
  conditionOperator?: string;
  conditions?: MemberRuleConditionInput[];
  actions: MemberRuleActionInput[];
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
      }
      isActive
      priority
      createdAt
      updatedAt
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
      }
      isActive
      priority
      createdAt
      updatedAt
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
