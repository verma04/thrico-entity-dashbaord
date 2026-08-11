import {
  MutationHookOptions,
  MutationTuple,
  QueryHookOptions,
  QueryResult,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  ADD_PAGES,
  GET_ALL_PAGES,
  GET_SEARCH_COMPANIES,
  GET_SEARCH_JOB_TITLE,
  GET_SEARCH_SKILLS,
  GET_SEARCH_DEGREE,
  GET_SEARCH_INTERESTS,
  GET_SEARCH_INDUSTRIES,
  GET_SEARCH_FUNCTIONS,
} from "../../quries/commany";

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

export type ClassificationSearchInput = {
  search?: string | null;
  limit?: number | null;
  cursor?: string | null;
};

export type SearchCompanyNode = {
  id: string;
  title: string;
};

export type SearchCompanyEdge = {
  node: SearchCompanyNode;
};

export type SearchCompaniesResponse = {
  getSearchCompanies: {
    edges: SearchCompanyEdge[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

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

export function useSearchCompanies(
  options?: QueryHookOptions<SearchCompaniesResponse, { input?: ClassificationSearchInput }>
): QueryResult<SearchCompaniesResponse, { input?: ClassificationSearchInput }> {
  return useQuery(GET_SEARCH_COMPANIES, options);
}

export type SearchJobTitleResponse = {
  getSearchJobTitle: {
    edges: SearchCompanyEdge[]; // reusing edge type since it has node { id, title }
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

export function useSearchJobTitle(
  options?: QueryHookOptions<SearchJobTitleResponse, { input?: ClassificationSearchInput }>
): QueryResult<SearchJobTitleResponse, { input?: ClassificationSearchInput }> {
  return useQuery(GET_SEARCH_JOB_TITLE, options);
}

export type SearchSkillsResponse = {
  getSearchSkills: {
    edges: {
      node: SearchCompanyNode;
      cursor: string;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

export function useSearchSkills(
  options?: QueryHookOptions<SearchSkillsResponse, { input?: ClassificationSearchInput }>
): QueryResult<SearchSkillsResponse, { input?: ClassificationSearchInput }> {
  return useQuery(GET_SEARCH_SKILLS, options);
}

export type SearchDegreeResponse = {
  getSearchDegree: {
    edges: {
      node: SearchCompanyNode;
      cursor: string;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

export function useSearchDegree(
  options?: QueryHookOptions<SearchDegreeResponse, { input?: ClassificationSearchInput }>
): QueryResult<SearchDegreeResponse, { input?: ClassificationSearchInput }> {
  return useQuery(GET_SEARCH_DEGREE, options);
}

export type SearchInterestsResponse = {
  getSearchInterests: {
    edges: {
      node: SearchCompanyNode;
      cursor: string;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

export function useSearchInterests(
  options?: QueryHookOptions<SearchInterestsResponse, { input?: ClassificationSearchInput }>
): QueryResult<SearchInterestsResponse, { input?: ClassificationSearchInput }> {
  return useQuery(GET_SEARCH_INTERESTS, options);
}

export type SearchIndustriesResponse = {
  getSearchIndustries: {
    edges: {
      node: SearchCompanyNode;
      cursor: string;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

export function useSearchIndustries(
  options?: QueryHookOptions<SearchIndustriesResponse, { input?: ClassificationSearchInput }>
): QueryResult<SearchIndustriesResponse, { input?: ClassificationSearchInput }> {
  return useQuery(GET_SEARCH_INDUSTRIES, options);
}

export type SearchFunctionsResponse = {
  getSearchFunctions: {
    edges: {
      node: SearchCompanyNode;
      cursor: string;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
};

export function useSearchFunctions(
  options?: QueryHookOptions<SearchFunctionsResponse, { input?: ClassificationSearchInput }>
): QueryResult<SearchFunctionsResponse, { input?: ClassificationSearchInput }> {
  return useQuery(GET_SEARCH_FUNCTIONS, options);
}
