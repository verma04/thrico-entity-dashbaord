import { gql } from "@apollo/client";

export const GET_MANUAL_VOUCHERS = gql`
  query GetManualVouchers($filter: ManualVouchersFilterInput) {
    getManualVouchers(filter: $filter) {
      items {
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
        assignedTo
        assignedToUser {
          id
          firstName
          lastName
          email
          avatar
        }
        assignedAt
        redeemedAt
        expiryDate
        metadata
        createdAt
        updatedAt
        reward {
          id
          title
          image
          tcCost
        }
        batch {
          id
          name
          fileName
          couponType
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_MANUAL_VOUCHER_BY_ID = gql`
  query GetManualVoucherById($id: ID!) {
    getManualVoucherById(id: $id) {
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
      assignedTo
      assignedToUser {
        id
        firstName
        lastName
        email
        avatar
      }
      assignedAt
      redeemedAt
      expiryDate
      metadata
      createdAt
      updatedAt
      reward {
        id
        title
        image
        tcCost
      }
      batch {
        id
        name
        fileName
        couponType
      }
    }
  }
`;

export const GET_MANUAL_VOUCHER_BATCHES = gql`
  query GetManualVoucherBatches($rewardId: ID, $page: Int, $limit: Int) {
    getManualVoucherBatches(rewardId: $rewardId, page: $page, limit: $limit) {
      items {
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
          tcCost
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_MANUAL_VOUCHER_BATCH_BY_ID = gql`
  query GetManualVoucherBatchById($id: ID!) {
    getManualVoucherBatchById(id: $id) {
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
        tcCost
      }
    }
  }
`;
