import { useMutation, useQuery } from "@apollo/client";
import { EDIT_THEME, GET_THEME } from "../../quries/theme";

export const getEntityTheme = () => useQuery(GET_THEME);

export const editEntityTheme = (options: any) =>
  useMutation(EDIT_THEME, options);
