import { gql } from "@apollo/client";

export const GET_FEED_SETTINGS = gql`
  query GetFeedSettings {
    getFeedSettings {
      allowEntityCommunityInFeed
      allowEntityDiscussionForumInFeed
      allowEntityPollsInFeed
      allowEntityFeedInFeed
      allowEntityMomentsInFeed
      feedOrder
      feedEntityName
    }
  }
`;
