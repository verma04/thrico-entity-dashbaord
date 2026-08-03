import { gql } from "@apollo/client";
import { QueryHookOptions, useQuery } from "@apollo/client/react";
import { CommunityChannel, CommunityMessage, CommunityChatPermissions } from "../types";

export const GET_COMMUNITY_CHAT_PERMISSIONS = gql`
  query GetCommunityChatPermissions($communityId: ID!) {
    getCommunityChatPermissions(communityId: $communityId) {
      canChat
      canAddChannel
      canDeleteChannel
      canPinChannel
      canDeleteMessage
      canUpdateSettings
      communityId
      communityName
      communityCover
    }
  }
`;

export interface CommunityChatPermissions {
  canChat: boolean;
  canAddChannel: boolean;
  canDeleteChannel: boolean;
  canPinChannel: boolean;
  canDeleteMessage: boolean;
  canUpdateSettings: boolean;
  communityId?: string;
  communityName?: string;
  communityCover?: string;
}

export const useGetCommunityChatPermissions = (
  options?: QueryHookOptions<
    { getCommunityChatPermissions: CommunityChatPermissions },
    { communityId: string }
  >,
) => {
  return useQuery<
    { getCommunityChatPermissions: CommunityChatPermissions },
    { communityId: string }
  >(GET_COMMUNITY_CHAT_PERMISSIONS, options);
};

export const GET_COMMUNITY_CHANNELS = gql`
  query GetCommunityChannels($communityId: ID!) {
    getCommunityChannels(communityId: $communityId) {
      id
      communityId
      name
      description
      type
      isPinned
      createdAt
      isMember
      memberCount
    }
  }
`;

export interface CommunityChannel {
  id: string;
  communityId: string;
  name: string;
  description?: string;
  type: string;
  isPinned?: boolean;
  createdAt: string;
  isMember?: boolean;
  memberCount?: number;
}

export const useGetCommunityChannels = (
  options?: QueryHookOptions<
    { getCommunityChannels: CommunityChannel[] },
    { communityId: string }
  >,
) => {
  return useQuery<
    { getCommunityChannels: CommunityChannel[] },
    { communityId: string }
  >(GET_COMMUNITY_CHANNELS, options);
};

export const GET_COMMUNITY_MESSAGES = gql`
  query GetCommunityMessages($communityId: ID!, $channelId: ID!, $limit: Int, $cursor: String) {
    getCommunityMessages(communityId: $communityId, channelId: $channelId, limit: $limit, cursor: $cursor) {
      messages {
        id
        communityId
        channelId
        senderId
        content
        type
        createdAt
        sender {
          id
          name
          avatar
        }
        permissions {
          canDelete
          canReact
          canReply
          canEdit
          isOwner
        }
        reactions {
          emoji
          count
          users
        }
        threadCount
        isPinned
      }
      nextCursor
      hasMore
    }
  }
`;

export interface CommunityMessage {
  id: string;
  communityId: string;
  channelId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar: string;
  };
  permissions: {
    canDelete: boolean;
    canReact: boolean;
    canReply: boolean;
    canEdit: boolean;
    isOwner: boolean;
  };
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  threadCount?: number;
  isPinned?: boolean;
}

export const useGetCommunityMessages = (
  options?: QueryHookOptions<
    { getCommunityMessages: { messages: CommunityMessage[]; nextCursor: string | null; hasMore: boolean } },
    { communityId: string; channelId: string; limit?: number; cursor?: string }
  >,
) => {
  return useQuery<
    { getCommunityMessages: { messages: CommunityMessage[]; nextCursor: string | null; hasMore: boolean } },
    { communityId: string; channelId: string; limit?: number; cursor?: string }
  >(GET_COMMUNITY_MESSAGES, options);
};

export const GET_COMMUNITY_THREAD_MESSAGES = gql`
  query GetCommunityThreadMessages($communityId: ID!, $parentId: ID!, $channelId: ID!, $limit: Int, $cursor: String) {
    getCommunityThreadMessages(communityId: $communityId, parentId: $parentId, channelId: $channelId, limit: $limit, cursor: $cursor) {
      messages {
        id
        communityId
        channelId
        senderId
        content
        type
        createdAt
        sender {
          id
          name
          avatar
        }
        permissions {
          canDelete
          canReact
          canReply
          canEdit
          isOwner
        }
        threadCount
        isPinned
      }
      nextCursor
      hasMore
    }
  }
`;

export const useGetCommunityThreadMessages = (
  options?: QueryHookOptions<
    { getCommunityThreadMessages: { messages: CommunityMessage[]; nextCursor: string | null; hasMore: boolean } },
    { communityId: string; channelId: string; parentId: string; limit?: number; cursor?: string }
  >,
) => {
  return useQuery<
    { getCommunityThreadMessages: { messages: CommunityMessage[]; nextCursor: string | null; hasMore: boolean } },
    { communityId: string; channelId: string; parentId: string; limit?: number; cursor?: string }
  >(GET_COMMUNITY_THREAD_MESSAGES, options);
};

export const GET_COMMUNITY_CHANNEL_DETAILS = gql`
  query GetCommunityChannelDetails($communityId: ID!, $channelId: ID!) {
    getCommunityChannelDetails(communityId: $communityId, channelId: $channelId) {
      id
      communityId
      name
      description
      type
      isPinned
      createdAt
      isMember
      memberCount
      canDelete
      canMessage
    }
  }
`;

export interface ChannelDetails {
  id: string;
  communityId: string;
  name: string;
  description: string;
  type: string;
  isPinned: boolean;
  createdAt: string;
  isMember: boolean;
  memberCount: number;
  canDelete: boolean;
  canMessage: boolean;
}

export const useGetCommunityChannelDetails = (
  options?: QueryHookOptions<
    { getCommunityChannelDetails: ChannelDetails },
    { communityId: string; channelId: string }
  >,
) => {
  return useQuery<{ getCommunityChannelDetails: ChannelDetails }, { communityId: string; channelId: string }>(
    GET_COMMUNITY_CHANNEL_DETAILS,
    options,
  );
};

export const GET_COMMUNITY_UNREAD_COUNTS = gql`
  query GetCommunityUnreadCounts($communityId: ID!) {
    getCommunityUnreadCounts(communityId: $communityId) {
      channelId
      count
    }
  }
`;

export interface ChannelUnreadCount {
  channelId: string;
  count: number;
}

export const useGetCommunityUnreadCounts = (
  options?: QueryHookOptions<
    { getCommunityUnreadCounts: ChannelUnreadCount[] },
    { communityId: string }
  >,
) => {
  return useQuery<{ getCommunityUnreadCounts: ChannelUnreadCount[] }, { communityId: string }>(
    GET_COMMUNITY_UNREAD_COUNTS,
    options,
  );
};
