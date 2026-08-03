import { gql } from "@apollo/client";

export const ADD_POLL = gql`
  mutation CreatePoll($input: inputAddPoll!) {
    createPoll(input: $input) {
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
      isOwner
    }
  }
`;

export const GET_ALL_POLLS = gql`
  query GetAllPolls($input: inputGetAllPolls) {
    getAllPolls(input: $input) {
      data {
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
        user {
          id
          firstName
          avatar
          lastName
        }
        isOwner
      }
      pagination {
        nextCursor
        hasNextPage
      }
    }
  }
`;

export const GET_POLL_BY_USER = gql`
  query GetPollByIdForUser($input: inputGetPollByIdForUser!) {
    getPollByIdForUser(input: $input) {
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
      user {
        id
        firstName
        avatar
        lastName
      }
      isOwner
    }
  }
`;

export const VOTE_POLL = gql`
  mutation VoteOnPoll($input: inputVoteOnPoll) {
    voteOnPoll(input: $input) {
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
      user {
        id
        firstName
        avatar
        lastName
      }
      isOwner
    }
  }
`;

export const GET_MY_POLLS = gql`
  query GetMyPolls($input: inputGetAllPolls) {
    getMyPolls(input: $input) {
      data {
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
        user {
          id
          firstName
          email
          avatar
          lastName
        }
        isOwner
      }
      pagination {
        nextCursor
        hasNextPage
      }
    }
  }
`;

export const GET_POLL_STATS = gql`
  query GetPollStats {
    getPollStats {
      totalPolls
      activePolls
      yourPolls
      yourVotes
      mostPollsByUser
    }
  }
`;

export const GET_POLL_VOTERS = gql`
  query GetPollVoters($input: inputGetPollVoters!) {
    getPollVoters(input: $input) {
      data {
        id
        user {
          id
          firstName
          lastName
          avatar
        }
        votedOption {
          id
          order
          text
          votes
        }
        votedAt
      }
      pagination {
        nextCursor
        hasNextPage
      }
    }
  }
`;

export const EDIT_POLL = gql`
  mutation EditPoll($input: inputEditPoll!) {
    editPoll(input: $input) {
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
      user {
        id
        firstName
        avatar
        lastName
      }
      isOwner
    }
  }
`;

export const DELETE_POLL = gql`
  mutation DeletePoll($input: inputDeletePoll!) {
    deletePoll(input: $input) {
      id
    }
  }
`;

export const GET_MOST_ACTIVE_MEMBERS_IN_POLLS = gql`
  query GetMostActiveMembersInPolls {
    getMostActiveMembersInPolls {
      id
      firstName
      avatar
      lastName
      about {
        headline
      }
    }
  }
`;
