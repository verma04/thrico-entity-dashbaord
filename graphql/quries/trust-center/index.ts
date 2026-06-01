import { gql } from "@apollo/client";

export const GET_SUPPORT_TICKETS = gql`
  query GetSupportTickets($status: TicketStatus, $category: TicketCategory, $limit: Int, $offset: Int) {
    getSupportTickets(status: $status, category: $category, limit: $limit, offset: $offset) {
      items {
        id
        subject
        description
        category
        subCategory
        status
        priority
        recipientType
        allowReplies
        entityId
        createdById
        targetUserId
        targetUserIds
        createdAt
        updatedAt
        createdBy {
          id
          firstName
          lastName
          avatar
        }
        messages {
          id
          senderType
          senderId
          senderName
          body
          createdAt
        }
      }
      totalCount
    }
  }
`;

export const GET_SUPPORT_TICKET = gql`
  query GetSupportTicket($id: ID!) {
    getSupportTicket(id: $id) {
      id
      subject
      description
      category
      subCategory
      status
      priority
      recipientType
      allowReplies
      entityId
      createdById
      targetUserId
      targetUserIds
      createdAt
      updatedAt
      createdBy {
        id
        firstName
        lastName
        avatar
      }
      messages {
        id
        senderType
        senderId
        senderName
        body
        createdAt
      }
    }
  }
`;

export const CREATE_SUPPORT_TICKET = gql`
  mutation CreateSupportTicket($input: CreateSupportTicketInput!) {
    createSupportTicket(input: $input) {
      id
      subject
      status
      category
      subCategory
    }
  }
`;

export const UPDATE_SUPPORT_TICKET = gql`
  mutation UpdateSupportTicket($id: ID!, $input: UpdateSupportTicketInput!) {
    updateSupportTicket(id: $id, input: $input) {
      id
      status
      priority
      updatedAt
    }
  }
`;

export const REPLY_SUPPORT_TICKET = gql`
  mutation ReplySupportTicket($ticketId: ID!, $body: String!) {
    replySupportTicket(ticketId: $ticketId, body: $body) {
      id
      body
      createdAt
      senderName
      senderType
    }
  }
`;

export const CLOSE_SUPPORT_TICKET = gql`
  mutation CloseSupportTicket($id: ID!) {
    closeSupportTicket(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

// ANNOUNCEMENTS
export const GET_ALL_ANNOUNCEMENTS = gql`
  query GetAllAnnouncements {
    getAllAnnouncements {
      id
      note
      description
      category
      entity
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      highlightsType
      entity
      isExpirable
      expiry
      announcementId
    }
  }
`;
