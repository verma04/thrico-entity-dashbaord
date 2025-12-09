import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_FAQ,
  DELETE_FAQ,
  EDIT_FAQ,
  GET_FAQ,
  SORT_FAQ,
} from "../../quries/faq";
import { ALL_GROUP } from "../../quries/group/approval";

export const getModuleFaq = (options: any) => useQuery(GET_FAQ, options);

export const getAllGroup = (options: any) => useQuery(ALL_GROUP, options);

export const addFaq = (options: any) =>
  useMutation(ADD_FAQ, {
    onCompleted: options.onCompleted,
    update(cache, { data: { addFaq } }) {
      console.log(options);
      try {
        const { getModuleFaq }: any = cache.readQuery({
          query: GET_FAQ,
          variables: {
            input: {
              module: options.module,
            },
          },
        });

        cache.writeQuery({
          query: GET_FAQ,

          data: {
            getModuleFaq: [...addFaq, ...getModuleFaq],
          },
          variables: {
            input: {
              module: options.module,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const editFaq = (options: any) =>
  useMutation(EDIT_FAQ, {
    onCompleted: options.onCompleted,
    update(cache, { data: { editFaq } }) {
      // try {
      // } catch (error) {
      //   console.log(error);
      // }
    },
  });

export const deleteFaq = (options: any) =>
  useMutation(DELETE_FAQ, {
    onCompleted: options.onCompleted,
    update(cache, { data: { deleteFaq } }) {
      console.log(options.onCompleted);
      try {
        const { getModuleFaq }: any = cache.readQuery({
          query: GET_FAQ,
          variables: {
            input: {
              module: options.module,
            },
          },
        });

        const data = getModuleFaq.filter((set) => set.id !== deleteFaq.id);
        cache.writeQuery({
          query: GET_FAQ,
          data: {
            getModuleFaq: [...data],
          },
          variables: {
            input: {
              module: options.module,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
      // try {
      //   const { getModuleFaq }: any = cache.readQuery({
      //     query: GET_FAQ,
      //     variables: {
      //       input: {
      //         module: options.module,
      //       },
      //     },
      //   });

      //   const data = getModuleFaq.filter((item) => {
      //     item.id !== deleteFaq.id;
      //   });
      //   cache.writeQuery({
      //     query: GET_FAQ,
      //     data: {
      //       getModuleFaq: [...data],
      //     },
      //     variables: {
      //       input: {
      //         module: options.module,
      //       },
      //     },
      //   });
      // } catch (error) {
      //   console.log(error);
      // }
    },
  });

export const sortFaq = (options: any) =>
  useMutation(SORT_FAQ, {
    onCompleted: options.onCompleted,
    update(cache, { data: { sortFaq } }) {
      try {
        cache.writeQuery({
          query: GET_FAQ,

          data: {
            getModuleFaq: [...sortFaq],
          },
          variables: {
            input: {
              module: options.module,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
