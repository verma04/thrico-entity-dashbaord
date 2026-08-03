import { gql } from "@apollo/client";

export const CHECK_MENTORSHIP_URL = gql`
  query CheckMentorShipUrl($input: checkUrl) {
    checkMentorShipUrl(input: $input) {
      success
    }
  }
`;

export const REGISTER_MENTORSHIP = gql`
  mutation RegisterMentorShip($input: registerMentorShipInput) {
    registerMentorShip(input: $input) {
      success
    }
  }
`;

export const CHECK_MENTORSHIP = gql`
  query MentorShip {
    checkMentorShip {
      displayName
      id
      isApproved
      isRequested
      slug
    }
  }
`;
export const GET_ALL_MENTOR_CATEGORY = gql`
  query GetAllMentorCategory {
    getAllMentorCategory {
      id
      title
      count
    }
  }
`;

export const GET_ALL_MENTOR_SKILLS = gql`
  query GetAllMentorSkills {
    getAllMentorSkills {
      id
      title
      count
    }
  }
`;
export const ADD_MENTORSHIP_SERVICES = gql`
  mutation AddMentorShipServices($input: inputAddServices) {
    addMentorShipServices(input: $input) {
      id
      serviceType
      priceType
      title
      duration
      price
      shortDescription
      description
      webinarUrl
    }
  }
`;

export const ALL_MENTORSHIP_SERVICES = gql`
  query getAllMentorServices {
    getAllMentorServices {
      id
      serviceType
      priceType
      title
      duration
      price
      shortDescription
      description
      webinarUrl
    }
  }
`;

export const DUPLICATE_MENTORSHIP_SERVICES = gql`
  mutation DuplicateMentorShipServices($input: inputID) {
    duplicateMentorShipServices(input: $input) {
      id
      serviceType
      priceType
      title
      duration
      price
      shortDescription
      description
      webinarUrl
    }
  }
`;

export const GET_MENTORSHIP_SERVICES = gql`
  query GetAllMentorTestimonial {
    getAllMentorTestimonial {
      from
      id
      testimonial
    }
  }
`;

export const ADD_MENTORSHIP_TESTIMONIALS = gql`
  mutation AddMentorShipTestimonials($input: registerTestimonialInput) {
    addMentorShipTestimonials(input: $input) {
      from
      id
      testimonial
    }
  }
`;

export const DUPLICATE_MENTORSHIP_TESTIMONIALS = gql`
  mutation DuplicateMentorShipTestimonials($input: inputID) {
    duplicateMentorShipTestimonials(input: $input) {
      id
      testimonial
      from
    }
  }
`;

export const GET_ALL_APPROVED_MENTOR = gql`
  query GetAllApprovedMentor {
    getAllApprovedMentor {
      id
      displayName
      slug
      about
      user {
        alumni {
       
          avatar
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_MENTOR_BY_SLUG = gql`
  query GetMentorProfileBySlug($input: inputID) {
    getMentorProfileBySlug(input: $input) {
      displayName
      about
      id
      id
      slug
      user {
        alumni {
          aboutAlumni {
            currentPosition
          }
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

export const GET_ALL_MENTOR_SERVICES_BY_ID = gql`
  query getAllMentorServicesByID($input: inputID) {
    getAllMentorServicesByID(input: $input) {
      id
      serviceType
      priceType
      title
      duration
      price
      shortDescription
      description
      webinarUrl
    }
  }
`;

export const CHECK_WEBINAR = gql`
  query checkWebinarPaymentResponse($input: inputID) {
    checkWebinarPaymentResponse(input: $input) {
      id
      entity
      amount
      amount_paid
      amount_due
      currency
      receipt
      status
      attempts
      created_at
      payment
    }
  }
`;

export const BOOK_PAID_WEBINAR = gql`
  mutation BookPaidWebinar($input: inputPaymentDetails) {
    bookPaidWebinar(input: $input) {
      success
    }
  }
`;

export const BOOK_FREE_WEBINAR = gql`
  mutation BookFreeWebinar($input: inputFreeBookingDetails) {
    bookFreeWebinar(input: $input) {
      success
    }
  }
`;
export const GET_SERVICES_DETAILS = gql`
  query GetServicesDetails($input: inputID!) {
    getServicesDetails(input: $input) {
      id
      description
      webinarDate
      duration
      mentorship {
        displayName
        about
        user {
          alumni {
            aboutAlumni {
              currentPosition
            }
            firstName
            lastName
            avatar
          }
        }
      }
      priceType
      price
      serviceType
      shortDescription
      title
      booking {
        isBooking
        createdAt
      }
    }
  }
`;

export const GET_BOOKING_REQUEST = gql`
  query GetBookingRequest {
    getBookingRequest {
      id
      createdAt
      service {
        title
        priceType
      }
      user {
        alumni {
          aboutAlumni {
            currentPosition
          }
          firstName
          lastName
        }
      }
    }
  }
`;

export const ACCEPT_BOOKING_REQUEST = gql`
  mutation AcceptBookingRequest($input: inputAcceptBookingRequest) {
    acceptBookingRequest(input: $input) {
      id
    }
  }
`;

export const GET_BOOKING_UPCOMING = gql`
  query GetUpcomingRequest {
    getUpcomingBooking {
      id
      createdAt
      service {
        title
        priceType
      }
      user {
        alumni {
          aboutAlumni {
            currentPosition
          }
          firstName
          lastName
        }
      }
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($input: inputCancelBooking) {
    cancelBooking(input: $input) {
      id
    }
  }
`;
export const MARK_AS_BOOKING_COMPLETED = gql`
  mutation MarkBookingAsCompleted($input: inputCompletedBooking) {
    markBookingAsCompleted(input: $input) {
      id
    }
  }
`;

export const GET_CANCEL_BOOKING = gql`
  query GetCancelledBooking {
    getCancelledBooking {
      id
      createdAt
      service {
        title
        priceType
      }
      user {
        alumni {
          aboutAlumni {
            currentPosition
          }
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_COMPLETED_BOOKING = gql`
  query GetCancelledBooking {
    getCompletedBooking {
      id
      createdAt
      service {
        title
        priceType
      }
      user {
        alumni {
          aboutAlumni {
            currentPosition
          }
          firstName
          lastName
        }
      }
    }
  }
`;
