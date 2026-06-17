import { gql, useQuery } from "@apollo/client";

export const GET_USER_EDUCATION_GRAPH = gql`
  query GetUserEducationGraph($limit: Int) {
    getUserEducationGraph(limit: $limit) {
      user {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      school {
        id
        title
      }
    }
  }
`;

export interface EducationGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface EducationGraphSchool {
  id: string;
  title: string;
}

export interface EducationGraphEdge {
  user: EducationGraphUser;
  school: EducationGraphSchool;
}

export interface GetUserEducationGraphResponse {
  getUserEducationGraph: EducationGraphEdge[];
}

export function useGetUserEducationGraph(options?: any) {
  return useQuery<GetUserEducationGraphResponse>(
    GET_USER_EDUCATION_GRAPH,
    options
  );
}
