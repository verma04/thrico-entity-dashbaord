"use client";
import {
  MutationHookOptions,
  QueryHookOptions,
  useMutation,
  useQuery,
} from "@apollo/client/react";
import {
  GET_POLL_BY_USER,
  VOTE_POLL,
  GET_ALL_POLLS,
  GET_MY_POLLS,
  GET_POLL_STATS,
  ADD_POLL,
  EDIT_POLL,
  DELETE_POLL,
  GET_MOST_ACTIVE_MEMBERS_IN_POLLS,
} from "../../queries/polls";
import { gql } from "@apollo/client";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
  isVoted: boolean;
  totalVotes: number;
}

export const getPollByIdForUser = (
  options?: QueryHookOptions<{ getPollByIdForUser: Poll }, any>,
) => useQuery<{ getPollByIdForUser: Poll }, any>(GET_POLL_BY_USER, options);

export const voteOnPoll = (
  options?: MutationHookOptions<{ votePoll: { status: string } }, any>,
) => useMutation<{ votePoll: { status: string } }, any>(VOTE_POLL, options);

export const getAllPolls = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_ALL_POLLS, options);

export const getPollStats = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_POLL_STATS, options);

export const getMyPolls = (options?: QueryHookOptions<any, any>) =>
  useQuery<any, any>(GET_MY_POLLS, options);

export const getMostActiveMembersInPolls = (
  options?: QueryHookOptions<any, any>,
) => useQuery<any, any>(GET_MOST_ACTIVE_MEMBERS_IN_POLLS, options);

export const addPoll = (options?: MutationHookOptions<any, any>) =>
  useMutation<any, any>(ADD_POLL, {
    ...options,
    update(cache, { data }) {
      if (!data?.createPoll) return;

      try {
        cache.modify({
          fields: {
            getAllPolls(existingData = {}) {
              const newPollRef = cache.writeFragment({
                data: data.createPoll,
                fragment: gql`
                  fragment NewPoll on polls {
                    id
                  }
                `,
              });

              const existingArray = existingData?.data || [];
              return {
                ...existingData,
                data: [newPollRef, ...existingArray],
              };
            },
            getMyPolls(existingData = {}) {
              const newPollRef = cache.writeFragment({
                data: data.createPoll,
                fragment: gql`
                  fragment NewPoll on polls {
                    id
                  }
                `,
              });

              const existingArray = existingData?.data || [];
              return {
                ...existingData,
                data: [newPollRef, ...existingArray],
              };
            },
          },
        });

        // Also update poll stats if we fetch it
        const statsData = cache.readQuery<any>({
          query: GET_POLL_STATS,
        });
        if (statsData?.getPollStats) {
          cache.writeQuery({
            query: GET_POLL_STATS,
            data: {
              getPollStats: {
                ...statsData.getPollStats,
                totalPolls: statsData.getPollStats.totalPolls + 1,
                yourPolls: statsData.getPollStats.yourPolls + 1,
              },
            },
          });
        }
      } catch (error) {
        console.log("Error updating cache after addPoll:", error);
      }
    },
  });

export const editPoll = (options?: MutationHookOptions<any, any>) =>
  useMutation<any, any>(EDIT_POLL, options);

export const deletePoll = (options?: MutationHookOptions<any, any>) =>
  useMutation<any, any>(DELETE_POLL, {
    ...options,
    update(cache, { data }, { variables }) {
      if (!data?.deletePoll) return;
      const pollId = variables?.input?.pollId;
      if (!pollId) return;

      cache.evict({ id: `polls:${pollId}` });
      cache.gc();

      try {
        cache.modify({
          fields: {
            getAllPolls(existingData, { readField }) {
              if (!existingData?.data) return existingData;
              return {
                ...existingData,
                data: existingData.data.filter(
                  (pollRef: any) => readField("id", pollRef) !== pollId,
                ),
              };
            },
            getMyPolls(existingData, { readField }) {
              if (!existingData?.data) return existingData;
              return {
                ...existingData,
                data: existingData.data.filter(
                  (pollRef: any) => readField("id", pollRef) !== pollId,
                ),
              };
            },
          },
        });

        // Update poll stats
        const statsData = cache.readQuery<any>({
          query: GET_POLL_STATS,
        });
        if (statsData?.getPollStats) {
          cache.writeQuery({
            query: GET_POLL_STATS,
            data: {
              getPollStats: {
                ...statsData.getPollStats,
                totalPolls: Math.max(0, statsData.getPollStats.totalPolls - 1),
                yourPolls: Math.max(0, statsData.getPollStats.yourPolls - 1),
              },
            },
          });
        }
      } catch (error) {
        console.log("Error updating cache after deletePoll:", error);
      }
    },
  });
