import { gql } from "@apollo/client";

export const JOIN_EVENT = gql`
  mutation JoinEvent($input: inputId!) {
    joinEvent(input: $input) {
      success
      message
    }
  }
`;

export const CREATE_EVENT_FOR_GROUP = gql`
  mutation CreateEventForGroup($input: addEvent) {
    createEventForGroup(input: $input) {
      details
      eventEndTime
      eventStartTime
      eventType
      eventVisibility
      cover
      name
      registrationEndDate
      venue
      slug
      eventHost {
        id
        avatar
        firstName
        lastName
      }
      eventsPayments {
        eventCost
      }
    }
  }
`;
export const GET_ALL_EVENT = gql`
  query GetAllEvents($input: inputGetEvents) {
    getAllEvents(input: $input) {
      edges {
        node {
          canDelete
          canReport
          details {
            id
            cover
            type
            category
            title
            description
            endDate
            lastDateOfRegistration
            startDate
            startTime
            location
            numberOfAttendees
            numberOfPost
            numberOfViews
            currency
            maxAttendees
            pricingType
            ticketPrice
            status
          }
          id
          isOwner
          postedBy {
            email
            firstName
            id
            lastName
            avatar
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_MY_EVENTS = gql`
  query GetMyEvents($input: inputGetEvents) {
    getMyEvents(input: $input) {
      edges {
        node {
          canDelete
          canReport
          details {
            id
            cover
            type
            category
            title
            description
            endDate
            lastDateOfRegistration
            startDate
            startTime
            location
            numberOfAttendees
            numberOfPost
            numberOfViews
            currency
            maxAttendees
            pricingType
            ticketPrice
            status
          }
          id
          isOwner
          postedBy {
            email
            firstName
            id
            lastName
            avatar
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_ATTENDING_EVENTS = gql`
  query GetAttendingEvents($input: inputGetEvents) {
    getAttendingEvents(input: $input) {
      edges {
        node {
          canDelete
          canReport
          details {
            id
            cover
            type
            category
            title
            description
            endDate
            lastDateOfRegistration
            startDate
            startTime
            location
            numberOfAttendees
            numberOfPost
            numberOfViews
            currency
            maxAttendees
            pricingType
            ticketPrice
            status
          }
          id
          isOwner
          postedBy {
            email
            firstName
            id
            lastName
            avatar
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const CREATE_EVENTS = gql`
  mutation createEvent($input: addEvent) {
    createEvent(input: $input) {
      id
      details
      eventEndTime
      eventStartTime
      eventType
      eventVisibility
      name
      registrationEndDate
      venue
      cover
      slug

      eventsPayments {
        eventCost
      }
    }
  }
`;
export const EVENT_BY_SLUG = gql`
  query GetEventBySlug($input: slug) {
    getEventBySlug(input: $input) {
      cover
      details
      eventEndTime
      isRegistered
      eventStartTime
      eventType
      eventVisibility
      eventsPayments {
        paymentMode
        paypalDetails
        ifscCode
        eventCost
        costPerAdults
        costPerChildren
        accountNumber
        bankName
        currency
      }
      id
      name
      registrationEndDate
      slug
      venue
    }
  }
`;

export const GET_EVENT_AS_HOST = gql`
  query getEventAsHost {
    getEventAsHost {
      id
      details
      eventEndTime
      eventStartTime
      eventType
      eventVisibility
      name
      registrationEndDate
      venue
      cover
      slug
      eventHost {
        role
      }
    }
  }
`;

export const GET_SPONSORSHIP = gql`
  query GetEventSponsorship($input: slug) {
    getEventSponsorship(input: $input) {
      id
      content {
        description
        title
      }
      currency
      event {
        name
        slug
      }
      price
      sponsorType
      createdAt
      updatedAt
    }
  }
`;

export const ADD_SPONSORSHIP = gql`
  mutation AddSponsorShip($input: eventCreateSponsorShip) {
    addSponsorShip(input: $input) {
      id
      content {
        description
        title
      }
      currency
      event {
        name
        slug
      }
      price
      sponsorType
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SPONSORSHIP = gql`
  mutation DeleteSponsorShip($input: deleteSponsorShip) {
    deleteSponsorShip(input: $input) {
      id
    }
  }
`;

export const GET_ALL_HOST = gql`
  query GetAllHost($input: slug) {
    getAllHost(input: $input) {
      id
      hostType
      createdAt
      updatedAt
      alumni {
        avatar
        firstName
        lastName
        id
      }
    }
  }
`;

export const ADD_HOST = gql`
  mutation AddHost($input: typeHostId) {
    addHost(input: $input) {
      id
    }
  }
`;

export const REMOVE_HOST = gql`
  mutation RemoveHost($input: typeHostId) {
    removeHost(input: $input) {
      id
    }
  }
`;

export const GET_ALL_VENUE = gql`
  query GetAllVenue($input: slug) {
    getAllVenue(input: $input) {
      venue
      id
      address
    }
  }
`;

export const ADD_VENUE = gql`
  mutation AddVenue($input: addVenue) {
    addVenue(input: $input) {
      venue
      id
      address
    }
  }
`;

export const GET_ALL_SPEAKERS = gql`
  query GetAllSpeakers($input: slug) {
    getAllSpeakers(input: $input) {
      id
      fullName
      linkedin
      cover
      about
      avatar
    }
  }
`;
export const ADD_AGENDA = gql`
  mutation AddEventAgenda($input: addAgenda) {
    addEventAgenda(input: $input) {
      id
      title
      videoSteam
      date
      startTime
      endTime
      venue
      isPinned
      isDraft
      isPublished
      description
    }
  }
`;
export const GET_ALL_AGENDA = gql`
  query GetAllAgenda($input: slug) {
    getAllAgenda(input: $input) {
      id
      title
      videoSteam
      date
      startTime
      endTime
      venue
      isPinned
      isDraft
      isPublished
      description
    }
  }
`;

export const GET_ALL_EVENT_GALLERY = gql`
  query GetEventGallery($input: slug) {
    getEventGallery(input: $input) {
      id
      mediaType
      url
    }
  }
`;

export const ADD_EVENT_GALLERY = gql`
  mutation AddEventMedia($input: inputEventGallery) {
    addEventMedia(input: $input) {
      id
      mediaType
      url
    }
  }
`;

export const GET_EVENT_SPONSOR = gql`
  query GetEventSponsors($input: slug) {
    getEventSponsors(input: $input) {
      createdAt
      id
      sponsorLogo
      sponsorName
      sponsorShip {
        sponsorType
      }
      sponsorUserDesignation
      sponsorUserName
    }
  }
`;

export const GET_SPONSORSHIP_EVENTS = gql`
  query GetSponsorshipEvents($input: slug) {
    getSponsorshipEvents(input: $input) {
      eventSponsors {
        id
        sponsorUserName
        sponsorUserDesignation
        sponsorLogo
        sponsorShip {
          id
          sponsorType
        }
        createdAt
        sponsorName
      }
      eventSponsorship {
        content {
          description
          title
        }
        id
        price
        role
        showPrice
        sponsorType
      }
    }
  }
`;

export const GET_SPONSORSHIP_SPEAKERS = gql`
  query GetSpeakersEvents($input: slug) {
    getSpeakersEvents(input: $input) {
      avatar
      id
      fullName
      linkedin
      cover
      about
    }
  }
`;

export const GET_JOB_BY_SLUG = gql`
  query GetJobBySlug($input: inputSlug) {
    getJobBySlug(input: $input) {
      company
      description
      experience
      id
      jobTitle
      jobType
      location
      salary
      slug
      workplaceType
      tag {
        tag
      }
    }
  }
`;

export const GET_PAID_EVENTS_DETAILS = gql`
  query GetPaidEventsDetails($input: slug) {
    getPaidEventsDetails(input: $input) {
      orderId
      currency
      amount
    }
  }
`;

export const GET_EVENTS_TYPE = gql`
  query Query {
    getEventsType
  }
`;
export const GET_EVENT_COST_TYPE = gql`
  query Query {
    getEventCostType
  }
`;

export const GET_EVENT_VENUES = gql`
  query GetEventVenues($eventId: ID!) {
    getEventVenues(eventId: $eventId) {
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
    }
  }
`;

export const ADD_EVENT_VENUE = gql`
  mutation AddEventVenue($input: EventVenueInput!) {
    addEventVenue(input: $input) {
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
    }
  }
`;

export const UPDATE_EVENT_VENUE = gql`
  mutation UpdateEventVenue($venueId: ID!, $input: EventVenueInput!) {
    updateEventVenue(venueId: $venueId, input: $input) {
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
    }
  }
`;

export const DELETE_EVENT_VENUE = gql`
  mutation DeleteEventVenue($venueId: ID!) {
    deleteEventVenue(venueId: $venueId)
  }
`;

export const ADD_EVENT_AGENDA = gql`
  mutation AddEventAgenda($input: EventAgendaInput!) {
    addEventAgenda(input: $input) {
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
      colorId
      dayId
      createdAt
      updatedAt
      venue {
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
      }
      speakers {
        id
        eventId
        name
        email
        bio
        title
        company
        avatar
        socialLinks {
          platform
          url
        }
        isFeatured
        displayOrder
        createdAt
        updatedAt
        status
      }
    }
  }
`;

export const UPDATE_EVENT_AGENDA = gql`
  mutation UpdateEventAgenda($agendaId: ID!, $input: EventAgendaInput!) {
    updateEventAgenda(agendaId: $agendaId, input: $input) {
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
      colorId
      dayId
      createdAt
      updatedAt
      venue {
        id
      }
      speakers {
        id
      }
    }
  }
`;

export const DELETE_EVENT_AGENDA = gql`
  mutation DeleteEventAgenda($agendaId: ID!) {
    deleteEventAgenda(agendaId: $agendaId)
  }
`;

export const GET_POPULAR_EVENT_CATEGORIES = gql`
  query GetPopularEventCategories {
    getPopularEventCategories {
      id
      name
      count
    }
  }
`;

export const GET_EVENT_STATS = gql`
  query GetEventStats {
    getEventStats {
      totalEvents
      activeEvents
      pastEvents
      totalAttendees
    }
  }
`;

export const GET_SPECIAL_SPONSORSHIPS = gql`
  query GetEventSpecialSponsorships($eventId: ID!) {
    getEventSpecialSponsorships(eventId: $eventId) {
      id
      eventId
      sponsorType
      price
      currency
      showPrice
      content
      createdAt
      sponsors {
        id
        eventId
        sponsorShipId
        sponsorName
        sponsorLogo
        sponsorUserName
        sponsorUserDesignation
        isApproved
        createdAt
      }
    }
  }
`;

export const ADD_EVENT_SPECIAL_SPONSORSHIP = gql`
  mutation AddEventSpecialSponsorship($input: EventSpecialSponsorshipInput!) {
    addEventSpecialSponsorship(input: $input) {
      id
      eventId
      sponsorType
      price
      currency
      showPrice
      content
      createdAt
      sponsors {
        id
        eventId
        sponsorShipId
        sponsorName
        sponsorLogo
        sponsorUserName
        sponsorUserDesignation
        isApproved
        createdAt
      }
    }
  }
`;

export const UPDATE_EVENT_SPECIAL_SPONSORSHIP = gql`
  mutation UpdateEventSpecialSponsorship(
    $sponsorshipId: ID!
    $input: EventSpecialSponsorshipInput!
  ) {
    updateEventSpecialSponsorship(
      sponsorshipId: $sponsorshipId
      input: $input
    ) {
      id
    }
  }
`;

export const DELETE_EVENT_SPECIAL_SPONSORSHIP = gql`
  mutation DeleteEventSpecialSponsorship($sponsorshipId: ID!) {
    deleteEventSpecialSponsorship(sponsorshipId: $sponsorshipId)
  }
`;

export const ADD_EVENT_SPECIAL_SPONSOR = gql`
  mutation AddEventSpecialSponsor($input: EventSpecialSponsorInput!) {
    addEventSpecialSponsor(input: $input) {
      id
    }
  }
`;

export const UPDATE_EVENT_SPECIAL_SPONSOR = gql`
  mutation UpdateEventSpecialSponsor(
    $sponsorId: ID!
    $input: EventSpecialSponsorInput!
  ) {
    updateEventSpecialSponsor(sponsorId: $sponsorId, input: $input) {
      id
    }
  }
`;

export const DELETE_EVENT_SPECIAL_SPONSOR = gql`
  mutation DeleteEventSpecialSponsor($sponsorId: ID!) {
    deleteEventSpecialSponsor(sponsorId: $sponsorId)
  }
`;
export const GET_SPONSORSHIPS = gql`
  query GetEventSponsorships($eventId: ID!) {
    getEventSponsorships(eventId: $eventId) {
      id
      eventId
      sponsorType
      price
      currency
      showPrice
      content
      createdAt
      sponsors {
        id
        eventId
        sponsorShipId
        sponsorName
        sponsorLogo
        sponsorUserName
        sponsorUserDesignation
        isApproved
        createdAt
      }
    }
  }
`;

export const ADD_EVENT_SPONSORSHIP = gql`
  mutation AddEventSponsorship($input: EventSponsorshipInput!) {
    addEventSponsorship(input: $input) {
      id
      eventId
      sponsorType
      price
      currency
      showPrice
      content
      createdAt
      sponsors {
        id
        eventId
        sponsorShipId
        sponsorName
        sponsorLogo
        sponsorUserName
        sponsorUserDesignation
        isApproved
        createdAt
      }
    }
  }
`;

export const UPDATE_EVENT_SPONSORSHIP = gql`
  mutation UpdateEventSponsorship(
    $sponsorshipId: ID!
    $input: EventSponsorshipInput!
  ) {
    updateEventSponsorship(sponsorshipId: $sponsorshipId, input: $input) {
      id
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
      id
    }
  }
`;

export const UPDATE_EVENT_SPONSOR = gql`
  mutation UpdateEventSponsor($sponsorId: ID!, $input: EventSponsorInput!) {
    updateEventSponsor(sponsorId: $sponsorId, input: $input) {
      id
    }
  }
`;

export const DELETE_EVENT_SPONSOR = gql`
  mutation DeleteEventSponsor($sponsorId: ID!) {
    deleteEventSponsor(sponsorId: $sponsorId)
  }
`;

export const GET_SPEAKERS_BY_EVENT = gql`
  query GetSpeakersByEvent($input: inputGetSpeakersByEvent) {
    getSpeakersByEvent(input: $input) {
      pagination {
        page
        limit
        count
      }
      speakers {
        id
        eventId
        name
        email
        bio
        title
        company
        avatar
        socialLinks {
          platform
          url
        }
        isFeatured
        displayOrder
        createdAt
        updatedAt
        status
      }
    }
  }
`;

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
    }
  }
`;

export const DELETE_EVENT_MEDIA = gql`
  mutation DeleteEventMedia($mediaId: ID!) {
    deleteEventMedia(mediaId: $mediaId)
  }
`;

export const ADD_SPEAKER = gql`
  mutation AddSpeaker($input: inputAddEventSpeaker) {
    addSpeaker(input: $input) {
      id
      eventId
      name
      email
      bio
      title
      company
      avatar
      socialLinks {
        platform
        url
      }
      isFeatured
      displayOrder
      createdAt
      updatedAt
      status
    }
  }
`;

export const EDIT_SPEAKER = gql`
  mutation EditSpeaker($input: inputEditEventSpeaker) {
    editSpeaker(input: $input) {
      id
    }
  }
`;

export const REMOVE_SPEAKER = gql`
  mutation RemoveSpeaker($input: inputRemoveSpeaker) {
    removeSpeaker(input: $input) {
      id
    }
  }
`;

export const MARK_SPEAKER_FEATURED = gql`
  mutation MarkSpeakerFeatured($input: inputMarkSpeakerFeatured) {
    markSpeakerFeatured(input: $input) {
      id
    }
  }
`;

export const UNFEATURE_SPEAKER = gql`
  mutation UnfeatureSpeaker($input: inputUnfeatureSpeaker) {
    unfeatureSpeaker(input: $input) {
      id
    }
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
      colorId
      dayId
      createdAt
      updatedAt
      venue {
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
      }
      speakers {
        id
        eventId
        name
        email
        bio
        title
        company
        avatar
        socialLinks {
          platform
          url
        }
        isFeatured
        displayOrder
        createdAt
        updatedAt
        status
      }
    }
  }
`;

export const GET_EVENT_AGENDA_DAYS = gql`
  query GetEventAgendaDays($eventId: ID!) {
    getEventAgendaDays(eventId: $eventId) {
      id
      eventId
      label
      title
      date
      createdAt
      updatedAt
    }
  }
`;

export const ADD_EVENT_AGENDA_DAY = gql`
  mutation AddEventAgendaDay($input: EventAgendaDayInput!) {
    addEventAgendaDay(input: $input) {
      id
      eventId
      label
      title
      date
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EVENT_AGENDA_DAY = gql`
  mutation UpdateEventAgendaDay($dayId: ID!, $input: EventAgendaDayInput!) {
    updateEventAgendaDay(dayId: $dayId, input: $input) {
      id
      eventId
      label
      title
      date
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EVENT_AGENDA_DAY = gql`
  mutation DeleteEventAgendaDay($dayId: ID!) {
    deleteEventAgendaDay(dayId: $dayId)
  }
`;

export const GET_EVENT_ATTENDEES = gql`
  query GetEventAttendees($input: inputGetEventAttendees) {
    getEventAttendees(input: $input) {
      attendees {
        id
        eventId
        user {
          email
          firstName
          lastName
          id
          avatar
        }
        status
        checkedIn
        responses
        createdAt
        updatedAt
      }
      pagination {
        count
        limit
        page
      }
    }
  }
`;

export const EDIT_EVENT_GENERAL_INFO = gql`
  mutation EditEventGeneralInfo($input: inputEditEventGeneralInfo!) {
    editEventGeneralInfo(input: $input) {
      id
      cover
      type
      category
      title
      description
      endDate
      lastDateOfRegistration
      startDate
      startTime
      location
      numberOfAttendees
      numberOfPost
      numberOfViews
      currency
      maxAttendees
      pricingType
      ticketPrice
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($input: inputId) {
    deleteEvent(input: $input) {
      success
      message
    }
  }
`;

export const GET_EVENT_DETAILS_BY_ID = gql`
  query GetEventDetailsById($input: inputId) {
    getEventDetailsById(input: $input) {
      id
      isOwner
      canReport
      canDelete
      isAttending

      details {
        id
        cover
        type
        category
        title
        description
        details
        endDate
        lastDateOfRegistration
        startDate
        startTime
        location
        tracksSectionTitle
        showTracksSection
        speakersSectionTitle
        showSpeakersSection
        sponsorsSectionTitle
        showSponsorsSection
        specialSponsorsSectionTitle
        showSpecialSponsorsSection
        agendaSectionTitle
        showAgendaSection
        agendaTheme
        agendaTemplate
        attendeesSectionTitle
        showAttendeesSection
        mediaSectionTitle
        showMediaSection
        overviewSectionTitle
        showOverviewSection
        numberOfAttendees
        numberOfPost
        numberOfViews
        currency
        maxAttendees
        pricingType
        ticketPrice
        status
      }
      postedBy {
        avatar
        email
        firstName
        lastName
        id
      }
    }
  }
`;

export const EDIT_EVENT_OVERVIEW = gql`
  mutation EditEventOverview($input: inputEditEventOverview!) {
    editEventOverview(input: $input) {
      id
      details
    }
  }
`;

export const EDIT_EVENT_PAYMENT_DETAILS = gql`
  mutation EditEventPaymentDetails($input: inputEditEventPaymentDetails!) {
    editEventPaymentDetails(input: $input) {
      id
      paymentDetailsContent
    }
  }
`;

export const GET_EVENT_TRACKS = gql`
  query GetEventTracksByEvent($eventId: ID!) {
    getEventTracksByEvent(eventId: $eventId) {
      sectionTitle
      tracks {
        id
        eventId
        title
        description
        iconName
        iconColor
        isFeatured
        createdAt
      }
    }
  }
`;

export const ADD_EVENT_TRACK = gql`
  mutation AddEventTrack($input: AddEventTrackInput!) {
    addEventTrack(input: $input) {
      id
      title
      description
      iconName
      iconColor
      isFeatured
    }
  }
`;

export const UPDATE_EVENT_TRACK = gql`
  mutation UpdateEventTrack($input: UpdateEventTrackInput!) {
    updateEventTrack(input: $input) {
      id
      title
      description
      iconName
      iconColor
      isFeatured
    }
  }
`;

export const DELETE_EVENT_TRACK = gql`
  mutation DeleteEventTrack($input: DeleteEventTrackInput!) {
    deleteEventTrack(input: $input) {
      success
    }
  }
`;

export const UPDATE_EVENT_SECTION_SETTINGS = gql`
  mutation UpdateEventSectionSettings(
    $input: UpdateEventSectionSettingsInput!
  ) {
    updateEventSectionSettings(input: $input) {
      id
      tracksSectionTitle
      showTracksSection
      speakersSectionTitle
      showSpeakersSection
      sponsorsSectionTitle
      showSponsorsSection
      specialSponsorsSectionTitle
      showSpecialSponsorsSection
      agendaSectionTitle
      showAgendaSection
      agendaTheme
      agendaTemplate
      attendeesSectionTitle
      showAttendeesSection
      mediaSectionTitle
      showMediaSection
      overviewSectionTitle
      showOverviewSection
      teamSectionTitle
      showTeamSection
      paymentDetailsSectionTitle
      showPaymentDetailsSection
      paymentDetailsContent
    }
  }
`;

export const GET_EVENT_BY_ID_FOR_WEBSITE = gql`
  query GetEventByIdForWebsite($input: inputId) {
    getEventByIdForWebsite(input: $input) {
      id
      details {
        id
        cover
        type
        category
        title
        description
        details
        endDate
        lastDateOfRegistration
        startDate
        startTime
        location
        tracksSectionTitle
        showTracksSection
        speakersSectionTitle
        showSpeakersSection
        sponsorsSectionTitle
        showSponsorsSection
        specialSponsorsSectionTitle
        showSpecialSponsorsSection
        agendaSectionTitle
        showAgendaSection
        agendaTheme
        agendaTemplate
        attendeesSectionTitle
        showAttendeesSection
        mediaSectionTitle
        showMediaSection
        overviewSectionTitle
        showOverviewSection
        teamSectionTitle
        showTeamSection
        paymentDetailsSectionTitle
        showPaymentDetailsSection
        paymentDetailsContent
        numberOfAttendees
      }
      postedBy {
        avatar
        email
        firstName
        lastName
        id
      }
      tracks {
        id
        title
        description
        iconName
        iconColor
        isFeatured
      }
      speakers {
        id
        name
        email
        bio
        title
        company
        avatar
        socialLinks {
          platform
          url
        }
        isFeatured
      }
      sponsors {
        id
        sponsorType
        price
        currency
        showPrice
        content
        sponsors {
          id
          sponsorName
          sponsorLogo
          sponsorUserName
          sponsorUserDesignation
          isApproved
        }
      }
      specialSponsors {
        id
        sponsorType
        price
        currency
        showPrice
        content
        sponsors {
          id
          sponsorName
          sponsorLogo
          sponsorUserName
          sponsorUserDesignation
          isApproved
        }
      }
      agenda {
        id
        title
        videoSteam
        date
        startTime
        endTime
        isPublished
        isPinned
        isDraft
        venue {
          id
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
        }
        speakers {
          id
          name
          email
          bio
          title
          company
          avatar
          socialLinks {
            platform
            url
          }
          isFeatured
          displayOrder
          createdAt
          updatedAt
          status
        }
      }
      attendees {
        id
        status
        checkedIn
        user {
          id
          firstName
          lastName
          avatar
        }
      }
      media {
        id
        url
        mediaType
        title
      }
      team {
        id
        name
        designation
        avatar
        linkedin
        socialLinks {
          platform
          url
        }
      }
    }
  }
`;

export const GET_EVENT_TEAM = gql`
  query GetEventTeam($eventId: ID!) {
    getEventTeam(eventId: $eventId) {
      id
      eventId
      name
      designation
      avatar
      linkedin
      socialLinks {
        platform
        url
      }
      createdAt
      updatedAt
      status
    }
  }
`;

export const ADD_EVENT_TEAM_MEMBER = gql`
  mutation AddEventTeamMember($input: EventTeamMemberInput!) {
    addEventTeamMember(input: $input) {
      id
      eventId
      name
      designation
      avatar
      linkedin
      socialLinks {
        platform
        url
      }
      createdAt
      updatedAt
      status
    }
  }
`;

export const UPDATE_EVENT_TEAM_MEMBER = gql`
  mutation UpdateEventTeamMember($teamMemberId: ID!, $input: EventTeamMemberInput!) {
    updateEventTeamMember(teamMemberId: $teamMemberId, input: $input) {
      id
      eventId
      name
      designation
      avatar
      linkedin
      socialLinks {
        platform
        url
      }
      createdAt
      updatedAt
      status
    }
  }
`;

export const DELETE_EVENT_TEAM_MEMBER = gql`
  mutation DeleteEventTeamMember($teamMemberId: ID!) {
    deleteEventTeamMember(teamMemberId: $teamMemberId)
  }
`;

export const CHECK_EVENT_USER_STATUS = gql`
  query CheckEventUserStatus($eventId: ID!) {
    checkEventUserStatus(eventId: $eventId) {
      isOwner
      isAttending
    }
  }
`;

export const GET_EVENT_INQUIRIES = gql`
  query GetEventInquiries($eventId: ID!) {
    getEventInquiries(eventId: $eventId) {
      id
      eventId
      subject
      message
      status
      createdAt
      user {
        id
        firstName
        lastName
        avatar
        email
      }
    }
  }
`;

export const CONTACT_EVENT = gql`
  mutation ContactEvent($input: CreateEventInquiryInput!) {
    contactEvent(input: $input) {
      id
      subject
      message
      status
      createdAt
    }
  }
`;

export const MARK_INQUIRY_RESOLVED = gql`
  mutation MarkInquiryResolved($inquiryId: ID!) {
    markInquiryResolved(inquiryId: $inquiryId) {
      id
      status
    }
  }
`;

export const UNMARK_INQUIRY_RESOLVED = gql`
  mutation UnmarkInquiryResolved($inquiryId: ID!) {
    unmarkInquiryResolved(inquiryId: $inquiryId) {
      id
      status
    }
  }
`;
