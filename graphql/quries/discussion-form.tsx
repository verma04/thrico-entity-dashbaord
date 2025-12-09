import { gql } from "@apollo/client";

const details = `
  id
      name
      description
      isActive
      createdAt
      updatedAt
      slug
`;
const forum = `
      id
      createdAt
      title
      content
      category {
        name
        id
    }
      upVotes
      downVotes
      status
      approvedReason
      isAnonymous
      addedBy
      user {
        firstName
        lastName
        id
      }
      verification {
        isVerifiedAt
        isVerified
        verificationReason
      }
        voteType
          isLikeByYou
`;
export const ADD_DISCUSSION_FORUM_CATEGORY = gql`
  mutation AddDiscussionForumCategory($input: inputDiscussionForumCategory) {
    addDiscussionForumCategory(input: $input) {
 ${details}
    }
  }
`;

export const GET_DISCUSSION_FORUM_CATEGORY = gql`
query GetDiscussionForumCategory($input: inputGetDiscussionForumCategory) {
  getDiscussionForumCategory(input: $input) {
     ${details}
  }
}`;

export const EDIT_DISCUSSION_FORUM_CATEGORY = gql`
mutation EditDiscussionForumCategory($input: editDiscussionForumCategory) {
  editDiscussionForumCategory(input: $input) {
     ${details}
  }
}`;

export const CHANGE_STATUS_DISCUSSION_FORUM_CATEGORY = gql`
mutation ChangeStatusDiscussionForumCategory($input: editChangeStatusDiscussionForumCategory) {
  changeStatusDiscussionForumCategory(input: $input) {
         ${details}
  }
}`;

export const ADD_DISCUSSION_FORUM = gql`
  mutation AddDiscussionForum($input: inputDiscussionForum) {
    addDiscussionForum(input: $input) {
    ${forum}
    }
  }
`;
export const GET_DISCUSSION_FORUM = gql`
 query GetDiscussionForum($input: inputGetDiscussionForum) {
  getDiscussionForum(input: $input) {
  ${forum}
    }
  }
`;

export const GET_DISCUSSION_FORUM_COMMENTS = gql`
  query GetDiscussionForumComments($input: inputId) {
    getDiscussionForumComments(input: $input) {
      id

      createdAt
      updatedAt
      slug
      content
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
`;
export const POST_DISCUSSION_FORUM_COMMENTS = gql`
  mutation PostDiscussionForumComments(
    $input: inputPostDiscussionForumComment
  ) {
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
`;

export const CHANGE_STATUS_DISCUSSION_FORUM = gql`
mutation ChangeDiscussionForumStatus($input: inputChangeDiscussionForumStatus) {
  changeDiscussionForumStatus(input: $input) {
      ${forum}
  }
}`;

export const CHANGE_VERIFICATION_DISCUSSION_FORUM = gql`
mutation ChangeDiscussionForumVerification($input: inoutChangeDiscussionForumVerification) {
  changeDiscussionForumVerification(input: $input) {
      ${forum}
  }
}`;

export const UPVOTE_DISCUSSION_FORUM = gql`
  mutation UpVoteDiscussionForum($input: inputUpVoteDiscussionForum) {
    upVoteDiscussionForum(input: $input) {
      message
    }
  }
`;
export const DOWNVOTE_DISCUSSION_FORUM = gql`
  mutation DownVoteDiscussionForum($input: inputDownVoteDiscussionForum) {
    downVoteDiscussionForum(input: $input) {
      message
    }
  }
`;
export const GET_BY_ID_DISCUSSION_FORUM = gql`
  query GetDiscussionForumDetailsByID(
    $input: inputGetDiscussionForumDetailsByID
  ) {
    getDiscussionForumDetailsByID(input: $input) {
      upVotes
      downVotes
      isLikeByYou
      voteType
      totalComments
    }
  }
`;

export const DELETE_DISCUSSION_FORUM_COMMENT = gql`
  mutation DeleteDiscussionForumComments(
    $input: inputDeleteDiscussionForumComment
  ) {
    deleteDiscussionForumComments(input: $input) {
      id
      discussionForumId
    }
  }
`;

export const EDIT_DISCUSSION_FORUM = gql`
mutation EditDiscussionForum($input: inputEditDiscussionForum) {
  editDiscussionForum(input: $input) {
      ${forum}
  }
}`;
