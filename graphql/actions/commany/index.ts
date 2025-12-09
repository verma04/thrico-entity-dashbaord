import {
  MutationHookOptions,
  MutationTuple,
  QueryHookOptions,
  QueryResult,
  useMutation,
  useQuery,
} from "@apollo/client";
import { ADD_PAGES, GET_ALL_PAGES } from "../../quries/commany";

export type Page = {
  name: string;
  logo: string;
  location: string;
  type: string;
  industry: string;
  website: string;
  pageType: string;
  size: string;
  tagline: string;
  id: string;
};

export type SearchPageInput = {
  value?: string;
  limit?: number;

  // Add more fields if your schema allows
};

export type PageInput = {
  name: string;
  logo?: string;
  location?: string;
  type?: string;
  industry?: string;
  website?: string;
  pageType?: string;
  size?: string;
  tagline?: string;
  // Add more fields if your schema allows
};

// --- Apollo Client Hooks ---

export function useAllPages(
  options?: QueryHookOptions<
    { getAllPages: Page[] },
    { input?: SearchPageInput }
  >
): QueryResult<{ getAllPages: Page[] }, { input?: SearchPageInput }> {
  return useQuery(GET_ALL_PAGES, options);
}

export function useAddPage(
  options?: MutationHookOptions<{ addPage: Page }, { input: PageInput }>
): MutationTuple<{ addPage: Page }, { input: PageInput }> {
  return useMutation(ADD_PAGES, options);
}
