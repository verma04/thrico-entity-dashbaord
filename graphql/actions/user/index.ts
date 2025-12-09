import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "../../quries";
import {
  CHANGE_USER_STATUS,
  CHANGE_USER_VERIFICATION,
  GET_ALL_USER,
  GET_USER_ANALYTICS,
  GET_USER_DETIALS,
  UPDATE_MEMBERS_TERMS_AND_CONDITIONS,
} from "../../quries/user";

export const getUser = () => useQuery(GET_ALL_USER);

export const getAllUser = (options: any) => useQuery(GET_ALL_USER, options);

export const getUserDetailsById = (options: any) =>
  useQuery(GET_USER_DETIALS, options);

export const changeUserStatus = (options: any) =>
  useMutation(CHANGE_USER_STATUS, {
    ...options,
    refetchQueries: [
      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },
      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "BLOCKED",
          },
        },
      },
      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "REJECTED",
          },
        },
      },
      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "FLAGGED",
          },
        },
      },
      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },
    ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const changeUserVerification = (options: any) =>
  useMutation(CHANGE_USER_VERIFICATION, {
    ...options,
    refetchQueries: [
      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },

      {
        query: GET_ALL_USER,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },
    ],
    awaitRefetchQueries: true, // ensures mutation waits until refetch is complete
  });

export const updateMemberTermsAndConditions = (options: any) =>
  useMutation(UPDATE_MEMBERS_TERMS_AND_CONDITIONS, {});

export type getUserAnalytics = {
  totalMembers: number;
  verifiedMembers: number;
  verifiedPercent: number;
  activeMembers: number;
  activePercent: number;
  newMembersThisMonth: number;
};

export const uesGetUserAnalytics = (options?: any) =>
  useQuery<{ getUserAnalytics: getUserAnalytics }>(GET_USER_ANALYTICS, options);
