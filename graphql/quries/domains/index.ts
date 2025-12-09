const details = `
    id
      domain
      isSubDomain
      ssl
      cname {
        name
        value
        verified
      }
      txt {
        name
        value
        verified
      }
      aRecord {
        name
        value
        verified
      }
      ssl
      isPrimary
      entity
      isVerified
      verifiedAt
      createdAt
      updatedAt
`;

import { gql } from "@apollo/client";
export const ADD_CUSTOM_DOMAIN = gql`
  mutation AddCustomDomain($input: inputDomain) {
    addCustomDomain(input: $input) {
      id
    }
  }
`;

export const GET_DOMAIN_DETAILS = gql`
  query GetCustomDomainDetails($input: inputId!) {
    getCustomDomainDetails(input: $input) {
      ${details}
    }
  }
`;

export const CHECK_DNS_STATUS = gql`
  mutation CheckUpdatedDnsRecord($input: inputId!) {
    checkUpdatedDnsRecord(input: $input) {
      ${details}
    }
  }
`;

export const GET_CUSTOM_DOMAIN = gql`
query GetCustomDomain {
  getCustomDomain {
    ${details}
  }
}`;

export const GET_THRICO_DOMAIN = gql`
  query getThricoDomain {
    getThricoDomain {
      id
      domain
    }
  }
`;

export const DELETE_DOMAIN = gql`
  mutation DeleteDomain($input: inputId!) {
    deleteDomain(input: $input) {
      success
    }
  }
`;

export const CHECK_SSL = gql`
  query CheckSSL($input: inputId!) {
    checkSSL(input: $input) {
      id
      ssl
    }
  }
`;
