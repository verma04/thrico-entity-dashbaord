import { useMutation, useQuery } from "@apollo/client";
import { EDIT_THEME, GET_THEME } from "../../quries/theme";

export const useGetEntityTheme = () => useQuery(GET_THEME);

export const useEditEntityTheme = (options: any) =>
  useMutation(EDIT_THEME, options);
