import { useMutation } from "@apollo/client";
import {
  CHANGE_USER_STATUS,
  CHANGE_USER_VERIFICATION,
  GET_ALL_USER,
  UPDATE_MEMBERS_TERMS_AND_CONDITIONS,
  BULK_CHANGE_USER_STATUS,
  ADD_NEW_MEMBER,
  UPDATE_MEMBER,
  LOGOUT_USER_SESSION,
  LOGOUT_ALL_USER_SESSIONS,
} from "../../quries/user";

// ---------------------------------------------------------
// MUTATION HOOKS
// ---------------------------------------------------------

export const useChangeUserStatus = (options: any) =>
  useMutation(CHANGE_USER_STATUS, {
    ...options,
    refetchQueries: [
      { query: GET_ALL_USER, variables: { input: { status: "ALL" } } },
      { query: GET_ALL_USER, variables: { input: { status: "PENDING" } } },
      { query: GET_ALL_USER, variables: { input: { status: "APPROVED" } } },
      { query: GET_ALL_USER, variables: { input: { status: "BLOCKED" } } },
      { query: GET_ALL_USER, variables: { input: { status: "REJECTED" } } },
      { query: GET_ALL_USER, variables: { input: { status: "FLAGGED" } } },
      { query: GET_ALL_USER, variables: { input: { status: "DISABLED" } } },
    ],
    awaitRefetchQueries: true,
  });

export const useChangeUserVerification = (options: any) =>
  useMutation(CHANGE_USER_VERIFICATION, {
    ...options,
    refetchQueries: [
      { query: GET_ALL_USER, variables: { input: { status: "ALL" } } },
      { query: GET_ALL_USER, variables: { input: { status: "APPROVED" } } },
    ],
    awaitRefetchQueries: true,
  });

export const useUpdateMemberTermsAndConditions = (options: any) =>
  useMutation(UPDATE_MEMBERS_TERMS_AND_CONDITIONS, options || {});

export const useBulkChangeUserStatus = (options: any) =>
  useMutation(BULK_CHANGE_USER_STATUS, {
    ...options,
    refetchQueries: [
      { query: GET_ALL_USER, variables: { input: { status: "ALL" } } },
      { query: GET_ALL_USER, variables: { input: { status: "PENDING" } } },
      { query: GET_ALL_USER, variables: { input: { status: "APPROVED" } } },
      { query: GET_ALL_USER, variables: { input: { status: "BLOCKED" } } },
      { query: GET_ALL_USER, variables: { input: { status: "REJECTED" } } },
      { query: GET_ALL_USER, variables: { input: { status: "FLAGGED" } } },
      { query: GET_ALL_USER, variables: { input: { status: "DISABLED" } } },
    ],
    awaitRefetchQueries: true,
  });

export const useAddNewMember = (options?: any) =>
  useMutation(ADD_NEW_MEMBER, {
    ...options,
    refetchQueries: [
      { query: GET_ALL_USER, variables: { input: { status: "ALL" } } },
    ],
    awaitRefetchQueries: true,
  });

export const useUpdateMember = (options?: any) =>
  useMutation(UPDATE_MEMBER, {
    ...options,
    refetchQueries: [
      { query: GET_ALL_USER, variables: { input: { status: "ALL" } } },
    ],
    awaitRefetchQueries: true,
  });

export const useLogoutUserSession = (options?: any) =>
  useMutation(LOGOUT_USER_SESSION, options);

export const useLogoutAllUserSessions = (options?: any) =>
  useMutation(LOGOUT_ALL_USER_SESSIONS, options);
