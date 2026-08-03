/**
 * GraphQL Fragments for Communities
 * 
 * This file contains reusable GraphQL fragments for community-related operations.
 * Fragments help maintain consistency and reduce duplication across queries and mutations.
 */

import { gql } from "@apollo/client";

// Fragment for reusable group details
export const GROUP_DETAILS_FRAGMENT = gql`
  fragment GroupDetailsFragment on groupDetails {
    id
    status
    isFeatured
    isWishList
    isTrending
    group {
      title
      cover
      id
      slug
      total
      description
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
      addedBy
      entity
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
    groupSettings {
      groupType
      joiningCondition
      privacy
    }
    groupStatus
    role
    rank
    trendingScore
    isGroupMember
    isJoinRequest
    isGroupAdmin
    isGroupManager
    members {
      avatar
      id
    }
    creator {
      avatar
      firstName
      id
      lastName
    }
  }
`;

// Fragment for community feed data
export const COMMUNITY_FEED_FRAGMENT = gql`
  fragment CommunityFeedFragment on feed {
    isLiked
    id
    description
    user {
      about {
        headline
      }
      avatar
      cover
      firstName
      id
      lastName
    }
    createdAt
    totalComment
    totalReactions
    totalReShare
    isWishList
    isOwner
    source
    media
    privacy
    job {
      id
      location
      salary
      skills
      title
    }
    offer {
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
    marketPlace {
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
    repostId
    addedBy
    poll {
      id
      title
    }
    forum {
      id
      title
      content
      category {
        id
        name
      }
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
    }
    celebration {
      id
      celebrationType
      title
      description
      cover
    }
    videoUrl
    thumbnailUrl
    status
    event {
      cover
      type
      title
      description
      endDate
      lastDateOfRegistration
      startDate
      startTime
      location
      numberOfAttendees
      numberOfPost
      numberOfViews
    }
    permissions {
      canEdit
      canDelete
      canPin
      canModerate
      canReport
    }
    communityFeedData {
      status
      isPinned
      priority
    }
  }
`;