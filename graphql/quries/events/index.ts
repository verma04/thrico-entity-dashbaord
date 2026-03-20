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

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    getEventById(id: $id) {
      ${events}
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($eventId: ID!, $input: PostEventInput!) {
    updateEvent(eventId: $eventId, input: $input) {
      ${events}
    }
  }
`;

const eventSpeaker = `
  id
  eventId
  name
  email
  bio
  title
  company
  avatar
  socialLinks
  isFeatured
  displayOrder
  createdAt
  status
`;

export const GET_EVENT_SPEAKERS = gql`
  query GetEventSpeakers($eventId: ID!) {
    getEventSpeakers(eventId: $eventId) {
      ${eventSpeaker}
    }
  }
`;

export const ADD_EVENT_SPEAKER = gql`
  mutation AddEventSpeaker($input: EventSpeakerInput!) {
    addEventSpeaker(input: $input) {
      ${eventSpeaker}
    }
  }
`;

export const UPDATE_EVENT_SPEAKER = gql`
  mutation UpdateEventSpeaker($speakerId: ID!, $input: EventSpeakerInput!) {
    updateEventSpeaker(speakerId: $speakerId, input: $input) {
      ${eventSpeaker}
    }
  }
`;

export const DELETE_EVENT_SPEAKER = gql`
  mutation DeleteEventSpeaker($speakerId: ID!) {
    deleteEventSpeaker(speakerId: $speakerId)
  }
`;

export const TOGGLE_SPEAKER_FEATURED = gql`
  mutation ToggleSpeakerFeatured($speakerId: ID!, $isFeatured: Boolean!) {
    toggleSpeakerFeatured(speakerId: $speakerId, isFeatured: $isFeatured) {
      ${eventSpeaker}
    }
  }
`;

const eventSponsor = `
  id
  eventId
  sponsorShipId
  sponsorName
  sponsorLogo
  sponsorUserName
  sponsorUserDesignation
  isApproved
  createdAt
`;

const eventSponsorship = `
  id
  eventId
  sponsorType
  price
  currency
  showPrice
  content
  createdAt
  sponsors {
    ${eventSponsor}
  }
`;

export const GET_EVENT_SPONSORSHIPS = gql`
  query GetEventSponsorships($eventId: ID!) {
    getEventSponsorships(eventId: $eventId) {
      ${eventSponsorship}
    }
  }
`;

export const ADD_EVENT_SPONSORSHIP = gql`
  mutation AddEventSponsorship($input: EventSponsorshipInput!) {
    addEventSponsorship(input: $input) {
      ${eventSponsorship}
    }
  }
`;

export const UPDATE_EVENT_SPONSORSHIP = gql`
  mutation UpdateEventSponsorship($sponsorshipId: ID!, $input: EventSponsorshipInput!) {
    updateEventSponsorship(sponsorshipId: $sponsorshipId, input: $input) {
      ${eventSponsorship}
    }
  }
`;

export const DELETE_EVENT_SPONSORSHIP = gql`
  mutation DeleteEventSponsorship($sponsorshipId: ID!) {
    deleteEventSponsorship(sponsorshipId: $sponsorshipId)
  }
`;

export const ADD_EVENT_SPONSOR = gql`
  mutation AddEventSponsor($input: EventSponsorInput!) {
    addEventSponsor(input: $input) {
      ${eventSponsor}
    }
  }
`;

export const UPDATE_EVENT_SPONSOR = gql`
  mutation UpdateEventSponsor($sponsorId: ID!, $input: EventSponsorInput!) {
    updateEventSponsor(sponsorId: $sponsorId, input: $input) {
      ${eventSponsor}
    }
  }
`;

export const DELETE_EVENT_SPONSOR = gql`
  mutation DeleteEventSponsor($sponsorId: ID!) {
    deleteEventSponsor(sponsorId: $sponsorId)
  }
`;

const eventVenue = `
  id
  eventId
  name
  address
  city
  state
  country
  zipCode
  latitude
  longitude
  capacity
  description
  amenities
  contactInfo
  images
  createdAt
  updatedAt
  status
`;

export const GET_EVENT_VENUES = gql`
  query GetEventVenues($eventId: ID!) {
    getEventVenues(eventId: $eventId) {
      ${eventVenue}
    }
  }
`;

export const ADD_EVENT_VENUE = gql`
  mutation AddEventVenue($input: EventVenueInput!) {
    addEventVenue(input: $input) {
      ${eventVenue}
    }
  }
`;

export const UPDATE_EVENT_VENUE = gql`
  mutation UpdateEventVenue($venueId: ID!, $input: EventVenueInput!) {
    updateEventVenue(venueId: $venueId, input: $input) {
      ${eventVenue}
    }
  }
`;

export const DELETE_EVENT_VENUE = gql`
  mutation DeleteEventVenue($venueId: ID!) {
    deleteEventVenue(venueId: $venueId)
  }
`;

export const GET_EVENT_AGENDAS = gql`
  query GetEventAgendas($eventId: ID!) {
    getEventAgendas(eventId: $eventId) {
      id
      eventId
      title
      videoSteam
      venueId
      date
      startTime
      endTime
      isPublished
      isPinned
      isDraft
      venue {
        id
        name
      }
    }
  }
`;

export const ADD_EVENT_AGENDA = gql`
  mutation AddEventAgenda($input: EventAgendaInput!) {
    addEventAgenda(input: $input) {
      id
      title
    }
  }
`;

export const UPDATE_EVENT_AGENDA = gql`
  mutation UpdateEventAgenda($agendaId: ID!, $input: EventAgendaInput!) {
    updateEventAgenda(agendaId: $agendaId, input: $input) {
      id
      title
    }
  }
`;

export const DELETE_EVENT_AGENDA = gql`
  mutation DeleteEventAgenda($agendaId: ID!) {
    deleteEventAgenda(agendaId: $agendaId)
  }
`;

export const GET_EVENT_TICKETS = gql`
  query GetEventTickets($eventId: ID!) {
    getEventTickets(eventId: $eventId) {
      id
      eventId
      name
      type
      price
      quantity
      sold
      description
      earlyBirdPrice
      earlyBirdDeadline
      maxPerOrder
      isVisible
      createdAt
      updatedAt
      status
    }
  }
`;

export const ADD_EVENT_TICKET = gql`
  mutation AddEventTicket($input: EventTicketInput!) {
    addEventTicket(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_EVENT_TICKET = gql`
  mutation UpdateEventTicket($ticketId: ID!, $input: EventTicketInput!) {
    updateEventTicket(ticketId: $ticketId, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_EVENT_TICKET = gql`
  mutation DeleteEventTicket($ticketId: ID!) {
    deleteEventTicket(ticketId: $ticketId)
  }
`;

export const GET_EVENT_PROMO_CODES = gql`
  query GetEventPromoCodes($eventId: ID!) {
    getEventPromoCodes(eventId: $eventId) {
      id
      eventId
      code
      discountType
      discountValue
      usageLimit
      used
      expiryDate
      applicableTickets
      createdAt
      updatedAt
      status
    }
  }
`;

export const ADD_EVENT_PROMO_CODE = gql`
  mutation AddEventPromoCode($input: EventPromoCodeInput!) {
    addEventPromoCode(input: $input) {
      id
      code
    }
  }
`;

export const UPDATE_EVENT_PROMO_CODE = gql`
  mutation UpdateEventPromoCode(
    $promoCodeId: ID!
    $input: EventPromoCodeInput!
  ) {
    updateEventPromoCode(promoCodeId: $promoCodeId, input: $input) {
      id
      code
    }
  }
`;

export const DELETE_EVENT_PROMO_CODE = gql`
  mutation DeleteEventPromoCode($promoCodeId: ID!) {
    deleteEventPromoCode(promoCodeId: $promoCodeId)
  }
`;

// ==========================================
// REGISTRATION SETTINGS
// ==========================================

export const GET_EVENT_REGISTRATION_SETTINGS = gql`
  query GetEventRegistrationSettings($eventId: ID!) {
    getEventRegistrationSettings(eventId: $eventId) {
      id
      eventId
      isRegistrationOpen
      enableWaitlist
      requireApproval
      confirmationSubject
      confirmationBody
      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_EVENT_REGISTRATION_SETTINGS = gql`
  mutation UpsertEventRegistrationSettings(
    $input: EventRegistrationSettingsInput!
  ) {
    upsertEventRegistrationSettings(input: $input) {
      id
      eventId
      isRegistrationOpen
      enableWaitlist
      requireApproval
      confirmationSubject
      confirmationBody
    }
  }
`;

// ==========================================
// REGISTRATION FIELDS
// ==========================================

export const GET_EVENT_REGISTRATION_FIELDS = gql`
  query GetEventRegistrationFields($eventId: ID!) {
    getEventRegistrationFields(eventId: $eventId) {
      id
      eventId
      label
      type
      required
      placeholder
      options
      displayOrder
    }
  }
`;

export const ADD_EVENT_REGISTRATION_FIELD = gql`
  mutation AddEventRegistrationField($input: EventRegistrationFieldInput!) {
    addEventRegistrationField(input: $input) {
      id
      eventId
      label
      type
      required
      placeholder
      options
      displayOrder
    }
  }
`;

export const UPDATE_EVENT_REGISTRATION_FIELD = gql`
  mutation UpdateEventRegistrationField(
    $fieldId: ID!
    $input: EventRegistrationFieldInput!
  ) {
    updateEventRegistrationField(fieldId: $fieldId, input: $input) {
      id
      eventId
      label
      type
      required
      placeholder
      options
      displayOrder
    }
  }
`;

export const DELETE_EVENT_REGISTRATION_FIELD = gql`
  mutation DeleteEventRegistrationField($fieldId: ID!) {
    deleteEventRegistrationField(fieldId: $fieldId)
  }
`;

// ==========================================
// MEDIA
// ==========================================

export const GET_EVENT_MEDIA = gql`
  query GetEventMedia($eventId: ID!) {
    getEventMedia(eventId: $eventId) {
      id
      eventId
      url
      mediaType
      title
      tags
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export const ADD_EVENT_MEDIA = gql`
  mutation AddEventMedia($input: EventMediaInput!) {
    addEventMedia(input: $input) {
      id
      eventId
      url
      mediaType
      title
      tags
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EVENT_MEDIA = gql`
  mutation UpdateEventMedia($mediaId: ID!, $input: EventMediaInput!) {
    updateEventMedia(mediaId: $mediaId, input: $input) {
      id
      eventId
      url
      mediaType
      title
      tags
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EVENT_MEDIA = gql`
  mutation DeleteEventMedia($mediaId: ID!) {
    deleteEventMedia(mediaId: $mediaId)
  }
`;

export const UPDATE_EVENT_MEDIA_VISIBILITY = gql`
  mutation UpdateEventMediaVisibility($mediaId: ID!, $isPublic: Boolean!) {
    updateEventMediaVisibility(mediaId: $mediaId, isPublic: $isPublic) {
      id
      isPublic
      updatedAt
    }
  }
`;

// ==========================================
// SETTINGS
// ==========================================

export const GET_EVENT_SETTINGS = gql`
  query GetEventSettings($eventId: ID!) {
    getEventSettings(eventId: $eventId) {
      id
      eventId
      layout
      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_EVENT_SETTINGS = gql`
  mutation UpsertEventSettings($input: EventSettingsInput!) {
    upsertEventSettings(input: $input) {
      id
      eventId
      layout
      updatedAt
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($eventId: ID!) {
    deleteEvent(eventId: $eventId)
  }
`;

// ==========================================
// ATTENDEES
// ==========================================

export const GET_EVENT_ATTENDEES = gql`
  query GetEventAttendees($eventId: ID!) {
    getEventAttendees(eventId: $eventId) {
      id
      eventId
      user {
        id
        firstName
        lastName
        email
        avatar
      }
      ticket {
        id
        name
      }
      status
      checkedIn
      responses
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ATTENDEE_STATUS = gql`
  mutation UpdateAttendeeStatus($attendeeId: ID!, $status: String!) {
    updateAttendeeStatus(attendeeId: $attendeeId, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const TOGGLE_ATTENDEE_CHECKIN = gql`
  mutation ToggleAttendeeCheckIn($attendeeId: ID!) {
    toggleAttendeeCheckIn(attendeeId: $attendeeId) {
      id
      checkedIn
      updatedAt
    }
  }
`;
export const ADD_EVENT_ATTENDEE = gql`
  mutation AddEventAttendee($input: AddEventAttendeeInput!) {
    addEventAttendee(input: $input) {
      id
      eventId
      user {
        id
        firstName
        lastName
        email
        avatar
      }
      ticket {
        id
        name
      }
      status
      checkedIn
      createdAt
    }
  }
`;

// ==========================================
// ANALYTICS
// ==========================================

export const GET_EVENT_DETAIL_STATS = gql`
  query GetEventDetailStats($eventId: ID!) {
    getEventDetailStats(eventId: $eventId) {
      totalTicketsSold
      totalRevenue
      totalAttendees
      checkInRate
    }
  }
`;

export const GET_EVENT_REGISTRATION_TREND = gql`
  query GetEventRegistrationTrend($timeRange: TimeRange) {
    getEventRegistrationTrend(timeRange: $timeRange) {
      name
      registrations
      views
    }
  }
`;

export const GET_EVENT_TYPE_DISTRIBUTION = gql`
  query GetEventTypeDistribution {
    getEventTypeDistribution {
      name
      value
      color
    }
  }
`;

export const GET_EVENT_ATTENDEE_ACTIVITY = gql`
  query GetEventAttendeeActivity {
    getEventAttendeeActivity {
      name
      registered
      checkedIn
    }
  }
`;

export const GET_TOP_PERFORMING_EVENTS = gql`
  query GetTopPerformingEvents($limit: Int) {
    getTopPerformingEvents(limit: $limit) {
      id
      title
      type
      attendees
      views
      status
      cover
      date
    }
  }
`;
