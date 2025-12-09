import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_ALUMNI_STORIES_CATEGORY,
  DELETE_ALUMNI_STORIES_CATEGORY,
  DUPLICATE_ALUMNI_STORIES_CATEGORY,
  GET_ALL_ALUMNI_STORIES_CATEGORY,
} from "../../../quries/alumniStories/category";

export const getAllAlumniStoriesCategory = (options: any) =>
  useQuery(GET_ALL_ALUMNI_STORIES_CATEGORY, options);

export const addAlumniStoryCategory = (options: any) =>
  useMutation(ADD_ALUMNI_STORIES_CATEGORY, {
    onCompleted: options.onCompleted,
    update(cache, { data: { addAlumniStoryCategory } }) {
      try {
        const { getAllAlumniStoriesCategory }: any = cache.readQuery({
          query: GET_ALL_ALUMNI_STORIES_CATEGORY,
        });

        cache.writeQuery({
          query: GET_ALL_ALUMNI_STORIES_CATEGORY,

          data: {
            getAllAlumniStoriesCategory: [
              ...addAlumniStoryCategory,
              ...getAllAlumniStoriesCategory,
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const deleteAlumniStoryCategory = (options: any) =>
  useMutation(DELETE_ALUMNI_STORIES_CATEGORY, options);

export const duplicateAlumniStoryCategory = (options: any) =>
  useMutation(DUPLICATE_ALUMNI_STORIES_CATEGORY, {
    update(cache, { data: { duplicateAlumniStoryCategory } }) {
      try {
        const { getAllAlumniStoriesCategory }: any = cache.readQuery({
          query: GET_ALL_ALUMNI_STORIES_CATEGORY,
        });

        cache.writeQuery({
          query: GET_ALL_ALUMNI_STORIES_CATEGORY,

          data: {
            getAllAlumniStoriesCategory: [
              ...duplicateAlumniStoryCategory,
              ...getAllAlumniStoriesCategory,
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
