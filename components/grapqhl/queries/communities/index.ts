import { gql } from "@apollo/client";

export const CREATE_GROUP = gql`
  mutation CreateGroup($input: addGroup) {
    createGroup(input: $input) {
      id
      slug
      title
    }
  }
`;

export const GET_GROUP = gql`
  query getAllCommunities {
    getAllCommunities {
      isFeatured
      isWishList
      isTrending
      status
      id
      role
      groupSettings {
        groupType
        joiningCondition
        privacy
      }
      group {
        title
        cover
        slug
        numberOfUser
        numberOfLikes
        numberOfPost
        numberOfViews
        privacy
      }
    }
  }
`;

export const GET_FEATURED_GROUP = gql`
  query Data($input: inputGetGroup) {
    getFeaturedGroup(input: $input) {
      totalRecords
      data {
        title
        cover
        id
        slug
        total
        about
        privacy
        numberOfUser
        numberOfLikes
        isFeatured
        isTrending
        numberOfViews
        numberOfPost
        isGroupMember
        isJoinRequest
        groupSettings {
          groupType
          joiningCondition
          privacy
        }
      }
    }
  }
`;
export const GET_GROUP_TYPE = gql`
  query Query {
    getGroupModeType
  }
`;
export const GET_GROUP_BY_SLUG = gql`
  query GetGroupBySlug($input: slug!) {
    getGroupBySlug(input: $input) {
      about
      id
      isGroupMember
      isJoinRequest
      isGroupAdmin
      groupMember {
        id
        user {
          avatar
          # aboutUser {
          #   currentPosition
          # }
        }
      }
      admin {
        firstName
        lastName
        avatar
      }
      cover
      title
      slug
      total
      privacy
    }
  }
`;

export const GET_GROUP_BY_PEOPLE = gql`
  query GetGroupBySlug($input: slug!) {
    getGroupBySlugPeople(input: $input) {
      firstName
      lastName
      memberSince
      role
      id
      # aboutAlumni {
      #   currentPosition
      # }
    }
  }
`;

export const ADD_GROUP_FEED = gql`
  mutation AddFeedGroup($input: groupFeed) {
    addFeedGroup(input: $input) {
      id
      media {
        id
        url
      }
      createdAt
      description
      group {
        cover
        title
      }
      user {
        lastName
        firstName
        avatar
      }
      reactions {
        type
        user {
          id
          firstName
          lastName
          memberSince
          # aboutAlumni {
          #   currentPosition
          # }
          avatar
        }
      }
    }
  }
`;

export const GET_GROUP_FEED = gql`
  query GetGroupFeed($input: typeid!) {
    getGroupFeed(input: $input) {
      id
      media {
        id
        url
      }
      description
      createdAt
      user {
        id
        firstName
        lastName
        avatar
      }
      reactions {
        type
        user {
          id
          firstName
          lastName

          # aboutAlumni {
          #   currentPosition
          # }

          avatar
        }
      }
    }
  }
`;
export const ALL_ALUMNI_FEED = gql`
  query GetAllAlumniFeed {
    getAllAlumniFeed {
      id
      createdAt
      description
      media {
        id
        url
      }
      group {
        cover
        name
      }
      user {
        lastName
        firstName
        avatar
      }
      reactions {
        type
        user {
          id
          firstName
          lastName
          memberSince
          # aboutAlumni {
          #   currentPosition
          # }
          avatar
        }
      }
    }
  }
`;

export const LIKE_FEED = gql`
  mutation Mutation($input: likeFeed) {
    likeFeed(input: $input) {
      type
      user {
        id
        firstName
        lastName

        # aboutAlumni {
        #   currentPosition
        # }
        avatar
      }
    }
  }
`;

export const GROUP_PEOPLE = gql`
  query GetAllGroupPeople($input: typeid!) {
    getAllGroupPeople(input: $input) {
      id
      role
      user {
        id
        firstName
        lastName
        memberSince
        # aboutAlumni {
        #   currentPosition
        # }
        avatar
      }
    }
  }
`;

export const JOIN_GROUP = gql`
  mutation JoinGroup($input: acceptInvitation) {
    joinGroup(input: $input) {
      id
      isGroupMember
      isJoinRequest
    }
  }
`;

export const GROUP_REQUEST = gql`
  query getAllGroupRequest($input: typeid!) {
    getAllGroupRequest(input: $input) {
      id
      role
      user {
        id
        firstName
        lastName
        memberSince
        # aboutAlumni {
        #   currentPosition
        # }
        avatar
      }
    }
  }
`;
export const GROUP_EVENTS = gql`
  query Query($input: typeid!) {
    getAllGroupEvents(input: $input) {
      details
      eventEndTime
      eventStartTime
      eventType
      eventVisibility
      cover
      name
      registrationEndDate
      venue
      slug
      eventHost {
        id
        avatar
        firstName
        lastName
        # aboutAlumni {
        #   currentPosition
        # }
      }
      eventsPayments {
        eventCost
      }
    }
  }
`;

export const GROUP_THEME = gql`
  query GetGroupTheme {
    getGroupTheme {
      id
      title
    }
  }
`;

export const GROUP_INTERESTS = gql`
  query getGroupInterests {
    getGroupInterests {
      id
      title
    }
  }
`;

export const PRIVACY_ENUM = gql`
  query Query {
    getGroupPrivacyEnum
  }
`;

export const GET_RECOMMENDATION = gql`
  query GetGroupsRecommendation {
    getGroupsRecommendation {
      about
      id
      numberOfLikes
      numberOfPost
      numberOfUser
      numberOfViews
      privacy
      slug
      title
      groupSettings {
        groupType
        joiningCondition
      }
      cover
      isGroupAdmin
      isGroupMember
      isJoinRequest
    }
  }
`;

export const COMMUNITY_MEMBER = gql`
  query getCommunitiesMember($input: inputId) {
    getCommunitiesMember(input: $input) {
      member
      total
    }
  }
`;

export const CREATE_COMMUNITIES = gql`
  mutation CreateCommunities($input: addGroup) {
    createCommunities(input: $input) {
      id
    }
  }
`;

export const GET_FEATURED_COMMUNITIES = gql`
  query getFeaturedCommunities {
    getFeaturedCommunities {
      isFeatured
      isWishList
      isTrending
      status
      groupStatus
      id
      role
      groupSettings {
        groupType
        joiningCondition
        privacy
      }
      group {
        about
        title
        cover
        slug
        numberOfUser
        numberOfLikes
        numberOfPost
        numberOfViews
        privacy
      }
    }
  }
`;

export const JOIN_COMMUNITIES = gql`
  mutation joinCommunity($input: inputId) {
    joinCommunity(input: $input) {
      id
      status
    }
  }
`;

export const WISHLIST_COMMUNITY = gql`
  mutation WishListCommunity($input: inputId) {
    wishListCommunity(input: $input) {
      status
    }
  }
`;

export const GET_COMMUNITIES_DETAILS = gql`
  query GetCommunityDetails($input: inputId) {
    getCommunityDetails(input: $input) {
      isFeatured
      isWishList
      isTrending
      status
      id
      role
      groupSettings {
        groupType
        joiningCondition
        privacy
      }
      group {
        title
        cover
        about
        slug
        numberOfUser
        numberOfLikes
        numberOfPost
        numberOfViews
        privacy
        createdAt
      }
    }
  }
`;
