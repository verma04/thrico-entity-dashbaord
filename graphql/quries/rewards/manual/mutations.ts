import { gql } from "@apollo/client";

export const CREATE_MANUAL_VOUCHER_BATCH = gql`
  mutation CreateManualVoucherBatch($input: CreateManualVoucherBatchInput!) {
    createManualVoucherBatch(input: $input) {
      id
      entityId
      rewardId
      name
      description
      image
      url
      fileName
      couponType
      inventoryRequired
      totalCount
      allocatedCount
      redeemedCount
      remainingCount
      faceValue
      currency
      expiryDate
      status
      metadata
      createdAt
      updatedAt
      reward {
        id
        title
        image
      }
    }
  }
`;

export const CREATE_MANUAL_VOUCHER = gql`
  mutation CreateManualVoucher($input: CreateManualVoucherEntryInput!) {
    createManualVoucher(input: $input) {
      id
      entityId
      rewardId
      batchId
      couponType
      code
      cardNumber
      pin
      claimUrl
      faceValue
      currency
      inventoryRequired
      totalInventory
      remainingInventory
      totalUsageLimit
      perUserLimit
      status
      isUsed
      expiryDate
      metadata
      createdAt
      updatedAt
      reward {
        id
        title
        image
      }
    }
  }
`;

export const UPDATE_MANUAL_VOUCHER = gql`
  mutation UpdateManualVoucher($id: ID!, $input: UpdateManualVoucherInput!) {
    updateManualVoucher(id: $id, input: $input) {
      id
      entityId
      rewardId
      batchId
      couponType
      code
      cardNumber
      pin
      claimUrl
      faceValue
      currency
      inventoryRequired
      totalInventory
      remainingInventory
      totalUsageLimit
      perUserLimit
      status
      isUsed
      expiryDate
      metadata
      updatedAt
    }
  }
`;

export const DELETE_MANUAL_VOUCHER = gql`
  mutation DeleteManualVoucher($id: ID!) {
    deleteManualVoucher(id: $id)
  }
`;

export const DELETE_MANUAL_VOUCHER_BATCH = gql`
  mutation DeleteManualVoucherBatch($id: ID!) {
    deleteManualVoucherBatch(id: $id)
  }
`;

export const VOID_MANUAL_VOUCHER = gql`
  mutation VoidManualVoucher($id: ID!) {
    voidManualVoucher(id: $id) {
      id
      status
      isUsed
      updatedAt
    }
  }
`;
