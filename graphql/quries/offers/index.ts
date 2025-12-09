import { gql, useMutation } from "@apollo/client";

const offerFields = `
     id
      title
      description
     location
      company {
        id
        name
        logo
      }
        isActive
      timeline
      termsAndConditions
      website
       createdAt
       updatedAt
       cover
      `;
export const ADD_OFFER_MUTATION = gql`
  mutation AddOffer($input: AddOfferInput!) {
    addOffer(input: $input) {
      ${offerFields}
    }
  }
`;

// GraphQL query
export const GET_ALL_OFFER = gql`
  query GetAllOffer($input: GetAllOfferInput) {
    getAllOffer(input: $input) {
         ${offerFields}
    }
  }
`;

export const EDIT_OFFER_MUTATION = gql`
  mutation EditOffer($input: EditOfferInput!) {
    editOffer(input: $input) {
       ${offerFields}
    }
  }
`;

export const CHANGE_OFFER_STATUS_MUTATION = gql`
  mutation ChangeOfferStatus($input: ChangeStatusInput!) {
    changeOfferStatus(input: $input) {
   ${offerFields}
    }
  }
`;

export const GET_OFFER_STATS = gql`
  query GetOfferStats {
    getOfferStats {
      total
      active
      inactive
      thisMonth
      activePercent
      inactivePercent
    }
  }
`;
