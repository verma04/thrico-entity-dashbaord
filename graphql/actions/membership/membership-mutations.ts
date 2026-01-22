import { useMutation } from "@apollo/client";
import {
  CHANGE_USER_STATUS,
  CHANGE_USER_VERIFICATION,
  GET_ALL_USER,
  UPDATE_MEMBERS_TERMS_AND_CONDITIONS,
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
