import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_FAQ,
  DELETE_FAQ,
  EDIT_FAQ,
  GET_FAQ,
  GET_FAQ_BY_MODULE,
  GET_TERMS_AND_CONDITIONS_BY_MODULE,
  SORT_FAQ,
  UPDATE_FAQ_BY_MODULE,
  UPDATE_TERMS_AND_CONDITIONS_BY_MODULE,
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

// TypeScript types for GetFaqByModule
export interface ModuleInput {
  module: string | null;
}

export interface FaqByModule {
  faq: string;
  module: string;
}

export interface GetFaqByModuleResponse {
  getFaqByModule: FaqByModule;
}

export interface GetFaqByModuleVariables {
  input: ModuleInput;
}

// Hook for GetFaqByModule query
export const useGetFaqByModule = (options?: any) =>
  useQuery<GetFaqByModuleResponse, GetFaqByModuleVariables>(
    GET_FAQ_BY_MODULE,
    options
  );

// TypeScript types for GetTermsAndConditionsByModule
export interface TermsAndConditionsByModule {
  module: string;
  termsAndConditions: string;
}

export interface GetTermsAndConditionsByModuleResponse {
  getTermsAndConditionsByModule: TermsAndConditionsByModule;
}

export interface GetTermsAndConditionsByModuleVariables {
  input: ModuleInput;
}

// Hook for GetTermsAndConditionsByModule query
export const useGetTermsAndConditionsByModule = (options?: any) =>
  useQuery<
    GetTermsAndConditionsByModuleResponse,
    GetTermsAndConditionsByModuleVariables
  >(GET_TERMS_AND_CONDITIONS_BY_MODULE, options);

// TypeScript types for UpdateFaqByModule mutation
export interface UpdateFaqByModuleVariables {
  module: string;
  faq: any; // JSON type
}

export interface UpdateFaqByModuleResponse {
  updateFaqByModule: FaqByModule;
}

// Hook for UpdateFaqByModule mutation
export const useUpdateFaqByModule = (options?: any) =>
  useMutation<UpdateFaqByModuleResponse, UpdateFaqByModuleVariables>(
    UPDATE_FAQ_BY_MODULE,
    {
      ...options,
      refetchQueries: [
        {
          query: GET_FAQ_BY_MODULE,
          variables: {
            input: {
              module: options?.module || null,
            },
          },
        },
      ],
      awaitRefetchQueries: true,
    }
  );

// TypeScript types for UpdateTermsAndConditionsByModule mutation
export interface UpdateTermsAndConditionsByModuleVariables {
  module: string;
  termsAndConditions: any; // JSON type
}

export interface UpdateTermsAndConditionsByModuleResponse {
  updateTermsAndConditionsByModule: TermsAndConditionsByModule;
}

// Hook for UpdateTermsAndConditionsByModule mutation
export const useUpdateTermsAndConditionsByModule = (options?: any) =>
  useMutation<
    UpdateTermsAndConditionsByModuleResponse,
    UpdateTermsAndConditionsByModuleVariables
  >(UPDATE_TERMS_AND_CONDITIONS_BY_MODULE, {
    ...options,
    refetchQueries: [
      {
        query: GET_TERMS_AND_CONDITIONS_BY_MODULE,
        variables: {
          input: {
            module: options?.module || null,
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  });
