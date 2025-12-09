import {
  gql,
  useMutation,
  MutationHookOptions,
  MutationTuple,
  QueryHookOptions,
  QueryResult,
  useQuery,
} from "@apollo/client";
import {
  ADD_EVENT,
  CHANGE_EVENT_STATUS,
  CHANGE_EVENT_VERIFICATION,
  GET_EVENT_STATS,
  GET_EVENTS,
  GET_ALL_EVENTS,
} from "../../quries/events";

// --- TypeScript Types ---

export type EventLocation = {
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
};

export type Event = {
  id: string;
  title: string;
  location: EventLocation;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  type: string;
  lastDateOfRegistration: string;
  cover?: string;
  entity: string;
  numberOfAttendees: number;
  numberOfViews: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  verification: {
    id: string;
    isVerifiedAt: string | null;
    isVerified: boolean;
    verificationReason: string | null;
  };
};

export type PostEventInput = {
  title: string;
  location: EventLocation;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  type: "IN_PERSON" | "ONLINE" | "HYBRID";
  lastDateOfRegistration: string;
  coverImage?: string;
  entity: string;
};

// --- Apollo Client Hook ---

export function useAddEvent(
  options?: MutationHookOptions<{ addEvent: Event }, { input: PostEventInput }>
) {
  return useMutation(ADD_EVENT, {
    ...options,
    update(cache, { data }) {
      try {
        const addEvent = data?.addEvent;
        if (addEvent && addEvent.status === "APPROVED") {
          // Update for status: "APPROVED"
          const approvedData: any = cache.readQuery({
            query: GET_EVENTS,
            variables: {
              input: {
                status: "APPROVED",
              },
            },
          });

          cache.writeQuery({
            query: GET_EVENTS,
            data: {
              getEvents: [addEvent, ...(approvedData?.getEvents || [])],
            },
            variables: {
              input: {
                status: "APPROVED",
              },
            },
          });

          // Update for status: "ALL"
          const allData: any = cache.readQuery({
            query: GET_EVENTS,
            variables: {
              input: {
                status: "ALL",
              },
            },
          });

          cache.writeQuery({
            query: GET_EVENTS,
            data: {
              getEvents: [addEvent, ...(allData?.getEvents || [])],
            },
            variables: {
              input: {
                status: "ALL",
              },
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
}

export enum EventStatus {
  ALL = "ALL",
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  DISABLED = "DISABLED",
  PAUSED = "PAUSED",
}

// TypeScript interface for GetEventInput
export interface GetEventInput {
  status?: EventStatus;
}

// TypeScript interface for GetAllEventsInput
export interface GetAllEventsInput {
  status?: EventStatus;
  entityId?: string;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

// --- Apollo Client Hook ---

export function useEvents(
  options?: QueryHookOptions<{ getEvents: Event[] }, { input?: GetEventInput }>
): QueryResult<{ getEvents: Event[] }, { input?: GetEventInput }> {
  return useQuery(GET_EVENTS, options);
}

// --- Apollo Client Hook for GetAllEvents ---

export function useAllEvents(
  options?: QueryHookOptions<
    { getAllEvents: Event[] },
    { input?: GetAllEventsInput }
  >
): QueryResult<{ getAllEvents: Event[] }, { input?: GetAllEventsInput }> {
  return useQuery(GET_ALL_EVENTS, options);
}

export type EventStats = {
  totalEvents: number;
  activeEvents: number;
  totalAttendees: number;
  totalViews: number;
  avgAttendees: number;
  attendeesThisWeek: number;
  attendeesLastWeek: number;
  attendeesWeeklyChange: number;
  viewsThisWeek: number;
  viewsLastWeek: number;
  viewsWeeklyChange: number;
};

// --- Apollo Client Hook ---

export function useEventStats(
  options?: QueryHookOptions<{ getEventStats: EventStats }>
): QueryResult<{ getEventStats: EventStats }> {
  return useQuery(GET_EVENT_STATS, options);
}

export function useChangeEventStatus(options?: MutationHookOptions<any, any>) {
  return useMutation(CHANGE_EVENT_STATUS, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENTS,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_EVENTS,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_EVENTS,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },
      {
        query: GET_EVENTS,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  });
}

export function useChangeEventVerification(
  options?: MutationHookOptions<any, any>
) {
  return useMutation(CHANGE_EVENT_VERIFICATION, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENTS,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_EVENTS,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  });
}
