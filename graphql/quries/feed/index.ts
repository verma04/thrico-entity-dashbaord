import { gql } from "@apollo/client";
export const FEED = `
   
     
`;

export const NUMBER_OF_FEED = gql`
  query Query {
    numberOfFeeds
  }
`;
export const GET_ALL_FEED = gql`
  query GetAllFeed($input: PaginationInput) {
    getAllFeed(input: $input) {
      isLiked
      id
      description
      user {
        firstName
        avatar
        lastName
        id
      }
      createdAt
      totalComment
      totalReactions
      totalReShare
      isWishList
      isOwner
      source
      media {
        url
      }
      privacy
      addedBy
      poll {
        id
        title
        question
        resultVisibility
        options {
          id
          text
          order
          votes
        }
        updatedAt
        createdAt
        endDate
        status
        totalVotes
        isVoted
        votedOptionId
      }
      moment {
        id
        videoUrl
        hlsUrl
        thumbnailUrl
        optimizedVideoUrl
        caption
        createdAt
        updatedAt
        totalReshares
        totalComments
        totalReactions
      }
      job {
        title
        description
        location
        jobType
        salary
        experienceLevel
        workplaceType
        applicationDeadline
      }
      marketPlace {
        id
        addedBy
        entityId
        title
        price
        condition
        status
        sku
        slug
        description
        category
        isApproved
        isExpired
        createdAt
        updatedAt
        tag
        isFeatured
        numberOfViews
        interests
        categories
        location {
          name
          latitude
          longitude
          address
          lat
          lng
        }
        media {
          url
        }
      }
      isPinned
      pinnedAt
    }
  }
`;

export const GET_ADMIN_FEED = gql`
  query GetAdminFeed($input: PaginationInput) {
    getAdminFeed(input: $input) {
      isLiked
      id
      description
      user {
        firstName
        avatar
        lastName
        id
      }
      createdAt
      totalComment
      totalReactions
      totalReShare
      isWishList
      isOwner
      source
      media {
        url
      }
      privacy
      addedBy
      poll {
        id
        title
        question
        resultVisibility
        options {
          id
          text
          order
          votes
        }
        updatedAt
        createdAt
        endDate
        status
        totalVotes
        isVoted
        votedOptionId
      }
      moment {
        id
        videoUrl
        hlsUrl
        thumbnailUrl
        optimizedVideoUrl
        caption
        createdAt
        updatedAt
        totalReshares
        totalComments
        totalReactions
      }
      job {
        title
        description
        location
        jobType
        salary
        experienceLevel
        workplaceType
        applicationDeadline
      }
      marketPlace {
        id
        addedBy
        entityId
        title
        price
        condition
        status
        sku
        slug
        description
        category
        isApproved
        isExpired
        createdAt
        updatedAt
        tag
        isFeatured
        numberOfViews
        interests
        categories
        location {
          name
          latitude
          longitude
          address
          lat
          lng
        }
        media {
          url
        }
      }
      isPinned
      pinnedAt
    }
  }
`;

export const GET_JOB_FEED = gql`
  query GetJobFeed($input: PaginationInput) {
    getJobFeed(input: $input) {
      isLiked
      id
      description
      user {
        firstName
        avatar
        lastName
        id
      }
      createdAt
      totalComment
      totalReactions
      totalReShare
      isWishList
      isOwner
      source
      media {
        url
      }
      privacy
      addedBy
      job {
        title
        description
        location
        jobType
        salary
        experienceLevel
        workplaceType
        applicationDeadline
      }
      isPinned
      pinnedAt
    }
  }
`;

export const GET_MOMENTS_FEED = gql`
  query GetMomentsFeed($input: PaginationInput) {
    getMomentsFeed(input: $input) {
      isLiked
      id
      description
      user {
        firstName
        avatar
        lastName
        id
      }
      createdAt
      totalComment
      totalReactions
      totalReShare
      isWishList
      isOwner
      source
      media {
        url
      }
      privacy
      addedBy
      moment {
        id
        videoUrl
        hlsUrl
        thumbnailUrl
        optimizedVideoUrl
        caption
        createdAt
        updatedAt
        totalReshares
        totalComments
        totalReactions
      }
      isPinned
      pinnedAt
    }
  }
`;

export const GET_LISTING_FEED = gql`
  query GetListingFeed($input: PaginationInput) {
    getListingFeed(input: $input) {
      isLiked
      id
      description
      user {
        firstName
        avatar
        lastName
        id
      }
      createdAt
      totalComment
      totalReactions
      totalReShare
      isWishList
      isOwner
      source
      media {
        url
      }
      privacy
      addedBy
      marketPlace {
        id
        addedBy
        entityId
        title
        price
        condition
        status
        sku
        slug
        description
        category
        isApproved
        isExpired
        createdAt
        updatedAt
        tag
        isFeatured
        numberOfViews
        interests
        categories
        location {
          name
          latitude
          longitude
          address
          lat
          lng
        }
        media {
          url
        }
      }
      isPinned
      pinnedAt
    }
  }
`;
export const GET_PINNED_FEED = gql`
  query GetPinnedFeed($input: PaginationInput) {
    getPinnedFeed(input: $input) {
      isLiked
      id
      description
      user {
        firstName
        avatar
        lastName
        id
      }
      createdAt
      totalComment
      totalReactions
      totalReShare
      isWishList
      isOwner
      source
      media {
        url
      }
      privacy
      addedBy
      poll {
        id
        title
        question
        resultVisibility
        options {
          id
          text
          order
          votes
        }
        updatedAt
        createdAt
        endDate
        status
        totalVotes
        isVoted
        votedOptionId
      }
      moment {
        id
        videoUrl
        hlsUrl
        thumbnailUrl
        optimizedVideoUrl
        caption
        createdAt
        updatedAt
        totalReshares
        totalComments
        totalReactions
      }
      job {
        title
        description
        location
        jobType
        salary
        experienceLevel
        workplaceType
        applicationDeadline
      }
      marketPlace {
        id
        addedBy
        entityId
        title
        price
        condition
        status
        sku
        slug
        description
        category
        isApproved
        isExpired
        createdAt
        updatedAt
        tag
        isFeatured
        numberOfViews
        interests
        categories
        location {
          name
          latitude
          longitude
          address
          lat
          lng
        }
        media {
          url
        }
      }
      isPinned
      pinnedAt
    }
  }
`;

export const ADD_FEED = gql`
  mutation AddFeed($input: InputAddFeed) {
    addFeed(input: $input) {
      id
      source
      addedBy
      privacy
      isLiked
      isWishList
      isOwner
      media {
        url
      }
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
export const PIN_FEED = gql`
  mutation PinFeed($input: PinFeedInput) {
    pinFeed(input: $input) {
      id
      isPinned
      pinnedAt
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

export const DELETE_FEED = gql`
  mutation DeleteFeed($input: inputId) {
    deleteFeed(input: $input) {
      status
    }
  }
`;

// ==========================================
// FEED INTELLIGENCE (DASHBOARD) QUERIES
// ==========================================

export const GET_FEED_INTELLIGENCE_KPI = gql`
  query GetFeedIntelligenceKPI {
    getFeedIntelligenceKPI {
      aggregateReach
      activeDialogue
      networkVelocity
      engagementYield
      reachTrend
      dialogueTrend
      velocityTrend
      yieldTrend
    }
  }
`;

export const GET_FEED_YIELD_VELOCITY = gql`
  query GetFeedYieldVelocity {
    getFeedYieldVelocity {
      day
      signups
    }
  }
`;

export const GET_FEED_INTEREST_MATRIX = gql`
  query GetFeedInterestMatrix {
    getFeedInterestMatrix {
      name
      value
      color
    }
  }
`;

export const GET_PROMOTED_NODE_EVENTS = gql`
  query GetPromotedNodeEvents {
    getPromotedNodeEvents {
      title
      date
      time
      location
      description
    }
  }
`;
