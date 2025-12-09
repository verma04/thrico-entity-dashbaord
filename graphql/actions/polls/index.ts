import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_POOL,
  CHANGE_STATUS_POOL,
  DELETE_POOL,
  EDIT_POOLS,
  GET_POLL_BY_USER,
  GET_POOLS,
  POLL_RESULT,
  VOTE_POLL,
} from "../../quries/polls";

export const addPoll = (options: any) =>
  useMutation(ADD_POOL, {
    ...options,
    refetchQueries: [
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "ALL",
          },
        },
      },
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "ENTITY",
          },
        },
      },
    ],

    awaitRefetchQueries: true,
  });

export const getPolls = (options: any) => useQuery(GET_POOLS, options);

export const editPolls = (options: any) =>
  useMutation(EDIT_POOLS, {
    ...options,
    refetchQueries: [
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "ALL",
          },
        },
      },
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "ENTITY",
          },
        },
      },
    ],

    awaitRefetchQueries: true,
  });

export const deletePoll = (options: any) =>
  useMutation(DELETE_POOL, {
    ...options,
    refetchQueries: [
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "ALL",
          },
        },
      },
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "ENTITY",
          },
        },
      },
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "USER",
          },
        },
      },
    ],
  });

export const changePollStatus = (options: any) =>
  useMutation(CHANGE_STATUS_POOL, {
    ...options,
    refetchQueries: [
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "ALL",
          },
        },
      },
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "ENTITY",
          },
        },
      },
      {
        query: GET_POOLS,
        variables: {
          input: {
            by: "USER",
          },
        },
      },
    ],
  });

export const getPollByIdForUser = (options: any) =>
  useQuery(GET_POLL_BY_USER, options);

export const voteOnPoll = (options: any) =>
  useMutation(VOTE_POLL, {
    ...options,
  });

export const getPollResult = (options: any) => useQuery(POLL_RESULT, options);
