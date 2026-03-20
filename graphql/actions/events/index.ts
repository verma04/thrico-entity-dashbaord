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
  GET_EVENT_BY_ID,
  UPDATE_EVENT,
  GET_EVENT_SPEAKERS,
  ADD_EVENT_SPEAKER,
  UPDATE_EVENT_SPEAKER,
  DELETE_EVENT_SPEAKER,
  TOGGLE_SPEAKER_FEATURED,
  GET_EVENT_SPONSORSHIPS,
  ADD_EVENT_SPONSORSHIP,
  UPDATE_EVENT_SPONSORSHIP,
  DELETE_EVENT_SPONSORSHIP,
  ADD_EVENT_SPONSOR,
  UPDATE_EVENT_SPONSOR,
  DELETE_EVENT_SPONSOR,
  GET_EVENT_VENUES,
  ADD_EVENT_VENUE,
  UPDATE_EVENT_VENUE,
  DELETE_EVENT_VENUE,
  GET_EVENT_AGENDAS,
  ADD_EVENT_AGENDA,
  UPDATE_EVENT_AGENDA,
  DELETE_EVENT_AGENDA,
  GET_EVENT_TICKETS,
  ADD_EVENT_TICKET,
  UPDATE_EVENT_TICKET,
  DELETE_EVENT_TICKET,
  GET_EVENT_PROMO_CODES,
  ADD_EVENT_PROMO_CODE,
  UPDATE_EVENT_PROMO_CODE,
  DELETE_EVENT_PROMO_CODE,
  GET_EVENT_REGISTRATION_SETTINGS,
  UPSERT_EVENT_REGISTRATION_SETTINGS,
  GET_EVENT_REGISTRATION_FIELDS,
  ADD_EVENT_REGISTRATION_FIELD,
  UPDATE_EVENT_REGISTRATION_FIELD,
  DELETE_EVENT_REGISTRATION_FIELD,
  GET_EVENT_MEDIA,
  ADD_EVENT_MEDIA,
  UPDATE_EVENT_MEDIA,
  DELETE_EVENT_MEDIA,
  UPDATE_EVENT_MEDIA_VISIBILITY,
  GET_EVENT_SETTINGS,
  UPSERT_EVENT_SETTINGS,
  DELETE_EVENT,
  GET_EVENT_ATTENDEES,
  ADD_EVENT_ATTENDEE,
  UPDATE_ATTENDEE_STATUS,
  TOGGLE_ATTENDEE_CHECKIN,
  GET_EVENT_DETAIL_STATS,
  GET_EVENT_REGISTRATION_TREND,
  GET_EVENT_TYPE_DISTRIBUTION,
  GET_EVENT_ATTENDEE_ACTIVITY,
  GET_TOP_PERFORMING_EVENTS,
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

export type EventSpeaker = {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  bio?: string;
  title?: string;
  company?: string;
  avatar?: string;
  socialLinks?: any;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  status: boolean;
};

export type EventSpeakerInput = {
  eventId: string;
  name: string;
  email?: string;
  bio?: string;
  title?: string;
  company?: string;
  avatar?: string;
  socialLinks?: any;
  isFeatured?: boolean;
  displayOrder?: number;
};

export type EventSponsor = {
  id: string;
  eventId: string;
  sponsorShipId: string;
  sponsorName: string;
  sponsorLogo: string;
  sponsorUserName: string;
  sponsorUserDesignation: string;
  isApproved: boolean;
  createdAt: string;
};

export type EventSponsorship = {
  id: string;
  eventId: string;
  sponsorType: string;
  price: number;
  currency: string;
  showPrice: boolean;
  content: any;
  createdAt: string;
  sponsors: EventSponsor[];
};

export type EventSponsorshipInput = {
  eventId: string;
  sponsorType: string;
  price: number;
  currency: string;
  showPrice?: boolean;
  content?: any;
};

export type EventSponsorInput = {
  eventId: string;
  sponsorShipId: string;
  sponsorName: string;
  sponsorLogo: string;
  sponsorUserName: string;
  sponsorUserDesignation: string;
  isApproved?: boolean;
};

export type EventVenue = {
  id: string;
  eventId: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  description?: string;
  amenities?: string[];
  contactInfo?: any;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  status: boolean;
};

export type EventVenueInput = {
  eventId: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  description?: string;
  amenities?: string[];
  contactInfo?: any;
  images?: string[];
  status?: boolean;
};

export type EventAgenda = {
  id: string;
  eventId: string;
  title: string;
  videoSteam?: string;
  venueId?: string;
  date: string;
  startTime: string;
  endTime: string;
  isPublished?: boolean;
  isPinned?: boolean;
  isDraft?: boolean;
  createdAt: string;
  updatedAt: string;
  venue?: EventVenue;
};

export type EventAgendaInput = {
  eventId: string;
  title: string;
  videoSteam?: string;
  venueId?: string;
  date: string;
  startTime: string;
  endTime: string;
  isPublished?: boolean;
  isPinned?: boolean;
  isDraft?: boolean;
};

export type EventRegistrationSettings = {
  id: string;
  eventId: string;
  isRegistrationOpen: boolean;
  enableWaitlist: boolean;
  requireApproval: boolean;
  confirmationSubject?: string;
  confirmationBody?: string;
  createdAt: string;
  updatedAt: string;
};

export type EventRegistrationSettingsInput = {
  eventId: string;
  isRegistrationOpen?: boolean;
  enableWaitlist?: boolean;
  requireApproval?: boolean;
  confirmationSubject?: string;
  confirmationBody?: string;
};

export type EventRegistrationField = {
  id: string;
  eventId: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type EventRegistrationFieldInput = {
  eventId: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  displayOrder?: number;
};

export type EventMedia = {
  id: string;
  eventId: string;
  url: string;
  mediaType: "VIDEO" | "IMAGE";
  title?: string;
  tags?: string[];
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EventMediaInput = {
  eventId: string;
  url: string;
  mediaType: "VIDEO" | "IMAGE";
  title?: string;
  tags?: string[];
  isPublic?: boolean;
};

export type EventSettings = {
  id: string;
  eventId: string;
  layout: string;
  createdAt: string;
  updatedAt: string;
};

export type EventSettingsInput = {
  eventId: string;
  layout?: string;
};

export type EventAttendee = {
  id: string;
  eventId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  ticketId?: string;
  ticket?: {
    id: string;
    name: string;
  };
  status: "CONFIRMED" | "WAITLISTED" | "PENDING" | "CANCELLED";
  checkedIn: boolean;
  responses?: any;
  createdAt: string;
  updatedAt: string;
};

export type AddEventAttendeeInput = {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketId?: string;
  status?: string;
};

export type EventDetailStats = {
  totalTicketsSold: number;
  totalRevenue: number;
  totalAttendees: number;
  checkInRate: number;
};

export type RegistrationTrend = {
  name: string;
  registrations: number;
  views: number;
};

export type EventTypeDistribution = {
  name: string;
  value: number;
  color: string;
};

export type AttendeeActivity = {
  name: string;
  registered: number;
  checkedIn: number;
};

export type TopPerformingEvent = {
  id: string;
  title: string;
  type: string;
  attendees: number;
  views: number;
  status: string;
  cover?: string;
  date: string;
};

// --- Apollo Client Hook ---

export function useAddEvent(
  options?: MutationHookOptions<{ addEvent: Event }, { input: PostEventInput }>,
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
  options?: QueryHookOptions<{ getEvents: Event[] }, { input?: GetEventInput }>,
): QueryResult<{ getEvents: Event[] }, { input?: GetEventInput }> {
  return useQuery(GET_EVENTS, options);
}

// --- Apollo Client Hook for GetAllEvents ---

export function useAllEvents(
  options?: QueryHookOptions<
    { getAllEvents: Event[] },
    { input?: GetAllEventsInput }
  >,
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
  options?: QueryHookOptions<{ getEventStats: EventStats }>,
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
  options?: MutationHookOptions<any, any>,
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

export function useEventById(id: string) {
  return useQuery(GET_EVENT_BY_ID, {
    variables: { id },
    skip: !id,
  });
}

export function useUpdateEvent(options?: MutationHookOptions<any, any>) {
  return useMutation(UPDATE_EVENT, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENT_BY_ID,
        variables: { id: options?.variables?.eventId },
      },
    ],
  });
}

export function useEventSpeakers(eventId: string) {
  return useQuery(GET_EVENT_SPEAKERS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });
}

export function useAddEventSpeaker(options?: MutationHookOptions<any, any>) {
  return useMutation(ADD_EVENT_SPEAKER, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENT_SPEAKERS,
        variables: { eventId: options?.variables?.input?.eventId },
      },
    ],
  });
}

export function useUpdateEventSpeaker(options?: MutationHookOptions<any, any>) {
  return useMutation(UPDATE_EVENT_SPEAKER, {
    ...options,
  });
}

export function useDeleteEventSpeaker(options?: MutationHookOptions<any, any>) {
  return useMutation(DELETE_EVENT_SPEAKER, {
    ...options,
  });
}

export function useToggleSpeakerFeatured(
  options?: MutationHookOptions<any, any>,
) {
  return useMutation(TOGGLE_SPEAKER_FEATURED, {
    ...options,
  });
}

// --- Sponsorship Hooks ---
export function useEventSponsorships(eventId: string) {
  return useQuery(GET_EVENT_SPONSORSHIPS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });
}

export function useAddEventSponsorship(
  options?: MutationHookOptions<any, any>,
) {
  return useMutation(ADD_EVENT_SPONSORSHIP, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENT_SPONSORSHIPS,
        variables: { eventId: options?.variables?.input?.eventId },
      },
    ],
  });
}

export function useUpdateEventSponsorship(
  options?: MutationHookOptions<any, any>,
) {
  return useMutation(UPDATE_EVENT_SPONSORSHIP, { ...options });
}

export function useDeleteEventSponsorship(
  options?: MutationHookOptions<any, any>,
) {
  return useMutation(DELETE_EVENT_SPONSORSHIP, { ...options });
}

export function useAddEventSponsor(options?: MutationHookOptions<any, any>) {
  return useMutation(ADD_EVENT_SPONSOR, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENT_SPONSORSHIPS,
        variables: { eventId: options?.variables?.input?.eventId },
      },
    ],
  });
}

export function useUpdateEventSponsor(options?: MutationHookOptions<any, any>) {
  return useMutation(UPDATE_EVENT_SPONSOR, { ...options });
}

export function useDeleteEventSponsor(options?: MutationHookOptions<any, any>) {
  return useMutation(DELETE_EVENT_SPONSOR, { ...options });
}

export type EventTicket = {
  id: string;
  eventId: string;
  name: string;
  type: "free" | "paid" | "donation";
  price: number;
  quantity: number;
  sold: number;
  description?: string;
  earlyBirdPrice?: number;
  earlyBirdDeadline?: string;
  maxPerOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
  status?: boolean;
};

export type EventTicketInput = {
  eventId: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  description?: string;
  earlyBirdPrice?: number;
  earlyBirdDeadline?: string;
  maxPerOrder: number;
  isVisible: boolean;
};

export type EventPromoCode = {
  id: string;
  eventId: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  usageLimit: number;
  used: number;
  expiryDate: string;
  applicableTickets?: string[];
  createdAt?: string;
  updatedAt?: string;
  status?: boolean;
};

export type EventPromoCodeInput = {
  eventId: string;
  code: string;
  discountType: string;
  discountValue: number;
  usageLimit: number;
  expiryDate: string;
  applicableTickets?: string[];
};

// --- Hooks ---
export function useEventVenues(eventId: string) {
  return useQuery(GET_EVENT_VENUES, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });
}

export function useAddEventVenue(options?: MutationHookOptions<any, any>) {
  return useMutation(ADD_EVENT_VENUE, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENT_VENUES,
        variables: { eventId: options?.variables?.input?.eventId },
      },
    ],
  });
}

export function useUpdateEventVenue(options?: MutationHookOptions<any, any>) {
  return useMutation(UPDATE_EVENT_VENUE, { ...options });
}

export function useDeleteEventVenue(options?: MutationHookOptions<any, any>) {
  return useMutation(DELETE_EVENT_VENUE, { ...options });
}

// --- Event Agenda Hooks ---

export function useEventAgendas(eventId: string) {
  return useQuery(GET_EVENT_AGENDAS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });
}

export function useAddEventAgenda(options?: MutationHookOptions<any, any>) {
  return useMutation(ADD_EVENT_AGENDA, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENT_AGENDAS,
        variables: { eventId: options?.variables?.input?.eventId },
      },
    ],
  });
}

export function useUpdateEventAgenda(options?: MutationHookOptions<any, any>) {
  return useMutation(UPDATE_EVENT_AGENDA, { ...options });
}

export function useDeleteEventAgenda(options?: MutationHookOptions<any, any>) {
  return useMutation(DELETE_EVENT_AGENDA, { ...options });
}

// --- Event Ticketing & Promo Code Hooks ---

export function useEventTickets(eventId: string) {
  return useQuery(GET_EVENT_TICKETS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });
}

export function useAddEventTicket(options?: MutationHookOptions<any, any>) {
  return useMutation(ADD_EVENT_TICKET, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENT_TICKETS,
        variables: { eventId: options?.variables?.input?.eventId },
      },
    ],
  });
}

export function useUpdateEventTicket(options?: MutationHookOptions<any, any>) {
  return useMutation(UPDATE_EVENT_TICKET, { ...options });
}

export function useDeleteEventTicket(options?: MutationHookOptions<any, any>) {
  return useMutation(DELETE_EVENT_TICKET, { ...options });
}

export function useEventPromoCodes(eventId: string) {
  return useQuery(GET_EVENT_PROMO_CODES, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });
}

export function useAddEventPromoCode(options?: MutationHookOptions<any, any>) {
  return useMutation(ADD_EVENT_PROMO_CODE, {
    ...options,
    refetchQueries: [
      {
        query: GET_EVENT_PROMO_CODES,
        variables: { eventId: options?.variables?.input?.eventId },
      },
    ],
  });
}

export function useUpdateEventPromoCode(
  options?: MutationHookOptions<any, any>,
) {
  return useMutation(UPDATE_EVENT_PROMO_CODE, { ...options });
}

export function useDeleteEventPromoCode(
  options?: MutationHookOptions<any, any>,
) {
  return useMutation(DELETE_EVENT_PROMO_CODE, options);
}

// --- Registration Settings Hooks ---
export function useEventRegistrationSettings(eventId: string) {
  return useQuery<{ getEventRegistrationSettings: EventRegistrationSettings }>(
    GET_EVENT_REGISTRATION_SETTINGS,
    {
      variables: { eventId },
      skip: !eventId,
      fetchPolicy: "network-only",
    },
  );
}

export function useUpsertEventRegistrationSettings(
  options?: MutationHookOptions<
    { upsertEventRegistrationSettings: EventRegistrationSettings },
    { input: EventRegistrationSettingsInput }
  >,
) {
  return useMutation<
    { upsertEventRegistrationSettings: EventRegistrationSettings },
    { input: EventRegistrationSettingsInput }
  >(UPSERT_EVENT_REGISTRATION_SETTINGS, options);
}

// --- Registration Fields Hooks ---
export function useEventRegistrationFields(eventId: string) {
  return useQuery<{ getEventRegistrationFields: EventRegistrationField[] }>(
    GET_EVENT_REGISTRATION_FIELDS,
    {
      variables: { eventId },
      skip: !eventId,
      fetchPolicy: "network-only",
    },
  );
}

export function useAddEventRegistrationField(
  options?: MutationHookOptions<
    { addEventRegistrationField: EventRegistrationField },
    { input: EventRegistrationFieldInput }
  >,
) {
  return useMutation<
    { addEventRegistrationField: EventRegistrationField },
    { input: EventRegistrationFieldInput }
  >(ADD_EVENT_REGISTRATION_FIELD, options);
}

export function useUpdateEventRegistrationField(
  options?: MutationHookOptions<
    { updateEventRegistrationField: EventRegistrationField },
    { fieldId: string; input: EventRegistrationFieldInput }
  >,
) {
  return useMutation<
    { updateEventRegistrationField: EventRegistrationField },
    { fieldId: string; input: EventRegistrationFieldInput }
  >(UPDATE_EVENT_REGISTRATION_FIELD, options);
}

export function useDeleteEventRegistrationField(
  options?: MutationHookOptions<
    { deleteEventRegistrationField: boolean },
    { fieldId: string }
  >,
) {
  return useMutation<
    { deleteEventRegistrationField: boolean },
    { fieldId: string }
  >(DELETE_EVENT_REGISTRATION_FIELD, options);
}

// --- Media Hooks ---
export function useEventMedia(eventId: string) {
  return useQuery<{ getEventMedia: EventMedia[] }>(GET_EVENT_MEDIA, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "network-only",
  });
}

export function useAddEventMedia(
  options?: MutationHookOptions<
    { addEventMedia: EventMedia },
    { input: EventMediaInput }
  >,
) {
  return useMutation<{ addEventMedia: EventMedia }, { input: EventMediaInput }>(
    ADD_EVENT_MEDIA,
    options,
  );
}

export function useUpdateEventMedia(
  options?: MutationHookOptions<
    { updateEventMedia: EventMedia },
    { mediaId: string; input: EventMediaInput }
  >,
) {
  return useMutation<
    { updateEventMedia: EventMedia },
    { mediaId: string; input: EventMediaInput }
  >(UPDATE_EVENT_MEDIA, options);
}

export function useDeleteEventMedia(
  options?: MutationHookOptions<
    { deleteEventMedia: boolean },
    { mediaId: string }
  >,
) {
  return useMutation<{ deleteEventMedia: boolean }, { mediaId: string }>(
    DELETE_EVENT_MEDIA,
    options,
  );
}

export function useUpdateEventMediaVisibility(
  options?: MutationHookOptions<
    { updateEventMediaVisibility: EventMedia },
    { mediaId: string; isPublic: boolean }
  >,
) {
  return useMutation<
    { updateEventMediaVisibility: EventMedia },
    { mediaId: string; isPublic: boolean }
  >(UPDATE_EVENT_MEDIA_VISIBILITY, options);
}

// --- Settings Hooks ---
export function useEventSettings(eventId: string) {
  return useQuery<{ getEventSettings: EventSettings }>(GET_EVENT_SETTINGS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "network-only",
  });
}

export function useUpsertEventSettings(
  options?: MutationHookOptions<
    { upsertEventSettings: EventSettings },
    { input: EventSettingsInput }
  >,
) {
  return useMutation<
    { upsertEventSettings: EventSettings },
    { input: EventSettingsInput }
  >(UPSERT_EVENT_SETTINGS, options);
}

export function useDeleteEvent(
  options?: MutationHookOptions<{ deleteEvent: boolean }, { eventId: string }>,
) {
  return useMutation<{ deleteEvent: boolean }, { eventId: string }>(
    DELETE_EVENT,
    options,
  );
}

// --- Attendee Hooks ---
export function useEventAttendees(eventId: string) {
  return useQuery<{ getEventAttendees: EventAttendee[] }>(GET_EVENT_ATTENDEES, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: "network-only",
  });
}

export function useUpdateAttendeeStatus(
  options?: MutationHookOptions<
    { updateAttendeeStatus: EventAttendee },
    { attendeeId: string; status: string }
  >,
) {
  return useMutation<
    { updateAttendeeStatus: EventAttendee },
    { attendeeId: string; status: string }
  >(UPDATE_ATTENDEE_STATUS, options);
}

export function useToggleAttendeeCheckIn(
  options?: MutationHookOptions<
    { toggleAttendeeCheckIn: EventAttendee },
    { attendeeId: string }
  >,
) {
  return useMutation<
    { toggleAttendeeCheckIn: EventAttendee },
    { attendeeId: string }
  >(TOGGLE_ATTENDEE_CHECKIN, options);
}

export function useAddEventAttendee(
  options?: MutationHookOptions<
    { addEventAttendee: EventAttendee },
    { input: AddEventAttendeeInput }
  >,
) {
  return useMutation<
    { addEventAttendee: EventAttendee },
    { input: AddEventAttendeeInput }
  >(ADD_EVENT_ATTENDEE, options);
}

// --- Analytics Hooks ---
export function useEventDetailStats(eventId: string) {
  return useQuery<{ getEventDetailStats: EventDetailStats }>(
    GET_EVENT_DETAIL_STATS,
    {
      variables: { eventId },
      skip: !eventId,
      fetchPolicy: "network-only",
    },
  );
}

export function useEventRegistrationTrend(timeRange?: string) {
  return useQuery<{ getEventRegistrationTrend: RegistrationTrend[] }>(
    GET_EVENT_REGISTRATION_TREND,
    {
      variables: { timeRange },
      fetchPolicy: "network-only",
    },
  );
}

export function useEventTypeDistribution() {
  return useQuery<{ getEventTypeDistribution: EventTypeDistribution[] }>(
    GET_EVENT_TYPE_DISTRIBUTION,
    {
      fetchPolicy: "network-only",
    },
  );
}

export function useEventAttendeeActivity() {
  return useQuery<{ getEventAttendeeActivity: AttendeeActivity[] }>(
    GET_EVENT_ATTENDEE_ACTIVITY,
    {
      fetchPolicy: "network-only",
    },
  );
}

export function useTopPerformingEvents(limit: number = 5) {
  return useQuery<{ getTopPerformingEvents: TopPerformingEvent[] }>(
    GET_TOP_PERFORMING_EVENTS,
    {
      variables: { limit },
      fetchPolicy: "network-only",
    },
  );
}
