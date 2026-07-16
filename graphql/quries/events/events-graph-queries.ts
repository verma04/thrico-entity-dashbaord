import { gql, useQuery } from "@apollo/client";

export const GET_EVENTS_USERS_GRAPH = gql`
  query GetEventUserGraph($limit: Int) {
    getEventUserGraph(limit: $limit) {
      event {
        id
        title
      }
      creator {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
    }
  }
`;

export interface EventsGraphUser {
  id: string;
  globalUserId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
}

export interface EventsGraphEvent {
  id: string;
  title: string;
}

export interface EventsGraphEdge {
  creator: EventsGraphUser;
  event: EventsGraphEvent;
}

export interface GetEventsUsersGraphResponse {
  getEventUserGraph: EventsGraphEdge[];
}

export function useGetEventUserGraph(options?: any) {
  return useQuery<GetEventsUsersGraphResponse>(
    GET_EVENTS_USERS_GRAPH,
    options
  );
}
