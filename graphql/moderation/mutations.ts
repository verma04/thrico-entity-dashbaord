import { gql } from "@apollo/client";

export const ADD_BANNED_WORD = gql`
  mutation AddBannedWord(
    $word: String!
    $severity: Severity!
    $category: String
  ) {
    addBannedWord(word: $word, severity: $severity, category: $category) {
      id
      word
      severity
      category
      isActive
    }
  }
`;

export const UPDATE_BANNED_WORD = gql`
  mutation UpdateBannedWord(
    $id: ID!
    $word: String
    $severity: Severity
    $category: String
    $isActive: Boolean
  ) {
    updateBannedWord(
      id: $id
      word: $word
      severity: $severity
      category: $category
      isActive: $isActive
    ) {
      id
      word
      severity
      category
      isActive
    }
  }
`;

export const DELETE_BANNED_WORD = gql`
  mutation DeleteBannedWord($id: ID!) {
    deleteBannedWord(id: $id)
  }
`;

export const ADD_BLOCKED_LINK = gql`
  mutation AddBlockedLink(
    $url: String!
    $type: LinkType!
    $isBlocked: Boolean!
    $reason: String
  ) {
    addBlockedLink(
      url: $url
      type: $type
      isBlocked: $isBlocked
      reason: $reason
    ) {
      id
      url
      type
      isBlocked
      reason
    }
  }
`;

export const UPDATE_BLOCKED_LINK = gql`
  mutation UpdateBlockedLink(
    $id: ID!
    $url: String
    $type: LinkType
    $isBlocked: Boolean
    $reason: String
  ) {
    updateBlockedLink(
      id: $id
      url: $url
      type: $type
      isBlocked: $isBlocked
      reason: $reason
    ) {
      id
      url
      type
      isBlocked
      reason
    }
  }
`;

export const DELETE_BLOCKED_LINK = gql`
  mutation DeleteBlockedLink($id: ID!) {
    deleteBlockedLink(id: $id)
  }
`;

export const RESOLVE_REPORT = gql`
  mutation ResolveReport($id: ID!, $action: String!) {
    resolveReport(id: $id, action: $action) {
      id
      status
    }
  }
`;

export const DISMISS_REPORT = gql`
  mutation DismissReport($id: ID!) {
    dismissReport(id: $id) {
      id
      status
    }
  }
`;

export const UPDATE_MODERATION_SETTINGS = gql`
  mutation UpdateModerationSettings($input: ModerationSettingsInput!) {
    updateModerationSettings(input: $input) {
      id
      autoModerationEnabled
      bannedWordsAction
      blockedLinksAction
      spamDetectionEnabled
      spamThreshold
      autoFlagThreshold
      autoHideThreshold
      aiClassificationDefinitions
    }
  }
`;
