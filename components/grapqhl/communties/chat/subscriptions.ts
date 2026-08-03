import { gql } from "@apollo/client";
import { useSubscription } from "@apollo/client/react";

export const MESSAGE_CREATED_SUBSCRIPTION = gql`
  subscription MessageCreated($channelId: ID!) {
    messageCreated(channelId: $channelId) {
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

export function useMessageCreatedSubscription(channelId: string) {
  return useSubscription(MESSAGE_CREATED_SUBSCRIPTION, {
    variables: { channelId },
    skip: !channelId,
  });
}

export const TYPING_INDICATOR_SUBSCRIPTION = gql`
  subscription TypingIndicator($channelId: ID!) {
    typingIndicator(channelId: $channelId) {
      userId
      channelId
    }
  }
`;

export function useTypingIndicatorSubscription(channelId: string) {
  return useSubscription(TYPING_INDICATOR_SUBSCRIPTION, {
    variables: { channelId },
    skip: !channelId,
  });
}
