import { gql } from "@apollo/client";

export const ADD_FUND_CAMPAIGN = gql`
  mutation AddFundCampaign($input: inputUserCampaign) {
    addFundCampaign(input: $input) {
      success
    }
  }
`;

export const APPROVED_CAMPAIGN = gql`
  query getApprovedCampaign($domain: String) {
    getApprovedCampaign(domain: $domain) {
      category {
        title
        id
      }
      cover
      createdAt
      description
      id
      isApproved
      slug
      shortDescription
      title
      updatedAt
    }
  }
`;

export const CAMPAIGN_PAYMENT = gql`
  mutation CampaignFundPayment($input: paymentInput) {
    campaignFundPayment(input: $input) {
      status
      receipt
      payment
      key_id
      id
      entity
      currency
      created_at
      attempts
      amount_paid
      amount_due
      amount
    }
  }
`;
