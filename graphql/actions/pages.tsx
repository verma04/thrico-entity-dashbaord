import { useMutation, useQuery } from "@apollo/client";
import {
  CHECK_CUSTOM_PAGES,
  CUSTOM_PAGE_WORDPRESS,
  SYNC_WORD_PRESS_PAGES,
} from "../quries/pages";

export const checkCustomPages = (options: any) =>
  useQuery(CHECK_CUSTOM_PAGES, options);

export const customPageWordpress = (options: any) =>
  useMutation(CUSTOM_PAGE_WORDPRESS, {
    onCompleted: options.onCompleted,
  });

export const syncWordPressPages = (options: any) =>
  useMutation(SYNC_WORD_PRESS_PAGES, {
    onCompleted: options.onCompleted,
    update(cache, { data: { syncWordPressPages } }) {
      try {
        const { checkCustomPages }: any = cache.readQuery({
          query: CHECK_CUSTOM_PAGES,
        });

        cache.writeQuery({
          query: CHECK_CUSTOM_PAGES,

          data: {
            checkCustomPages: {
              ...checkCustomPages,
              pages: syncWordPressPages,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
