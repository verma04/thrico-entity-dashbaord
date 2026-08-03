"use client";
import { gql } from '@apollo/client'
import { MutationHookOptions, useMutation } from '@apollo/client/react'
import type {
  CreateListingInput,
  CreateListingData,
  ContactSellerInput,
  ContactSellerData,
  ReportListingInput,
  ReportListingData,
  MarkListingAsSoldInput,
  MarkListingAsSoldData,
  DeleteListingInput,
  DeleteListingData,
  SendListingMessageInput,
  SendListingMessageData,
  EditListingInput,
  EditListingData,
} from './types'
import {
  GET_ALL_LISTINGS,
  GET_MY_LISTINGS,
  GET_LISTING_STATUS,
  GET_USER_LISTINGS,
} from './listing-quiries'

// Create Listing Mutation
export const CREATE_LISTING = gql`
  mutation CreateListing($input: inputAddListing) {
    createListing(input: $input) {
      title
      description
      condition
      category
      price
      createdAt
      media
      location
    }
  }
`

export const useCreateListing = (
  options?: MutationHookOptions<CreateListingData, CreateListingInput>,
): [
  (input: CreateListingInput['input']) => Promise<any>,
  ReturnType<typeof useMutation>[1],
] => {
  const [mutate, result] = useMutation<CreateListingData, CreateListingInput>(CREATE_LISTING, {
    ...options,
    refetchQueries: [{ query: GET_ALL_LISTINGS }, { query: GET_MY_LISTINGS }],
    awaitRefetchQueries: true,
  })

  const createListing = (input: CreateListingInput['input']) => {
    return mutate({ variables: { input } })
  }

  return [createListing, result]
}

// Contact Seller Mutation
export const CONTACT_SELLER = gql`
  mutation ContactSeller($input: ContactSellerInput!) {
    contactSeller(input: $input) {
      success
      contactId
      messageId
      conversationId
      message
    }
  }
`

export const useContactSeller = (
  options?: MutationHookOptions<ContactSellerData, ContactSellerInput>,
): [
  (input: ContactSellerInput['input']) => Promise<any>,
  ReturnType<typeof useMutation>[1],
] => {
  const [mutate, result] = useMutation<ContactSellerData, ContactSellerInput>(
    CONTACT_SELLER,
    options,
  )

  const contactSeller = (input: ContactSellerInput['input']) => {
    return mutate({ variables: { input } })
  }

  return [contactSeller, result]
}

// Report Listing Mutation
export const REPORT_LISTING = gql`
  mutation ReportListing($input: ReportListingInput!) {
    reportListing(input: $input) {
      success
      reportId
      message
    }
  }
`

export const useReportListing = (
  options?: MutationHookOptions<ReportListingData, ReportListingInput>,
): [
  (input: ReportListingInput['input']) => Promise<any>,
  ReturnType<typeof useMutation>[1],
] => {
  const [mutate, result] = useMutation<ReportListingData, ReportListingInput>(
    REPORT_LISTING,
    options,
  )

  const reportListing = (input: ReportListingInput['input']) => {
    return mutate({ variables: { input } })
  }

  return [reportListing, result]
}

// Mark Listing As Sold Mutation
export const MARK_LISTING_AS_SOLD = gql`
  mutation MarkListingAsSold($input: MarkAsSoldInput!) {
    markListingAsSold(input: $input) {
      success
      message
    }
  }
`

export const useMarkListingAsSold = (
  options?: MutationHookOptions<MarkListingAsSoldData, MarkListingAsSoldInput>,
): [
  (input: MarkListingAsSoldInput['input']) => Promise<any>,
  ReturnType<typeof useMutation>[1],
] => {
  const [mutate, result] = useMutation<MarkListingAsSoldData, MarkListingAsSoldInput>(
    MARK_LISTING_AS_SOLD,
    {
      ...options,
      update: (cache, { data }, { variables }) => {
        if (data?.markListingAsSold.success && variables?.input.listingId) {
          const listingId = variables.input.listingId

          // 1. Update the Listing object globally using writeFragment
          cache.writeFragment({
            id: cache.identify({ __typename: 'Listing', id: listingId }),
            fragment: gql`
              fragment SoldListing on Listing {
                isSold
              }
            `,
            data: {
              isSold: true,
            },
          })

          // 2. Update GET_LISTING_STATUS specifically (optional but safe)
          try {
            cache.writeQuery({
              query: GET_LISTING_STATUS,
              variables: { listingId },
              data: {
                getListingStatus: {
                  __typename: 'ListingStatus',
                  isSold: true,
                },
              },
            })
          } catch (error) {
            console.log('Cache update skipped for GET_LISTING_STATUS:', error)
          }
        }
      },
    },
  )

  const markListingAsSold = (input: MarkListingAsSoldInput['input']) => {
    return mutate({ variables: { input } })
  }

  return [markListingAsSold, result]
}

// Delete Listing Mutation
export const DELETE_LISTING = gql`
  mutation DeleteListing($input: DeleteListingInput!) {
    deleteListing(input: $input) {
      success
      message
    }
  }
`

export const useDeleteListing = (
  options?: MutationHookOptions<DeleteListingData, DeleteListingInput>,
): [
  (input: DeleteListingInput['input']) => Promise<any>,
  ReturnType<typeof useMutation>[1],
] => {
  const [mutate, result] = useMutation<DeleteListingData, DeleteListingInput>(
    DELETE_LISTING,
    {
      ...options,
      update: (cache, { data }, { variables }) => {
        if (data?.deleteListing.success && variables?.input.listingId) {
          const listingId = variables.input.listingId

          // 1. Evict the listing from cache (removes the object itself)
          const normalizedId = cache.identify({ __typename: 'Listing', id: listingId })
          cache.evict({ id: normalizedId })
          cache.gc()

          // 2. Clean up connections in Query fields
          const connectionFields = [
            'getAllListing',
            'getFeaturedListings',
            'getTrendingListings',
            'getMyListings',
            'getListingsByUserId',
          ]

          cache.modify({
            fields: connectionFields.reduce((acc, field) => {
              acc[field] = (existingConnection: any, { readField }: any) => {
                if (!existingConnection?.edges) return existingConnection

                const filteredEdges = existingConnection.edges.filter(
                  (edge: any) => readField('id', edge.node) !== listingId,
                )

                // If nothing was removed, return existing
                if (filteredEdges.length === existingConnection.edges.length) {
                  return existingConnection
                }

                return {
                  ...existingConnection,
                  edges: filteredEdges,
                  totalCount: Math.max(0, (existingConnection.totalCount || 0) - 1),
                }
              }
              return acc
            }, {} as any),
          })
        }
      },
    },
  )

  const deleteListing = (input: DeleteListingInput['input']) => {
    return mutate({ variables: { input } })
  }

  return [deleteListing, result]
}

// Send Listing Message Mutation
export const SEND_LISTING_MESSAGE = gql`
  mutation SendMessage($input: SendListingMessageInput!) {
    sendMessage(input: $input) {
      id
      conversationId
      senderId
      content
      isRead
      readAt
      createdAt
      updatedAt
    }
  }
`

export const useSendListingMessage = (
  options?: MutationHookOptions<SendListingMessageData, SendListingMessageInput>,
): [
  (input: SendListingMessageInput['input']) => Promise<any>,
  ReturnType<typeof useMutation>[1],
] => {
  const [mutate, result] = useMutation<SendListingMessageData, SendListingMessageInput>(
    SEND_LISTING_MESSAGE,
    options,
  )

  const sendMessage = (input: SendListingMessageInput['input']) => {
    return mutate({ variables: { input } })
  }

  return [sendMessage, result]
}

// Edit Listing Mutation
export const EDIT_LISTING = gql`
  mutation EditListing($listingId: ID!, $input: inputAddListing) {
    editListing(listingId: $listingId, input: $input) {
      id
      title
      description
      location
      condition
      category
      price
      createdAt
      media
      currency
    }
  }
`

export const useEditListing = (
  options?: MutationHookOptions<EditListingData, EditListingInput>,
): [(variables: EditListingInput) => Promise<any>, ReturnType<typeof useMutation>[1]] => {
  const [mutate, result] = useMutation<EditListingData, EditListingInput>(
    EDIT_LISTING,
    options,
  )

  const editListing = (variables: EditListingInput) => {
    return mutate({ variables })
  }

  return [editListing, result]
}
