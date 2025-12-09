import { gql } from "@apollo/client";

const events = `
  id
  title
  slug
  description
  cover
  entityId
  status
  updatedAt
  createdAt
  startDate
  endDate
  startTime
  type
  lastDateOfRegistration
  location 
  visibility
  verification {
    id
    eventId
    isVerified
    verifiedBy
    isVerifiedAt
    verificationReason
  }
`;

export const ADD_EVENT = gql`
  mutation AddEvent($input: PostEventInput!) {
    addEvent(input: $input) {
      ${events}
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents($input: GetEventInput) {
    getEvents(input: $input) {
      ${events}
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query GetAllEvents($input: GetAllEventsInput) {
    getAllEvents(input: $input) {
      ${events}
    }
  }
`;

export const CHANGE_EVENT_STATUS = gql`
  mutation ChangeEventStatus($input: ChangeEventStatusInput!) {
    changeEventStatus(input: $input) {
      ${events}
    }
  }
`;

export const CHANGE_EVENT_VERIFICATION = gql`
  mutation ChangeEventVerification($input: ChangeEventStatusInput!) {
    changeEventVerification(input: $input) {
      ${events}
    }
  }
`;

export const GET_EVENT_STATS = gql`
  query GetEventStats {
    getEventStats {
      totalEvents
      activeEvents
      totalAttendees
      totalViews
      avgAttendees
      attendeesThisWeek
      attendeesLastWeek
      attendeesWeeklyChange
      viewsThisWeek
      viewsLastWeek
      viewsWeeklyChange
    }
  }
`;
