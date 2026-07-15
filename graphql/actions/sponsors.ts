import { gql, useQuery, useMutation } from "@apollo/client";

export const GET_SPONSORS = gql`
  query GetSponsors {
    getSponsors {
      id
      title
      image
      description
      externalUrl
      displayOrder
      entityId
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPONSOR = gql`
  query GetSponsor($id: ID!) {
    getSponsor(id: $id) {
      id
      title
      image
      description
      externalUrl
      displayOrder
      entityId
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SPONSOR = gql`
  mutation CreateSponsor($input: CreateSponsorInput!) {
    createSponsor(input: $input) {
      id
      title
      image
    }
  }
`;

export const UPDATE_SPONSOR = gql`
  mutation UpdateSponsor($id: ID!, $input: UpdateSponsorInput!) {
    updateSponsor(id: $id, input: $input) {
      id
      title
      image
    }
  }
`;

export const DELETE_SPONSOR = gql`
  mutation DeleteSponsor($id: ID!) {
    deleteSponsor(id: $id)
  }
`;

export const REORDER_SPONSORS = gql`
  mutation ReorderSponsors($input: [ReorderSponsorInput!]!) {
    reorderSponsors(input: $input)
  }
`;

export const useGetSponsors = () => {
  return useQuery(GET_SPONSORS, {
    fetchPolicy: "network-only",
  });
};

export const useGetSponsor = (id: string) => {
  return useQuery(GET_SPONSOR, {
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });
};

export const useCreateSponsor = () => {
  return useMutation(CREATE_SPONSOR, {
    refetchQueries: [{ query: GET_SPONSORS }],
  });
};

export const useUpdateSponsor = () => {
  return useMutation(UPDATE_SPONSOR, {
    refetchQueries: [{ query: GET_SPONSORS }],
  });
};

export const useDeleteSponsor = () => {
  return useMutation(DELETE_SPONSOR, {
    refetchQueries: [{ query: GET_SPONSORS }],
  });
};

export const useReorderSponsors = () => {
  return useMutation(REORDER_SPONSORS, {
    refetchQueries: [{ query: GET_SPONSORS }],
  });
};
