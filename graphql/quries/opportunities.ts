import { gql } from "@apollo/client";

export const ADMIN_GET_OPPORTUNITIES = gql`
  query AdminGetOpportunities($input: GetAdminOpportunitiesInput) {
    adminGetOpportunities(input: $input) {
      meta {
        currentPage
        totalPages
        totalItems
        itemsPerPage
        hasNextPage
        hasPreviousPage
      }
      data {
        id
        title
        description
        category
        subcategory
        status
        isActive
        isFeatured
        coverImage
        tags
        location
        website
        budgetRange
        timeline
        requirements
        skills
        viewsCount
        interestedCount
        savedCount
        userId
        entityId
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADMIN_GET_OPPORTUNITY_BY_ID = gql`
  query AdminGetOpportunityById($id: ID!) {
    adminGetOpportunityById(id: $id) {
      id
      title
      description
      category
      subcategory
      status
      isActive
      isFeatured
      coverImage
      tags
      location
      website
      budgetRange
      timeline
      requirements
      skills
      viewsCount
      interestedCount
      savedCount
      userId
      entityId
      createdAt
      updatedAt
    }
  }
`;

export const ADMIN_CHANGE_OPPORTUNITY_STATUS = gql`
  mutation AdminChangeOpportunityStatus($input: ChangeOpportunityStatusInput!) {
    adminChangeOpportunityStatus(input: $input) {
      id
      status
    }
  }
`;

export const ADMIN_DELETE_OPPORTUNITY = gql`
  mutation AdminDeleteOpportunity($id: ID!) {
    adminDeleteOpportunity(id: $id)
  }
`;

export const ADMIN_TOGGLE_OPPORTUNITY_FEATURED = gql`
  mutation AdminToggleOpportunityFeatured($id: ID!) {
    adminToggleOpportunityFeatured(id: $id) {
      id
      isFeatured
    }
  }
`;

export const GET_ALL_OPPORTUNITIES_GRAPH = gql`
  query GetAllOpportunitiesGraph($limit: Int) {
    getAllOpportunitiesGraph(limit: $limit) {
      opportunity {
        id
        title
        description
      }
      skills {
        id
        name
        description
      }
      interestedUsers {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
      creator {
        id
        globalUserId
        firstName
        lastName
        avatar
        headline
      }
    }
  }
`;
