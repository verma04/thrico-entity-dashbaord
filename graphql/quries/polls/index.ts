import { gql } from "@apollo/client";

const polls = `
      id
      title
      question
      totalVotes
      resultVisibility
      options {
      id
        order
        text
      }
      updatedAt
      createdAt
      endDate
      status
`;
export const ADD_POOL = gql`
  mutation AddPolls($input: inputAddPolls) {
    addPoll(input: $input) {
      ${polls}
    }
  }
`;

export const GET_POOLS = gql`
query GetPolls($input: inputGetPolls!) {
  getPolls(input: $input) {
       ${polls}
  }
}`;

export const EDIT_POOLS = gql`
mutation EditPoll($input: inputEditPolls) {
  editPoll(input: $input) {
           ${polls}
  }
}`;

export const DELETE_POOL = gql`
  mutation DeletePoll($input: inputDeletePoll) {
    deletePoll(input: $input) {
      id
    }
  }
`;

export const CHANGE_STATUS_POOL = gql`
mutation ChangePollStatus($input: inputChangePollStatus) {
  changePollStatus(input: $input) {
       ${polls}
  }
}`;

export const GET_POLL_BY_USER = gql`
  query GetPollByIdForUser($input: inputGetPollByIdForUser!) {
    getPollByIdForUser(input: $input) {
      id
      title
      question
      resultVisibility
      totalVotes
      options {
        id
        text
        votes
      }
      updatedAt
      createdAt
      endDate
      status
      isVoted
      votedOptionId
    }
  }
`;

export const VOTE_POLL = gql`
  mutation VoteOnPoll($input: inputVoteOnPoll) {
    voteOnPoll(input: $input) {
      id
    }
  }
`;

export const POLL_RESULT = gql`
  query GetPollResult($input: inputGetPollByIdForUser!) {
    getPollResult(input: $input) {
      options {
        id
        text
        order
        votes
      }
      individualVotes {
        pollOptions {
          id
          text
          order
          votes
        }
        votedBy
        createdAt
        user {
          firstName
          avatar
          lastName
          id
        }
      }
    }
  }
`;
