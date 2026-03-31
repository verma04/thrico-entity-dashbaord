import { gql } from "@apollo/client";

export const GET_REWARDS = gql`
  query GetRewards(
    $status: String
    $search: String
    $pagination: PaginationInput
  ) {
    getRewards(status: $status, search: $search, pagination: $pagination) {
      id
      title
      description
      image
      tcCost
      inventoryRequired
      perUserLimit
      totalUsageLimit
      minAccountAge
      cooldownPeriod
      category {
        id
        name
      }
      discountType
      discountValue
      validityDays
      status
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_VOUCHERS = gql`
  query GetVouchers($rewardId: ID!, $pagination: PaginationInput) {
    getVouchers(rewardId: $rewardId, pagination: $pagination) {
      id
      offerId
      code
      isUsed
      assignedTo
      assignedAt
      expiryDate
      createdAt
    }
  }
`;

export const GET_REDEMPTIONS = gql`
  query GetRedemptions(
    $userId: ID
    $status: String
    $pagination: PaginationInput
  ) {
    getRedemptions(userId: $userId, status: $status, pagination: $pagination) {
      id
      userId
      rewardId
      ecUsed
      tcUsed
      totalCost
      status
      metadata
      claimedAt
      user {
        id
        firstName
        lastName
        email
      }
      reward {
        id
        title
        image
      }
    }
  }
`;

export const GET_REWARD_STATS = gql`
  query GetRewardStats {
    getRewardStats {
      totalRedemptions
      totalTcBurned
      activeCoupons
      lowInventoryItems
      redemptionTrend {
        date
        count
        value
      }
    }
  }
`;

export const GET_REWARD_SECURITY_SETTINGS = gql`
  query GetRewardSecuritySettings {
    getRewardSecuritySettings {
      dailyRedemptionLimit
      requireKyc
      lockToDeviceId
      maxIpVelocity
    }
  }
`;

export const CREATE_REWARD = gql`
  mutation CreateReward($input: CreateRewardInput!) {
    createReward(input: $input) {
      id
      title
      category {
        id
        name
        color
        isActive
      }
      status
    }
  }
`;

export const UPDATE_REWARD = gql`
  mutation UpdateReward($id: ID!, $input: UpdateRewardInput!) {
    updateReward(id: $id, input: $input) {
      id
      title
      status
      isActive
    }
  }
`;

export const UPLOAD_VOUCHERS = gql`
  mutation UploadVouchers($input: UploadVouchersInput!) {
    uploadVouchers(input: $input)
  }
`;

export const UPDATE_REWARD_SECURITY_SETTINGS = gql`
  mutation UpdateRewardSecuritySettings($input: UpdateRewardSecurityInput!) {
    updateRewardSecuritySettings(input: $input) {
      dailyRedemptionLimit
      requireKyc
      lockToDeviceId
      maxIpVelocity
    }
  }
`;

export const GET_ALL_VOUCHERS = gql`
  query GetAllVouchers(
    $pagination: PaginationInput
    $status: String
    $rewardId: ID
  ) {
    getAllVouchers(
      pagination: $pagination
      status: $status
      rewardId: $rewardId
    ) {
      id
      rewardId
      code
      isUsed
      assignedTo
      assignedAt
      expiryDate
      createdAt
      reward {
        id
        title
      }
    }
  }
`;

export const MARK_VOUCHER_AS_USED = gql`
  mutation MarkVoucherAsUsed($voucherId: ID!) {
    markVoucherAsUsed(voucherId: $voucherId) {
      id
      isUsed
      assignedAt
    }
  }
`;

export const DELETE_VOUCHER = gql`
  mutation DeleteVoucher($voucherId: ID!) {
    deleteVoucher(voucherId: $voucherId)
  }
`;

// ═══════════════════════════════════════════════════
// SPIN WHEEL
// ═══════════════════════════════════════════════════

export const GET_SPIN_WHEEL_CONFIG = gql`
  query GetSpinWheelConfig {
    getSpinWheelConfig {
      id
      entityId
      costPerSpin
      maxSpinsPerDay
      isActive
      campaignStartDate
      campaignEndDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPIN_WHEEL_PRIZES = gql`
  query GetSpinWheelPrizes {
    getSpinWheelPrizes {
      id
      configId
      label
      type
      value
      probability
      color
      sortOrder
      isActive
      rewardId
      createdAt
      updatedAt
      reward {
        id
        title
        description
      }
    }
  }
`;

export const GET_SPIN_WHEEL_PLAYS = gql`
  query GetSpinWheelPlays($pagination: PaginationInput) {
    getSpinWheelPlays(pagination: $pagination) {
      id
      prizeType
      prizeValue
      tcSpent
      playedAt
      user {
        id
        lastName
        firstName
      }
      prize {
        id
        label
      }
    }
  }
`;

export const UPSERT_SPIN_WHEEL_CONFIG = gql`
  mutation UpsertSpinWheelConfig($input: UpsertSpinWheelConfigInput!) {
    upsertSpinWheelConfig(input: $input) {
      id
      costPerSpin
      maxSpinsPerDay
      isActive
      campaignStartDate
      campaignEndDate
    }
  }
`;

export const CREATE_SPIN_WHEEL_PRIZE = gql`
  mutation CreateSpinWheelPrize($input: CreateSpinWheelPrizeInput!) {
    createSpinWheelPrize(input: $input) {
      id
      label
      type
      value
      probability
      color
      sortOrder
      isActive
    }
  }
`;

export const UPDATE_SPIN_WHEEL_PRIZE = gql`
  mutation UpdateSpinWheelPrize($id: ID!, $input: UpdateSpinWheelPrizeInput!) {
    updateSpinWheelPrize(id: $id, input: $input) {
      id
      label
      type
      value
      probability
      isActive
    }
  }
`;

export const DELETE_SPIN_WHEEL_PRIZE = gql`
  mutation DeleteSpinWheelPrize($id: ID!) {
    deleteSpinWheelPrize(id: $id)
  }
`;

// ═══════════════════════════════════════════════════
// SCRATCH CARD
// ═══════════════════════════════════════════════════

export const GET_SCRATCH_CONFIG = gql`
  query GetScratchCardConfig {
    getScratchCardConfig {
      id
      entityId
      costPerScratch
      maxScratchesPerDay
      isActive
      campaignStartDate
      campaignEndDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_SCRATCH_PRIZES = gql`
  query GetScratchCardPrizes {
    getScratchCardPrizes {
      id
      configId
      label
      type
      value
      probability
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_SCRATCH_PLAYS = gql`
  query GetScratchCardPlays($pagination: PaginationInput) {
    getScratchCardPlays(pagination: $pagination) {
      id
      prizeType
      prizeValue
      tcSpent
      playedAt
      prize {
        id
        label
        value
        type
      }
    }
  }
`;

export const UPSERT_SCRATCH_CONFIG = gql`
  mutation UpsertScratchCardConfig($input: UpsertScratchCardConfigInput!) {
    upsertScratchCardConfig(input: $input) {
      id
      costPerScratch
      maxScratchesPerDay
      isActive
      campaignStartDate
      campaignEndDate
    }
  }
`;

export const CREATE_SCRATCH_PRIZE = gql`
  mutation CreateScratchCardPrize($input: CreateScratchCardPrizeInput!) {
    createScratchCardPrize(input: $input) {
      id
      label
      type
      value
      probability
      isActive
    }
  }
`;

export const UPDATE_SCRATCH_PRIZE = gql`
  mutation UpdateScratchCardPrize(
    $id: ID!
    $input: UpdateScratchCardPrizeInput!
  ) {
    updateScratchCardPrize(id: $id, input: $input) {
      id
      label
      type
      value
      probability
      isActive
    }
  }
`;

export const DELETE_SCRATCH_PRIZE = gql`
  mutation DeleteScratchCardPrize($id: ID!) {
    deleteScratchCardPrize(id: $id)
  }
`;

// ═══════════════════════════════════════════════════
// MATCH & WIN
// ═══════════════════════════════════════════════════

export const GET_MATCH_WIN_CONFIG = gql`
  query GetMatchWinConfig {
    getMatchWinConfig {
      id
      entityId
      costPerPlay
      maxPlaysPerDay
      isActive
      festivalMode
      createdAt
      updatedAt
    }
  }
`;

export const GET_MATCH_WIN_PRIZES = gql`
  query GetMatchWinPrizes {
    getMatchWinPrizes {
      id
      label
      type
      value
      probability
      icon
      color
      maxWins
      isActive
      rewardId
      createdAt
      updatedAt
    }
  }
`;

export const GET_MATCH_WIN_PLAYS = gql`
  query GetMatchWinPlays($pagination: PaginationInput) {
    getMatchWinPlays(pagination: $pagination) {
      id
      userId
      prizeType
      prizeValue
      tcSpent
      symbolsWon
      playedAt
      user {
        id
        fullName
        profileImage
      }
      prize {
        id
        label
        type
        value
      }
    }
  }
`;

export const UPSERT_MATCH_WIN_CONFIG = gql`
  mutation UpsertMatchWinConfig($input: UpsertMatchWinConfigInput!) {
    upsertMatchWinConfig(input: $input) {
      id
      costPerPlay
      maxPlaysPerDay
      isActive
      festivalMode
    }
  }
`;

export const CREATE_MATCH_WIN_PRIZE = gql`
  mutation CreateMatchWinPrize($input: CreateMatchWinPrizeInput!) {
    createMatchWinPrize(input: $input) {
      id
      label
      type
      value
      probability
      icon
      color
      maxWins
      isActive
    }
  }
`;

export const UPDATE_MATCH_WIN_PRIZE = gql`
  mutation UpdateMatchWinPrize($id: ID!, $input: UpdateMatchWinPrizeInput!) {
    updateMatchWinPrize(id: $id, input: $input) {
      id
      label
      type
      value
      probability
      icon
      color
      maxWins
      isActive
    }
  }
`;

export const DELETE_MATCH_WIN_PRIZE = gql`
  mutation DeleteMatchWinPrize($id: ID!) {
    deleteMatchWinPrize(id: $id)
  }
`;

export const PLAY_MATCH_WIN = gql`
  mutation PlayMatchWin {
    playMatchWin {
      id
      prizeType
      prizeValue
      symbolsWon
      playedAt
      prize {
        label
        icon
        color
      }
    }
  }
`;

export const GET_SPIN_SCRATCH_STATS = gql`
  query GetSpinScratchStats {
    getSpinScratchStats {
      totalSpins
      totalScratches
      totalMatchWins
      totalTcBurned
      totalTcRewarded
      netTcBurned
      spinStatsToday {
        plays
        tcBurned
        tcRewarded
      }
      scratchStatsToday {
        plays
        tcBurned
        tcRewarded
      }
      matchWinStatsToday {
        plays
        tcBurned
        tcRewarded
      }
    }
  }
`;
