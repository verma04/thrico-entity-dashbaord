import { gql } from "@apollo/client";

export const GET_STORE_DISCOUNT_RULES = gql`
  query GetStoreDiscountRules($page: Int, $limit: Int, $search: String) {
    getStoreDiscountRules(page: $page, limit: $limit, search: $search) {
      items {
        id
        entityId
        title
        description
        image
        discountType
        discountValue
        currency
        minCartSubtotal
        maxDiscountCap
        codePrefix
        storeProvider
        connectedDomain
        singleUsePerCustomer
        validityDays
        isActive
        status
        metadata
        totalAllocated
        totalRedeemed
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_STORE_DISCOUNT_RULE_BY_ID = gql`
  query GetStoreDiscountRuleById($id: ID!) {
    getStoreDiscountRuleById(id: $id) {
      id
      entityId
      title
      description
      image
      discountType
      discountValue
      currency
      minCartSubtotal
      maxDiscountCap
      codePrefix
      storeProvider
      connectedDomain
      singleUsePerCustomer
      validityDays
      isActive
      status
      metadata
      totalAllocated
      totalRedeemed
      createdAt
      updatedAt
    }
  }
`;
