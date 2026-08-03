import { gql } from "@apollo/client";
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import type { QueryHookOptions, MutationHookOptions, SubscriptionHookOptions } from "@apollo/client/react";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SenderDetails {
  firstName: string;
  avatar: string;
  lastName: string;
}

export interface Sender {
  id: string;
  user: SenderDetails;
}

export interface InboxMessage {
  id: string;
  content: string;
  messageType: string;
  senderType: string;
  createdAt: string;
}

export interface InboxNode {
  id: string;
  chatId: string;
  sender: Sender;
  message: InboxMessage;
  isOnline: boolean;
  lastActive: string;
  unreadCount: number;
}

export interface InboxEdge {
  cursor: string;
  node: InboxNode;
}

export interface InboxPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface InboxConnection {
  edges: InboxEdge[];
  pageInfo: InboxPageInfo;
}

export interface InboxInput {
  first?: number | null;
  after?: string | null;
  category?: "CONNECTION" | "MARKETPLACE" | "MENTORSHIP" | "ALL" | null;
  filter?: "ALL" | "UNREAD" | "ONLINE" | null;
}

// Messages types
export interface ChatMessageNode {
  id: string;
  content: string;
  sender: Sender;
  senderId: string;
  messageType: string;
  senderType: string;
  isOwnMessage: boolean;
  createdAt: string;
}

export interface MessageEdge {
  cursor: string;
  node: ChatMessageNode;
}

export interface MessagesConnection {
  edges: MessageEdge[];
  pageInfo: InboxPageInfo;
}

// Chat Profile
export interface ChatProfileUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface ChatProfile {
  chatId: string;
  chatType: string;
  user: ChatProfileUser;
  isOnline: boolean;
  lastActive: string;
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    slug: string;
    isSold: boolean;
    image: string;
  } | null;
}

export interface SearchConnectionResult {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface ChatUserDetails {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
  isOnline: boolean;
  lastOnline: string;
  isConnected: boolean;
  connectedSince: string;
  canMessage: boolean;
}

export interface SearchConnectionEdge {
  node: SearchConnectionResult;
}

export interface SearchConnectionsConnection {
  edges: SearchConnectionEdge[];
  pageInfo: InboxPageInfo;
}

export interface SearchConnectionsInput {
  search?: string | null;
  limit?: number | null;
  cursor?: string | null;
}

// ─── Queries ────────────────────────────────────────────────────────────────────

export const GET_INBOX = gql`
  query GetInbox($input: InboxInput) {
    getInbox(input: $input) {
      edges {
        cursor
        node {
          id
          chatId
          sender {
            id
            user {
              firstName
              avatar
              lastName
            }
          }
          message {
            id
            content
            messageType
            senderType
            createdAt
          }
          isOnline
          lastActive
          unreadCount
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_ALL_MESSAGES = gql`
  query GetAllMessages($input: MessagesInput!) {
    getAllMessages(input: $input) {
      edges {
        cursor
        node {
          id
          content
          sender {
            id
            user {
              firstName
              avatar
              lastName
            }
          }
          senderId
          messageType
          senderType
          isOwnMessage
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CHAT_PROFILE = gql`
  query GetChatProfile($chatId: ID!) {
    getChatProfile(chatId: $chatId) {
      chatId
      chatType
      user {
        id
        firstName
        lastName
        avatar
        headline
      }
      isOnline
      lastActive
      listing {
        id
        title
        price
        currency
        slug
        isSold
        image
      }
    }
  }
`;

export const GET_CHAT_USER = gql`
  query GetChatUser($userId: ID!) {
    getChatUser(userId: $userId) {
      id
      firstName
      lastName
      avatar
      headline
      isOnline
      lastOnline
      isConnected
      connectedSince
      canMessage
    }
  }
`;

export const SEARCH_CONNECTIONS = gql`
  query SearchConnections($input: SearchConnectionsInput!) {
    searchConnections(input: $input) {
      edges {
        node {
          id
          userId
          firstName
          lastName
          avatar
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ─── Mutations ──────────────────────────────────────────────────────────────────

export const START_CHAT = gql`
  mutation StartChat($input: chatID) {
    startChat(input: $input) {
      id
      chatType
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessageInChat($input: inputSendMessage) {
    sendMessageInChat(input: $input) {
      id
      content
      sender {
        id
        user {
          firstName
          avatar
          lastName
        }
      }
      senderId
      messageType
      senderType
      isOwnMessage
      createdAt
    }
  }
`;

// ─── Subscriptions ──────────────────────────────────────────────────────────────

export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessage($id: ID!) {
    message(id: $id) {
      id
      content
      sender {
        id
        user {
          firstName
          avatar
          lastName
        }
      }
      senderId
      messageType
      senderType
      isOwnMessage
      createdAt
    }
  }
`;

// ─── Hooks ──────────────────────────────────────────────────────────────────────

export const useGetInbox = (
  options?: QueryHookOptions<
    { getInbox: InboxConnection },
    { input?: InboxInput }
  >
) => {
  return useQuery<{ getInbox: InboxConnection }, { input?: InboxInput }>(
    GET_INBOX,
    options
  );
};

export const useGetAllMessages = (
  options?: QueryHookOptions<
    { getAllMessages: MessagesConnection },
    { input: { id: string; first?: number; after?: string } }
  >
) => {
  return useQuery<
    { getAllMessages: MessagesConnection },
    { input: { id: string; first?: number; after?: string } }
  >(GET_ALL_MESSAGES, options);
};

export const useGetChatProfile = (
  options?: QueryHookOptions<
    { getChatProfile: ChatProfile },
    { chatId: string }
  >
) => {
  return useQuery<{ getChatProfile: ChatProfile }, { chatId: string }>(
    GET_CHAT_PROFILE,
    options
  );
};

export const useGetChatUser = (
  options?: QueryHookOptions<
    { getChatUser: ChatUserDetails },
    { userId: string }
  >
) => {
  return useQuery<{ getChatUser: ChatUserDetails }, { userId: string }>(
    GET_CHAT_USER,
    options
  );
};

export const useSearchConnections = (
  options?: QueryHookOptions<
    { searchConnections: SearchConnectionsConnection },
    { input: SearchConnectionsInput }
  >
) => {
  return useQuery<
    { searchConnections: SearchConnectionsConnection },
    { input: SearchConnectionsInput }
  >(SEARCH_CONNECTIONS, options);
};

export const useStartChat = (
  options?: MutationHookOptions<
    { startChat: { id: string; chatType: string } },
    { input: { userID?: string; chatType?: string } }
  >
) => {
  return useMutation<
    { startChat: { id: string; chatType: string } },
    { input: { userID?: string; chatType?: string } }
  >(START_CHAT, options);
};

export const useSendMessage = (
  options?: MutationHookOptions<
    { sendMessageInChat: ChatMessageNode },
    { input: { chatId: string; content: string } }
  >
) => {
  return useMutation<
    { sendMessageInChat: ChatMessageNode },
    { input: { chatId: string; content: string } }
  >(SEND_MESSAGE, options);
};

export const useMessageSubscription = (
  chatId: string,
  options?: SubscriptionHookOptions<
    { message: ChatMessageNode },
    { id: string }
  >
) => {
  return useSubscription<{ message: ChatMessageNode }, { id: string }>(
    MESSAGE_SUBSCRIPTION,
    {
      variables: { id: chatId },
      skip: !chatId,
      ...options,
    }
  );
};

export const GET_UNREAD_MESSAGE_COUNT = gql`
  query GetUnreadMessageCount {
    getUnreadMessageCount
  }
`;

export const useGetUnreadMessageCount = (
  options?: QueryHookOptions<{ getUnreadMessageCount: number }, any>
) => {
  return useQuery<{ getUnreadMessageCount: number }, any>(
    GET_UNREAD_MESSAGE_COUNT,
    options
  );
};

export const MARK_ALL_MESSAGES_AS_READ = gql`
  mutation MarkAllMessagesAsRead {
    markAllMessagesAsRead
  }
`;

export const useMarkAllMessagesAsRead = (
  options?: MutationHookOptions<{ markAllMessagesAsRead: boolean }, any>
) => {
  return useMutation<{ markAllMessagesAsRead: boolean }, any>(
    MARK_ALL_MESSAGES_AS_READ,
    options
  );
};
