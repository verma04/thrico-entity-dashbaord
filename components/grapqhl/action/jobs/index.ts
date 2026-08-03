"use client";
import {
  QueryHookOptions,
  MutationHookOptions,
  useQuery,
  useMutation,
} from "@apollo/client/react";
import {
  GET_ALL_JOBS,
  GET_MY_JOBS,
  GET_ALL_JOBS_APPLIED,
  GET_SEARCH_JOB_TITLE,
  ADD_JOB,
  APPLY_JOB,
} from "../../queries/jobs";

export const getAllJobs = (
  options?: QueryHookOptions<{ getAllJobs: any }, any>,
) => useQuery<{ getAllJobs: any }, any>(GET_ALL_JOBS, options);

export const getMyJobs = (
  options?: QueryHookOptions<{ getMyJobs: any }, any>,
) => useQuery<{ getMyJobs: any }, any>(GET_MY_JOBS, options);

export const getAllJobsApplied = (
  options?: QueryHookOptions<{ getAllJobsApplied: any }, any>,
) => useQuery<{ getAllJobsApplied: any }, any>(GET_ALL_JOBS_APPLIED, options);

export const getSearchJobTitle = (
  options?: QueryHookOptions<{ getSearchJobTitle: any }, any>,
) => useQuery<{ getSearchJobTitle: any }, any>(GET_SEARCH_JOB_TITLE, options);

export const createJob = (
  options?: MutationHookOptions<{ createJob: any }, any>,
) => useMutation<{ createJob: any }, any>(ADD_JOB, options);

export const applyJob = (
  options?: MutationHookOptions<{ applyJob: any }, any>,
) => useMutation<{ applyJob: any }, any>(APPLY_JOB, options);
