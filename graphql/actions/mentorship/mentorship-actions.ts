import { useMutation, useLazyQuery } from "@apollo/client";
import { ADD_MENTOR, SEARCH_USER_BY_NAME } from "../../quries/mentorship";

export const useSearchUserByName = (options?: any) => {
  return useLazyQuery(SEARCH_USER_BY_NAME, options);
};

export const useAddMentor = (options?: any) => {
  return useMutation(ADD_MENTOR, options);
};
