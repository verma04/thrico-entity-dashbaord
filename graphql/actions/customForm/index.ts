import { useMutation, useQuery } from "@apollo/client";
import { ADD_CUSTOM_FORM, GET_ALL_CUSTOM_FORM } from "../../quries/customForm";

export const AddCustomForm = (options: any) =>
  useMutation(ADD_CUSTOM_FORM, {
    ...options,

    update(cache, { data: { addCustomForm } }) {
      try {
        const { getCustomForms }: any = cache.readQuery({
          query: GET_ALL_CUSTOM_FORM,
          variables: {
            input: {
              by: "ALL",
            },
          },
        });

        cache.writeQuery({
          query: GET_ALL_CUSTOM_FORM,
          data: { getCustomForms: [addCustomForm, ...getCustomForms] },
          variables: {
            input: {
              by: "ALL", // Match the limit in your Following screen
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const getCustomForms = (options: any) =>
  useQuery(GET_ALL_CUSTOM_FORM, options);
