export const privacy = `
  id
  description
  isLiked
  isWishList
  isOwner
  addedBy
  source
  media
  privacy
  totalComment
  totalReactions
  reactionType
  totalReShare
  createdAt
  videoUrl
  thumbnailUrl
  status
  isPinned
  pinnedAt
  repostId
  surveyId
  isAiContent

  permissions {
    canEdit
    canDelete
    canPin
    canModerate
    canReport
  }
  user {
    id
    firstName
    lastName
    isOnline
    avatar
    about {
      headline
    }
  }
  job {
    id
    title
    company
    description
    location
    jobType
    workplaceType
  }
  offer {
    id
    title
    description
    discount
    location
    company
    timeline
    termsAndConditions
    website
    image
  }
  listing {
    id
    title
    description
    location
    condition
    category
    price
    media
    currency
    createdAt
  }
  poll {
    id
    title
  }
  forum {
    id
    title
    content
    upVotes
    downVotes
    totalComments
    status
    isAnonymous
    addedBy
    createdAt
    updatedAt
    isLikeByYou
    voteType
    isOwner
    category {
      name
    }
  }
  celebration {
    id
    celebrationType
    title
    description
    cover
  }
  group {
    id
    entity
    cover
    tagline
    title
  }
  moment {
    id
    tenantId
    userId
    entityId
    videoUrl
    optimizedVideoUrl
    hlsUrl
    thumbnailUrl
    thumbnailOptions
    caption
    status
    createdAt
    updatedAt
    owner {
      id
      firstName
      lastName
      avatar
      headline
    }
    totalReactions
    totalComments
    totalReshares
    totalViews
    isLiked
    isWishlisted
    isOwner
    isAiContent
  }
`;

import { gql } from "@apollo/client";

export const ADD_FEED = gql`
  mutation AddFeed($input: inputAddFeed) {
    addFeed(input: $input) {
      id
      isLiked
      isOwner
      isWishList
      totalComment
      totalReactions
      description
      createdAt
      addedBy
      media
      user {
        
        avatar
        firstName
        lastName
      }
    }
  }
`;

export const GET_JOB_FEED = gql`
  query getJobFeed {
    getJobFeed {
     ${privacy}
    }
  }
`;
export const GET_FEED_DETAILS_ID = gql`
query GetFeedDetailsById($input: inputId) {
  getFeedDetailsById(input: $input) {
    ${privacy}
  }
}`;
export const REPOST_FEED = gql`
mutation RepostFeedWithThought($input: repostFeedWithThought!) {
  repostFeedWithThought(input: $input) {
    ${privacy}
  }
}`;

export const GET_MARKETPLACE_FEED = gql`
  query getMarketPlaceFeed {
    getMarketPlaceFeed {
     ${privacy}
    }
  }
`;

export const GET_EVENTS_FEED = gql`
  query getUserEventsFeed {
    getUserEventsFeed {
      id
    }
  }
`;
export const GET_FEED = gql`
query GetFeed($input: FeedCursorInput) {
  getFeed(input: $input) {
    edges {
      cursor
      node {
        ${privacy}
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

export const GET_PERSONALIZED_FEED = gql`
  query getPersonalizedFeed {
    getPersonalizedFeed {
     ${privacy}
    }
  }
`;

export const GET_COMMUNITIES_FEED = gql`
  query GetCommunitiesFeed {
    getCommunitiesFeed {
     ${privacy}
    }
  }
`;
export const ADD_COMMENT = gql`
  mutation AddComment($input: inputComment) {
    addComment(input: $input) {
      id
      isOwner
      isPostOwner
      content
      createdAt
      user {
        avatar
        firstName
        id
        lastName
        about {
          headline
        }
      }
      permissions {
        canDelete
        canEdit
        canReport
      }
    }
  }
`;
export const EDIT_COMMENT = gql`
  mutation EditFeedComment($input: EditFeedCommentInput!) {
    editFeedComment(input: $input) {
      id
      content
      createdAt
      isOwner
      isPostOwner
      user {
        avatar
        firstName
        id
        lastName
        about {
          headline
        }
      }
      permissions {
        canDelete
        canEdit
        canReport
      }
    }
  }
`;
export const GET_FEED_COMMENT = gql`
  query GetFeedComment($input: CommentCursorInput!) {
    getFeedComment(input: $input) {
      edges {
        cursor
        node {
          content
          createdAt
          id
          isOwner
          isPostOwner
          user {
            about {
              headline
            }
            firstName
            lastName
            avatar
            id
          }
          permissions {
            canDelete
            canEdit
            canReport
          }
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
export const WISHLIST_FEED = gql`
  mutation WishListFeed($input: inputId) {
    wishListFeed(input: $input) {
      status
    }
  }
`;
export const LIKE_FEED = gql`
  mutation LikeFeed($input: inputLikeFeed) {
    likeFeed(input: $input) {
      status
    }
  }
`;

export const DELETE_FEED = gql`
  mutation DeleteFeed($input: inputId) {
    deleteFeed(input: $input) {
      ${privacy}
    }
  }
`;
export const DELETE_COMMENT = gql`
  mutation DeleteCommentFeed($input: inputDeleteFeedComment) {
    deleteCommentFeed(input: $input) {
      id
      content
      createdAt
      user {
        id
        firstName
        lastName
        avatar
      }
      isOwner
      isPostOwner
      permissions {
        canDelete
        canEdit
        canReport
      }
    }
  }
`;

export const ADD_COMMUNITIES_FEED = gql`
  mutation AddFeedCommunities($input: inputGroupFeed) {
    addFeedCommunities(input: $input) {
      createdAt
      description
      id
      isLiked
      isOwner
      isWishList
      source
      totalComment
      totalReShare
      totalReactions
      user {
        id
       
        avatar
        firstName
        isOnline
        lastName
      }
    }
  }
`;

export const GET_USER_FEED = gql`
query GetUserActivityFeed($input: inputId!) {
  getUserActivityFeed(input: $input) {
      ${privacy}
    }
  }
`;

export const GET_ALL_OFFER = gql`
  query GetAllOffer {
    getAllOffer {
      id
      title
      description
      location
      company
      timeline
      termsAndConditions
      website
      createdAt
      updatedAt
      isActive
      cover
    }
  }
`;

export const GET_COMMUNITIES_FEED_LIST = gql`
  query getCommunitiesFeedList($input: inputGroupFeedPagination) {
    getCommunitiesFeedList(input: $input) {
     ${privacy}
    }
  }
`;
export const GET_DISCUSSION_FORUM_CATEGORY = gql`
  query GetDiscussionForumCategory {
    getDiscussionForumCategory {
      id
      name
    }
  }
`;
export const GET_MY_FEED = gql`
  query GetMyFeed($input: FeedCursorInput) {
    getMyFeed(input: $input) {
      edges {
        cursor
        node {
          ${privacy}
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      hasPinnedPost
    }
  }
`;

export const GET_FEED_REACTIONS = gql`
  query GetFeedReactions($input: GetFeedReactionsInput!) {
    getFeedReactions(input: $input) {
      edges {
        cursor
        node {
          createdAt
          id
          reactionType
          user {
            id
            firstName
            lastName
            avatar
            about {
              headline
            }
          }
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

export const GET_FEED_STATS = gql`
  query GetFeedStats($input: GetFeedStatsInput!) {
    getFeedStats(input: $input) {
      feedId
      basicStats {
        totalReactions
        totalComments
        totalShares
        createdAt
      }
      reactionBreakdown {
        count
        reactionsType
      }
      commentsOverTime {
        date
        count
      }
      engagementByConnections {
        comments
        isConnection
        reactions
      }
      impressions
      reach
    }
  }
`;

export const GET_MY_FEED_STATS = gql`
  query GetMyFeedStats {
    getMyFeedStats {
      likedPosts
      savedPosts
      yourPosts
    }
  }
`;

export const GET_MY_PROFILE_STATS = gql`
  query GetMyProfileStats {
    getMyProfileStats {
      posts
      followers
      following
      thisWeek {
        growth
        posts
        views
      }
    }
  }
`;

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

export const GET_MOMENTS_FEED = gql`
query GetMomentsFeed($input: FeedCursorInput) {
  momentsFeed(input: $input) {
    edges {
      node {
        ${privacy}
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

export const GET_FEED_BY_ADMIN = gql`
query FeedByAdmin($input: FeedCursorInput) {
  feedByAdmin(input: $input) {
    edges {
      cursor
      node {
        ${privacy}
       
       
        communityfeedId
        momentId
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
    hasPinnedPost
  }
}
`
export const GET_POLLS_FEED = gql`
query PollsFeed($input: FeedCursorInput) {
  pollsFeed(input: $input) {
       edges {
      cursor
      node {
        ${privacy}
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
`

export const GET_FEED_ACTIVITY_BY_USER_ID = gql`
  query GetFeedActivityByUserId($userId: ID!, $input: FeedCursorInput) {
    getFeedActivityByUserId(userId: $userId, input: $input) {
      edges {
        cursor
        node {
          ${privacy}
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`

export const GET_MY_JOINED_COMMUNITIES_FEED = gql`
query GetMyJoinedCommunitiesFeed($input: FeedCursorInput) {
  getMyJoinedCommunitiesFeed(input: $input) {
    edges {
      cursor
      node {
        ${privacy}
        communityfeedId
        momentId
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
    totalCount
    hasPinnedPost
  }
}
`
