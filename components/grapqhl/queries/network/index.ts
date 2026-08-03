const details = `
   id
      firstName
      lastName
      avatar
      status
      user {
        about {
          about
          bio
          currentPosition
          instagram
          linkedin
          portfolio
        }
        profile {
          education {
            id
            school
            degree
            grade
            activities
            description
            duration
          }
          experience {
            id
            companyName
            duration
            employmentType
            location
            locationType
            title
          }
        }
        lastName
        isOnline
        firstName
        avatar
      }
      activity {
        id
        repostId
        source
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
        marketPlace {
          category
          condition
          description
          createdAt
          location {
            logo
            name
            state
            country
          }
          price
          media
          title
        }
        group {
          id
          cover
          title
        }
        job {
          createdAt
          id
          title
          company {
            name
            logo
          }
          salary
          description
          location {
            country
            state
            name
          }
          jobType
          workplaceType
        }
        user {
          id
          about {
            currentPosition
          }
          avatar
          firstName
          lastName
        }
      
    }
`;

import { gql } from "@apollo/client";
import { privacy } from "../feed";

export const GET_NETWORK = gql`
  query GetNetwork {
    getNetwork {
      avatar
      firstName
      lastName
      isOnline
      designation
      id
      status
      cover
    }
  }
`;

export const SEND_CONNECTION = gql`
  mutation ConnectAsConnection($input: inputId) {
    connectAsConnection(input: $input) {
      id
      status
    }
  }
`;

export const ACCEPT_CONNECTION = gql`
  mutation AcceptConnection($input: inputId) {
    acceptConnection(input: $input) {
      id
      status
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query GetUserDetails($input: inputId) {
    getUserDetails(input: $input) {
      ${details}
    }
  }
`;

export const GET_MY_CONNECTION = gql`
  query GetMyConnection($input: NetworkCursorInput) {
    getMyConnection(input: $input) {
      edges {
        cursor
        node {
          id
          firstName
          lastName
          avatar
          designation
          isOnline
          status
          cover
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_NETWORK_USER_PROFILE = gql`
  query GetNetworkUserProfile($input: inputId) {
    getNetworkUserProfile(input: $input) {
      id
      firstName
      lastName
      avatar
      status
      designation
      cover
      isFollowing
      numberOfConnections
      isCloseFriend
      connectedAt
    }
  }
`;

export const GET_CONNECTION_REQUESTS = gql`
  query GetConnectionRequests($input: NetworkCursorInput) {
    getConnectionRequests(input: $input) {
      edges {
        cursor
        node {
          id
          senderId
          receiverId
          status
          createdAt
          firstName
          lastName
          avatar
          designation
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_BLOCKED_USERS = gql`
  query GetBlockedUsers($input: NetworkCursorInput) {
    getBlockedUsers(input: $input) {
      edges {
        cursor
        node {
          id
          firstName
          lastName
          avatar
          blockedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_CONNECTION_STATS = gql`
  query GetConnectionStats {
    getConnectionStats {
      totalConnections
      pendingRequests
    }
  }
`;

export const GET_CLOSE_FRIENDS = gql`
  query GetCloseFriends($input: NetworkCursorInput) {
    getCloseFriends(input: $input) {
      edges {
        cursor
        node {
          id
          firstName
          lastName
          avatar
          designation
          isOnline
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_MEMBER_BIRTHDAYS = gql`
  query GetMemberBirthdays($input: BirthdayCursorInput) {
    getMemberBirthdays(input: $input) {
      edges {
        cursor
        node {
          id
          firstName
          lastName
          avatar
          designation
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const REJECT_CONNECTION = gql`
  mutation RejectConnection($input: inputId) {
    rejectConnection(input: $input) {
      id
      status
    }
  }
`;

export const WITHDRAW_CONNECTION = gql`
  mutation WithdrawConnection($input: inputId) {
    withdrawConnection(input: $input) {
      id
      status
    }
  }
`;

export const REMOVE_CONNECTION = gql`
  mutation RemoveConnection($input: inputId) {
    removeConnection(input: $input) {
      id
      status
    }
  }
`;

export const REPORT_PROFILE = gql`
  mutation ReportProfile($input: reportProfileInput) {
    reportProfile(input: $input) {
      success
      message
    }
  }
`;

export const BLOCK_USER = gql`
  mutation BlockUser($input: blockUserInput) {
    blockUser(input: $input) {
      success
      message
    }
  }
`;

export const UNBLOCK_USER = gql`
  mutation UnblockUser($input: blockUserInput) {
    unblockUser(input: $input) {
      success
      message
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($input: followUserInput) {
    followUser(input: $input) {
      success
      message
      id
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($input: followUserInput) {
    unfollowUser(input: $input) {
      success
      message
      id
    }
  }
`;

export const ADD_TO_CLOSE_FRIEND = gql`
  mutation AddToCloseFriend($input: inputId) {
    addToCloseFriend(input: $input) {
      success
      message
      id
    }
  }
`;

export const REMOVE_FROM_CLOSE_FRIEND = gql`
  mutation RemoveFromCloseFriend($input: inputId) {
    removeFromCloseFriend(input: $input) {
      success
      message
      id
    }
  }
`;
