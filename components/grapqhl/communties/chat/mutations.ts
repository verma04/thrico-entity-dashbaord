import { gql } from "@apollo/client";
import { MutationHookOptions, useMutation } from "@apollo/client/react";
import { CommunityChannel } from "../types";

export const CREATE_COMMUNITY_CHANNEL = gql`
  mutation CreateCommunityChannel($input: CreateCommunityChannelInput!) {
    createCommunityChannel(input: $input) {
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

export const UPDATE_COMMUNITY_CHANNEL = gql`
  mutation UpdateCommunityChannel($input: UpdateCommunityChannelInput!) {
    updateCommunityChannel(input: $input) {
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

export const PIN_COMMUNITY_CHANNEL = gql`
  mutation PinCommunityChannel($input: PinCommunityChannelInput!) {
    pinCommunityChannel(input: $input) {
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

export const DELETE_COMMUNITY_CHANNEL = gql`
  mutation DeleteCommunityChannel($input: DeleteCommunityChannelInput!) {
    deleteCommunityChannel(input: $input)
  }
`;

export const SEND_COMMUNITY_MESSAGE = gql`
  mutation SendCommunityMessage($input: SendCommunityMessageInput!) {
    sendCommunityMessage(input: $input) {
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
  }
`;

export interface CreateCommunityChannelInput {
  type: string;
  name: string;
  description?: string | null;
  communityId: string;
}

export const useCreateCommunityChannel = (
  options?: MutationHookOptions<
    { createCommunityChannel: CommunityChannel },
    { input: CreateCommunityChannelInput }
  >,
) => {
  return useMutation<
    { createCommunityChannel: CommunityChannel },
    { input: CreateCommunityChannelInput }
  >(CREATE_COMMUNITY_CHANNEL, options);
};

export const useUpdateCommunityChannel = (
  options?: MutationHookOptions<
    { updateCommunityChannel: CommunityChannel },
    { input: { channelId: string; name?: string; description?: string } }
  >,
) => {
  return useMutation<
    { updateCommunityChannel: CommunityChannel },
    { input: { channelId: string; name?: string; description?: string } }
  >(UPDATE_COMMUNITY_CHANNEL, options);
};

export const usePinCommunityChannel = (
  options?: MutationHookOptions<
    { pinCommunityChannel: CommunityChannel },
    { input: { channelId: string; isPinned: boolean } }
  >,
) => {
  return useMutation<
    { pinCommunityChannel: CommunityChannel },
    { input: { channelId: string; isPinned: boolean } }
  >(PIN_COMMUNITY_CHANNEL, options);
};

export const useDeleteCommunityChannel = (
  options?: MutationHookOptions<
    { deleteCommunityChannel: boolean },
    { input: { channelId: string } }
  >,
) => {
  return useMutation<
    { deleteCommunityChannel: boolean },
    { input: { channelId: string } }
  >(DELETE_COMMUNITY_CHANNEL, options);
};

export const JOIN_COMMUNITY_CHANNEL = gql`
  mutation JoinCommunityChannel($communityId: ID!, $channelId: ID!) {
    joinCommunityChannel(communityId: $communityId, channelId: $channelId)
  }
`;

export const useJoinCommunityChannel = (
  options?: MutationHookOptions<
    { joinCommunityChannel: boolean },
    { communityId: string; channelId: string }
  >,
) => {
  return useMutation<
    { joinCommunityChannel: boolean },
    { communityId: string; channelId: string }
  >(JOIN_COMMUNITY_CHANNEL, options);
};

export const useSendCommunityMessage = (
  options?: MutationHookOptions<
    { sendCommunityMessage: any },
    { input: { communityId: string; channelId: string; content: string; type?: string } }
  >,
) => {
  return useMutation<
    { sendCommunityMessage: any },
    { input: { communityId: string; channelId: string; content: string; type?: string } }
  >(SEND_COMMUNITY_MESSAGE, options);
};

export const SEND_COMMUNITY_THREAD_MESSAGE = gql`
  mutation SendCommunityThreadMessage($input: SendCommunityThreadMessageInput!) {
    sendCommunityThreadMessage(input: $input) {
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
  }
`;

export const useSendCommunityThreadMessage = (
  options?: MutationHookOptions<
    { sendCommunityThreadMessage: any },
    { input: { communityId: string; channelId: string; parentId: string; content: string; type?: string } }
  >,
) => {
  return useMutation<
    { sendCommunityThreadMessage: any },
    { input: { communityId: string; channelId: string; parentId: string; content: string; type?: string } }
  >(SEND_COMMUNITY_THREAD_MESSAGE, options);
};

export const REACT_TO_COMMUNITY_MESSAGE = gql`
  mutation ReactToCommunityMessage($input: ReactToCommunityMessageInput!) {
    reactToCommunityMessage(input: $input)
  }
`;

export const UNREACT_TO_COMMUNITY_MESSAGE = gql`
  mutation UnreactToCommunityMessage($input: ReactToCommunityMessageInput!) {
    unreactToCommunityMessage(input: $input)
  }
`;

interface ReactToCommunityMessageInput {
  communityId: string;
  channelId: string;
  messageId: string;
  emoji: string;
}

export const useReactToCommunityMessage = (
  options?: MutationHookOptions<
    { reactToCommunityMessage: boolean },
    { input: ReactToCommunityMessageInput }
  >,
) => {
  return useMutation<
    { reactToCommunityMessage: boolean },
    { input: ReactToCommunityMessageInput }
  >(REACT_TO_COMMUNITY_MESSAGE, options);
};

export const useUnreactToCommunityMessage = (
  options?: MutationHookOptions<
    { unreactToCommunityMessage: boolean },
    { input: ReactToCommunityMessageInput }
  >,
) => {
  return useMutation<
    { unreactToCommunityMessage: boolean },
    { input: ReactToCommunityMessageInput }
  >(UNREACT_TO_COMMUNITY_MESSAGE, options);
};

export const JOIN_CHANNEL_SESSION = gql`
  mutation JoinChannelSession($communityId: ID!, $channelId: ID!) {
    joinChannelSession(communityId: $communityId, channelId: $channelId)
  }
`;

export const useJoinChannelSession = (
  options?: MutationHookOptions<
    { joinChannelSession: boolean },
    { communityId: string; channelId: string }
  >,
) => {
  return useMutation<
    { joinChannelSession: boolean },
    { communityId: string; channelId: string }
  >(JOIN_CHANNEL_SESSION, options);
};



export const SEND_TYPING_INDICATOR = gql`
  mutation SendTypingIndicator($channelId: ID!) {
    sendTypingIndicator(channelId: $channelId)
  }
`;

export function useSendTypingIndicator() {
  return useMutation(SEND_TYPING_INDICATOR);
}
