import { gql } from "@apollo/client";

export const GET_OFFER_STATS = gql`
  query GetOfferStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getOfferStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalOffers
      activeOffers
      claims
      views
      totalOffersChange
      activeOffersChange
      claimsChange
      viewsChange
      yieldRate
      trend {
        date
        claims
      }
      matrix {
        name
        value
        color
      }
    }
  }
`;

export const GET_OFFERS = gql`
  query GetOffers($input: GetOffersInput) {
    getOffers(input: $input) {
      id
      title
      description
      image
      discount
      validityStart
      validityEnd
      status
      claimsCount
      viewsCount
      isActive
      category {
        id
        name
        color
      }
      verification {
        isVerified
        verificationReason
      }
      addedBy
      creator {
        id
        firstName
        lastName
        avatar
      }
      createdAt
    }
  }
`;

export const GET_CREATED_OFFERS = gql`
  query GetCreatedOffersByUserId($userId: ID!, $page: Int, $limit: Int) {
    getCreatedOffersByUserId(userId: $userId, page: $page, limit: $limit) {
      data {
        id
        title
        description
        image
        discount
        validityStart
        validityEnd
        status
        claimsCount
        viewsCount
        isActive
        category {
          id
          name
          color
        }
        verification {
          isVerified
          verificationReason
        }
        addedBy
        creator {
          id
          firstName
          lastName
          avatar
        }
        createdAt
      }
      total
      offset
      limit
    }
  }
`;

export const GET_CLAIMED_OFFERS = gql`
  query GetClaimedOffers($userId: ID!, $page: Int, $limit: Int) {
    getClaimedOffers(userId: $userId, page: $page, limit: $limit) {
      data {
        id
        title
        description
        image
        discount
        validityStart
        validityEnd
        status
        claimsCount
        viewsCount
        isActive
        category {
          id
          name
          color
        }
        verification {
          isVerified
          verificationReason
        }
        addedBy
        creator {
          id
          firstName
          lastName
          avatar
        }
        createdAt
      }
      total
      offset
      limit
    }
  }
`;

export const GET_OFFER_BY_ID = gql`
  query GetOfferById($id: ID!) {
    getOfferById(id: $id) {
      id
      title
      description
      image
      discount
      validityStart
      validityEnd
      status
      claimsCount
      viewsCount
      isActive
      category {
        id
        name
        color
      }
      location
      company
      timeline
      termsAndConditions
      website
      verification {
        isVerified
        verificationReason
      }
      addedBy
      creator {
        id
        firstName
        lastName
        avatar
      }
      createdAt
    }
  }
`;

export const GET_OFFER_CATEGORIES = gql`
  query GetOfferCategories {
    getOfferCategories {
      id
      name
      color
      isActive
      offersCount
      createdAt
    }
  }
`;

export const CREATE_OFFER = gql`
  mutation CreateOffer($input: CreateOfferInput!) {
    createOffer(input: $input) {
      id
      title
      status
    }
  }
`;

export const UPDATE_OFFER = gql`
  mutation UpdateOffer($id: ID!, $input: UpdateOfferInput!) {
    updateOffer(id: $id, input: $input) {
      id
      title
      isActive
    }
  }
`;

export const DELETE_OFFER = gql`
  mutation DeleteOffer($id: ID!) {
    deleteOffer(id: $id)
  }
`;

export const CREATE_OFFER_CATEGORY = gql`
  mutation CreateOfferCategory($input: CreateOfferCategoryInput!) {
    createOfferCategory(input: $input) {
      id
      name
      color
      isActive
      offersCount
      createdAt
    }
  }
`;

export const UPDATE_OFFER_CATEGORY = gql`
  mutation UpdateOfferCategory(
    $updateOfferCategoryId: ID!
    $input: UpdateOfferCategoryInput!
  ) {
    updateOfferCategory(id: $updateOfferCategoryId, input: $input) {
      id
      name
      color
      isActive
      offersCount
      createdAt
    }
  }
`;
export const DELETE_OFFER_CATEGORY = gql`
  mutation DeleteOfferCategory($deleteOfferCategoryId: ID!) {
    deleteOfferCategory(id: $deleteOfferCategoryId)
  }
`;

export const VERIFY_OFFER = gql`
  mutation VerifyOffer($input: VerifyOfferInput!) {
    verifyOffer(input: $input) {
      id
      isVerified
      isVerifiedAt
      verifiedBy
      verificationReason
      offerId
    }
  }
`;

export const CHANGE_OFFER_STATUS = gql`
  mutation ChangeOfferStatus($input: ChangeOfferStatusInput!) {
    changeOfferStatus(input: $input) {
      id
      title
      description
      image
      discount
      validityStart
      validityEnd
      status
      claimsCount
      viewsCount
      category {
        id
        name
        color
        isActive
        offersCount
        createdAt
      }
      location
      company
      timeline
      termsAndConditions
      website
      isApprovedAt
      addedBy
      userId
      isActive
      verification {
        isVerified
        verificationReason
      }
      createdAt
      updatedAt
    }
  }
`;
