import { gql } from '@apollo/client'
const forum = `
  id
  title
  content
  category {
    id
    name
    description
    isActive
    createdAt
    updatedAt
    slug
  }
  upVotes
  downVotes
  totalComments
  status
  isAnonymous
  addedBy
  user {
    id
    email
    firstName
    lastName
    avatar
  }
  createdAt
  updatedAt
  isLikeByYou
  voteType
  isOwner
`

export const ADD_DISCUSSION_FORM = gql`
mutation AddDiscussionForum($input: inputDiscussionForum) {
  addDiscussionForum(input: $input) {
    ${forum}
  }
}`

export const GET_DISCUSSION_FORM = gql`
  query GetDiscussionForum($input: inputGetDiscussionForum) {
    getDiscussionForum(input: $input) {
      edges {
        node {
          ${forum}
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`

export const GET_DISCUSSION_FORM_BY_ID = gql`
query GetDiscussionForumDetailsByID($input: inputGetDiscussionForumDetailsByID) {
  getDiscussionForumDetailsByID(input: $input) {
       ${forum}
  }
}`

export const UPVOTE_DISCUSSION_FORUM = gql`
  mutation UpVoteDiscussionForum($input: inputUpVoteDiscussionForum) {
    upVoteDiscussionForum(input: $input) {
      message
    }
  }
`
export const DOWNVOTE_DISCUSSION_FORUM = gql`
  mutation DownVoteDiscussionForum($input: inputDownVoteDiscussionForum) {
    downVoteDiscussionForum(input: $input) {
      message
    }
  }
`

export const GET_DISCUSSION_FORUM_CATEGORY = gql`
  query GetDiscussionForumCategory {
    getDiscussionForumCategory {
      id
      name
      description
      isActive
      createdAt
      updatedAt
      slug
    }
  }
`

export const GET_DISCUSSION_POSTED_BY_ME = gql`
  query DiscussionPostedByMe($input: inputGetDiscussionForum) {
    discussionPostedByMe(input: $input) {
      edges {
        node {
          ${forum}
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`

export const DELETE_FORUM = gql`
  mutation DeleteForum($input: inputDeleteForum) {
    deleteForum(input: $input) {
      ${forum}
    }
  }
`

export const POST_DISCUSSION_FORUM_COMMENTS = gql`
  mutation PostDiscussionForumComments($input: inputPostDiscussionForumComment) {
    postDiscussionForumComments(input: $input) {
      id
      content
      createdAt
      updatedAt
      slug
      commentedBy
      discussionForumId
      user {
        id
        firstName
        avatar
        lastName
        isOnline
        cover
      }
    }
  }
`

export const GET_DISCUSSION_FORUM_COMMENTS = gql`
  query GetDiscussionForumComments($input: GetForumCommentsInput!) {
    getDiscussionForumComments(input: $input) {
      edges {
        cursor
        node {
          id
          content
          createdAt
          updatedAt
          slug
          commentedBy
          discussionForumId
          user {
            id
            firstName
            avatar
            lastName
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
`

export const GET_DISCUSSION_STATS = gql`
  query GetDiscussionStats {
    getDiscussionStats {
      totalDiscussions
      activeToday
      yourPosts
      yourReplies
    }
    getPopularCategories {
      count
      name
    }
  }
`

export const GET_TOP_CONTRIBUTORS = gql`
  query GetTopContributors {
    getTopContributors {
      id
      firstName
      lastName
      avatar
      totalPosts
    }
  }
`

