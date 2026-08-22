import { gql } from "@apollo/client";

export const CREATE_STORE_DISCOUNT_RULE = gql`
  mutation CreateStoreDiscountRule($input: CreateStoreDiscountRuleInput!) {
    createStoreDiscountRule(input: $input) {
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

export const UPDATE_STORE_DISCOUNT_RULE = gql`
  mutation UpdateStoreDiscountRule(
    $id: ID!
    $input: UpdateStoreDiscountRuleInput!
  ) {
    updateStoreDiscountRule(id: $id, input: $input) {
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

export const DELETE_STORE_DISCOUNT_RULE = gql`
  mutation DeleteStoreDiscountRule($id: ID!) {
    deleteStoreDiscountRule(id: $id)
  }
`;
