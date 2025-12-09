import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_ALUMNI_STORIES_CATEGORY } from "../../../quries/alumniStories/category";
import {
  ALUMNI_STORIES_ACTIONS,
  GET_ALL_ALUMNI_STORIES,
  GET_ALL_ALUMNI_STORIES_APPROVED,
  GET_ALL_ALUMNI_STORIES_REQUESTED,
} from "../../../quries/alumniStories/stories";

export const getAllAlumniStories = (options: any) =>
  useQuery(GET_ALL_ALUMNI_STORIES, options);

export const getAllApprovedAlumniStories = (options: any) =>
  useQuery(GET_ALL_ALUMNI_STORIES_APPROVED, options);

export const getAllApprovedRequestedStories = (options: any) =>
  useQuery(GET_ALL_ALUMNI_STORIES_REQUESTED, options);

export const alumniStoriesActions = (options: any) =>
  useMutation(ALUMNI_STORIES_ACTIONS, options);
