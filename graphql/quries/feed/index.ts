import { gql } from "@apollo/client";
export const FEED = `
   
     
`;

export const NUMBER_OF_FEED = gql`
  query Query {
    numberOfFeeds
  }
`;
export const GET_ALL_FEED = gql`
  query GetAllFeed($input: pagination) {
    getAllFeed(input: $input) {
      id
      source
      privacy
      isLiked
      isWishList
      isOwner
      media
      totalComment
      totalReactions
      totalReShare
      addedBy
      description
      createdAt
      poll {
        id
        title
      }
      user {
        id
        firstName
        avatar
        lastName
        about {
          currentPosition
        }
        isOnline
        cover
      }
    }
  }
`;

export const ADD_FEED = gql`
  mutation AddFeed($input: inputAddFeed) {
    addFeed(input: $input) {
      id
      source
      addedBy
      privacy
      isLiked
      isWishList
      isOwner
      media
      totalComment
      totalReactions
      totalReShare
      description
      createdAt
      user {
        id
        firstName
        avatar
        lastName
        about {
          currentPosition
        }
        isOnline
        cover
      }
    }
  }
`;

export const LIKE_FEED = gql`
  mutation likeFeed($input: inputId) {
    likeFeed(input: $input) {
      status
    }
  }
`;
export const ADD_COMMENT = gql`
  mutation AddComment($input: inputComment) {
    addComment(input: $input) {
      id
      content
      createdAt
      user {
        id
        firstName
        avatar
        lastName
        about {
          currentPosition
        }
        isOnline
        cover
      }
      addedBy
      feedId
    }
  }
`;

export const GET_FEED_COMMENTS = gql`
  query GetFeedComment($input: inputId) {
    getFeedComment(input: $input) {
      id
      content
      createdAt
      feedId
      user {
        id
        firstName
        avatar
        lastName
        about {
          currentPosition
        }
        isOnline
        cover
      }
      addedBy
    }
  }
`;
export const DELETE_COMMENT_FEED = gql`
  mutation DeleteCommentFeed($input: inputDeleteFeedComment) {
    deleteCommentFeed(input: $input) {
      id
      feedId
    }
  }
`;
