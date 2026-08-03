import { gql } from "@apollo/client";

export const GET_NOTIFICATION = gql`
  query GetUserNotification($input: cursorPaginationInput) {
    getUserNotification(input: $input) {
      unread
      nextCursor
      result {
        id
        type
        createdAt
        feed {
          id
        }
        content
        sender {
          firstName
          avatar
          lastName
        }
      }
    }
  }
`;

export const MARK_NOTIFICATION_AS_SEEN = gql`
  query MarkNotificationAsSeen {
    markNotificationAsSeen {
      status
    }
  }
`;
export const UN_SEEN_NOTIFICATION = gql`
  query Query {
    unSeenNotification
  }
`;

export const GET_FEED_NOTIFICATIONS = gql`
  query GetFeedNotifications($input: cursorPaginationInput) {
    getFeedNotifications(input: $input) {
      nextCursor
      result {
        id
        type
        createdAt
        feed {
          isLiked
          id
          description
          createdAt
          totalComment
          totalReactions
          totalReShare
          isWishList
          isOwner
          source
          media
          group {
            id
          }
          privacy
          job {
            id
          }
          offer {
            id
          }
          listing {
            id
          }
          repostId
          addedBy
          poll {
            id
          }
          forum {
            id
          }
          celebration {
            id
          }
          videoUrl
          thumbnailUrl
          status
          isPinned
          pinnedAt
          permissions {
            canDelete
          }
          surveyId
          communityfeedId
          momentId
          moment {
            id
          }
          reactionType
          isAiContent
        }
        content
        sender {
          firstName
          lastName
          id
          avatar
        }
        isRead
      }
    }
  }
`;

export const GET_COMMUNITY_NOTIFICATIONS = gql`
  query GetCommunityNotifications($input: cursorPaginationInput) {
    getCommunityNotifications(input: $input) {
      result {
        id
        type
        createdAt
        community {
          title
          cover
          id
          slug
          total
          description
          admin {
            id
          }
          privacy
          isGroupMember
          isJoinRequest
          isGroupAdmin
          isTrending
          numberOfUser
          numberOfLikes
          numberOfPost
          createdAt
          updatedAt
          numberOfViews
          tag
          isFeatured
          location
          tagline
          creator
          addedBy
          entity
          status
          isApproved
          theme
          interests
          categories
          communityType
          joiningTerms
          requireAdminApprovalForPosts
          allowMemberInvites
          allowMemberPosts
          enableEvents
          enableRatingsAndReviews
          rules
          overallRating
          totalRatings
          verifiedRating
          totalVerifiedRatings
        }
        content
        sender {
          email
          firstName
          lastName
          id
          avatar
        }
        isRead
      }
      nextCursor
    }
  }
`;

export const GET_NETWORK_NOTIFICATIONS = gql`
  query GetNetworkNotifications($input: cursorPaginationInput) {
    getNetworkNotifications(input: $input) {
      nextCursor
      result {
        id
        notificationType
        createdAt
        content
        sender {
          email
          firstName
          lastName
          avatar
          id
        }
        isRead
      }
    }
  }
`;

export const GET_JOB_NOTIFICATIONS = gql`
  query GetJobNotifications($input: cursorPaginationInput) {
    getJobNotifications(input: $input) {
      result {
        id
        type
        createdAt
        job {
          id
          title
          company
          description
          location
          jobType
          workplaceType
        }
        content
        sender {
          id
          firstName
          avatar
          lastName
          about {
            id
          }
          isOnline
          profile {
            id
          }
          cover
          status
          name
          email
        }
        isRead
      }
      nextCursor
    }
  }
`;

export const GET_LISTING_NOTIFICATIONS = gql`
  query GetListingNotifications($input: cursorPaginationInput) {
    getListingNotifications(input: $input) {
      result {
        id
        type
        createdAt
        listing {
          id
          title
          description
          location
          condition
          category
          price
          createdAt
          media
          currency
        }
        content
        sender {
          id
          firstName
          lastName
          avatar
          email
        }
        isRead
      }
      nextCursor
    }
  }
`;

export const GET_MOMENT_NOTIFICATIONS = gql`
  query GetMomentNotifications($input: cursorPaginationInput) {
    getMomentNotifications(input: $input) {
      result {
        id
        type
        createdAt
        momentId
        content
        sender {
          id
          firstName
          lastName
          avatar
          email
        }
        isRead
      }
      nextCursor
    }
  }
`;

// ── Mark-as-read Mutations ──────────────────────────────────────────────

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($markNotificationAsReadId: ID!) {
    markNotificationAsRead(id: $markNotificationAsReadId) {
      success
      message
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead($module: String!) {
    markAllNotificationsAsRead(module: $module) {
      success
      message
    }
  }
`;

export const MARK_GAMIFICATION_NOTIFICATIONS_AS_READ = gql`
  mutation MarkGamificationNotificationsAsRead {
    markGamificationNotificationsAsRead {
      message
    }
  }
`;
