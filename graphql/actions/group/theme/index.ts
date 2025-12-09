import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_GROUP_THEME,
  DELETE_GROUP_THEME,
  DUPLICATE_GROUP_THEME,
  EDIT_GROUP_THEME,
  GROUP_THEME,
} from "../../../quries/group/theme";

export const getAllGroupTheme = (options: any) =>
  useQuery(GROUP_THEME, options);

export const addGroupTheme = (options: any) =>
  useMutation(ADD_GROUP_THEME, {
    onCompleted: options.onCompleted,
    update(cache, { data: { addGroupTheme } }) {
      try {
        const { getAllGroupTheme }: any = cache.readQuery({
          query: GROUP_THEME,
        });

        cache.writeQuery({
          query: GROUP_THEME,

          data: {
            getAllGroupTheme: [...addGroupTheme, ...getAllGroupTheme],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const deleteGroupTheme = (options: any) =>
  useMutation(DELETE_GROUP_THEME, {
    onCompleted: options.onCompleted,
    update(cache, { data: { deleteGroupTheme } }) {
      try {
        const { getAllGroupTheme }: any = cache.readQuery({
          query: GROUP_THEME,
        });

        const data = getAllGroupTheme.filter(
          (t) => t.id !== deleteGroupTheme.id
        );
        cache.writeQuery({
          query: GROUP_THEME,

          data: {
            getAllGroupTheme: [...data],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const duplicateGroupTheme = (options: any) =>
  useMutation(DUPLICATE_GROUP_THEME, {
    onCompleted: options.onCompleted,
    update(cache, { data: { duplicateGroupTheme } }) {
      try {
        const { getAllGroupTheme }: any = cache.readQuery({
          query: GROUP_THEME,
        });

        cache.writeQuery({
          query: GROUP_THEME,

          data: {
            getAllGroupTheme: [...duplicateGroupTheme, ...getAllGroupTheme],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const editGroupTheme = (options: any) =>
  useMutation(EDIT_GROUP_THEME, {
    onCompleted: options.onCompleted,
    update(cache, { data: { editGroupTheme } }) {
      try {
        const { getAllGroupTheme }: any = cache.readQuery({
          query: GROUP_THEME,
        });

        const data = getAllGroupTheme.map((item) => {
          return item.id === editGroupTheme.id ? editGroupTheme : item;
        });
        cache.writeQuery({
          query: GROUP_THEME,
          data: {
            getAllGroupTheme: [...data],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
