import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_GROUP_INTERESTS,
  DELETE_GROUP_INTERESTS,
  DUPLICATE_GROUP_INTERESTS,
  EDIT_GROUP_INTERESTS,
  GROUP_INTERESTS,
} from "../../../quries/group/Interests";
import { ADD_FEATURED_GROUP } from "../../../quries/group/approval";

export const getAllGroupInterests = (options: any) =>
  useQuery(GROUP_INTERESTS, options);

export const addGroupInterests = (options: any) =>
  useMutation(ADD_GROUP_INTERESTS, {
    onCompleted: options.onCompleted,
    update(cache, { data: { addGroupInterests } }) {
      try {
        const { getAllGroupInterests }: any = cache.readQuery({
          query: GROUP_INTERESTS,
        });

        cache.writeQuery({
          query: GROUP_INTERESTS,

          data: {
            getAllGroupInterests: [
              ...addGroupInterests,
              ...getAllGroupInterests,
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const deleteGroupInterests = (options: any) =>
  useMutation(DELETE_GROUP_INTERESTS, options);

export const duplicateGroupInterests = (options: any) =>
  useMutation(DUPLICATE_GROUP_INTERESTS, {
    update(cache, { data: { duplicateGroupInterests } }) {
      try {
        const { getAllGroupInterests }: any = cache.readQuery({
          query: GROUP_INTERESTS,
        });

        cache.writeQuery({
          query: GROUP_INTERESTS,

          data: {
            getAllGroupInterests: [
              ...duplicateGroupInterests,
              ...getAllGroupInterests,
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const editGroupInterests = (options: any) =>
  useMutation(EDIT_GROUP_INTERESTS, {
    onCompleted: options.onCompleted,
    update(cache, { data: { editGroupInterests } }) {
      try {
        const { getAllGroupTheme }: any = cache.readQuery({
          query: GROUP_INTERESTS,
        });

        const data = getAllGroupTheme.map((item) => {
          return item.id === editGroupInterests.id ? editGroupInterests : item;
        });
        cache.writeQuery({
          query: EDIT_GROUP_INTERESTS,
          data: {
            getAllGroupTheme: [...data],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const addFeaturedGroup = (options: any) =>
  useMutation(ADD_FEATURED_GROUP, {
    onCompleted: options.onCompleted,
  });
