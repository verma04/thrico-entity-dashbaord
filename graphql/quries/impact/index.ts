import { gql } from "@apollo/client";

// Impact Templates Queries
export const GET_IMPACT_TEMPLATES = gql`
  query GetImpactTemplates {
    impactTemplates {
      id
      entityId
      name
      minScore
      maxScore
      defaultScore
      activityWindowDays
      refreshFrequency
      decayEnabled
      decayPenalty
      isActive
      createdAt
    }
  }
`;

export const GET_IMPACT_RULES = gql`
  query GetImpactRules {
    impactRules {
      id

      module
      action
      category
      points
      dailyLimit
      formula
      enabled
      createdAt
    }
  }
`;

export const GET_IMPACT_RULE_BY_ID = gql`
  query GetImpactRuleById($id: ID!) {
    getImpactRuleById(id: $id) {
      id
      templateId
      module
      action
      category
      points
      dailyLimit
      formula
      enabled
      createdAt
    }
  }
`;

// Impact Templates Mutations
export const CREATE_IMPACT_TEMPLATE = gql`
  mutation CreateImpactTemplate($input: CreateImpactTemplateInput!) {
    createImpactTemplate(input: $input) {
      id
      entityId
      name
      minScore
      maxScore
      defaultScore
      activityWindowDays
      refreshFrequency
      decayEnabled
      decayPenalty
      isActive
      createdAt
    }
  }
`;

// Impact Rules Mutations
export const CREATE_IMPACT_RULE = gql`
  mutation CreateImpactRule($input: CreateImpactRuleInput!) {
    createImpactRule(input: $input) {
      id
      module
      action
      points
      category
    }
  }
`;

export const GET_IMPACT_ACTIVITY_LOG = gql`
  query GetImpactActivityLog($input: ImpactActivityLogInput) {
    getImpactActivityLog(input: $input) {
      id
      user {
        id
        firstName
        lastName
        avatarUrl
      }
      oldScore
      newScore
      changeAmount
      changeReason
      createdAt
    }
  }
`;
export const TOGGLE_IMPACT_RULE = gql`
  mutation ToggleImpactRule($id: ID!, $enabled: Boolean!) {
    toggleImpactRule(id: $id, enabled: $enabled) {
      id
      enabled
    }
  }
`;

export const GET_IMPACT_USERS = gql`
  query GetImpactUsers($input: ImpactUsersInput) {
    getImpactUsers(input: $input) {
      totalCount
      nodes {
        id
        user {
          id
          firstName
          lastName
          avatarUrl
        }
        score
        engagementScore
        contributionScore
        trustScore
        networkScore
        consistencyScore
        tier
        lastCalculatedAt
      }
    }
  }
`;
