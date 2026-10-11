import {
  type MutationHookOptions,
  type QueryHookOptions,
  useMutation,
  useQuery,
} from "@apollo/client";
import { EDIT_THEME, GET_THEME } from "../../quries/theme";

export const useGetEntityTheme = (options?: QueryHookOptions) =>
  useQuery(GET_THEME, options);

export const useEditEntityTheme = (options?: MutationHookOptions) =>
  useMutation(EDIT_THEME, options);
