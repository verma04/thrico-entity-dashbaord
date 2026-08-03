// Create Listing Types
export type CreateListingInput = {
  input: {
    title: string
    description: string
    condition: string
    category: string
    sku?: string | null
    price: number
    createdAt?: string
    media: string[]
    location: any
  }
}

export type CreateListingData = {
  createListing: {
    title: string
    description: string
    condition: string
    category: string
    price: number
    createdAt: string
    media: string[]
    location: any
  }
}

// Edit Listing Types
export type EditListingInput = {
  listingId: string
  input: {
    title?: string | null
    description?: string | null
    location?: string | null
    condition?: string | null
    category?: string | null
    price?: number | null
    media?: File[] | null
    retainedMedia?: string[] | null
    sku?: string | null
  }
}

export type EditListingData = {
  editListing: {
    id: string
    title: string
    description: string
    location: string
    condition: string
    category: string
    price: number
    createdAt: string
    media: string[]
    currency: string
  }
}

// Contact Seller Types
export type ContactSellerInput = {
  input: {
    listingId: string | null
    message: string | null
  }
}

export type ContactSellerData = {
  contactSeller: {
    success: boolean
    contactId: string
    messageId: string
    conversationId: string
    message: string
  }
}

// Report Listing Types
export type ReportListingInput = {
  input: {
    listingId: string | null
    reason: string | null
    description: string | null
  }
}

export type ReportListingData = {
  reportListing: {
    success: boolean
    reportId: string
    message: string
  }
}

// Mark Listing As Sold Types
export type MarkListingAsSoldInput = {
  input: {
    listingId: string | null
  }
}

export type MarkListingAsSoldData = {
  markListingAsSold: {
    success: boolean
    message: string
  }
}

// Delete Listing Types
export type DeleteListingInput = {
  input: {
    listingId: string | null
  }
}

export type DeleteListingData = {
  deleteListing: {
    success: boolean
    message: string
  }
}

// Get Listing Status Types
export type GetListingStatusInput = {
  listingId: string
}

export type GetListingStatusData = {
  getListingStatus: {
    isSold: boolean
  }
}

// Get Listing Details By ID Types
export type GetListingByIdInput = {
  input: {
    identifier: string | null
  }
}

export type GetListingDetailsByIdData = {
  getListingDetailsById: ListingDetailsExtended
}

// Listing Status Enum
export enum ListingStatus {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

// Get My Listings Types
export type GetMyListingsInput = {
  input?: {
    search?: string | null
    status?: ListingStatus | null
    cursor?: string | null
    limit?: number | null
    filter?: ListingFilterInput | null
  }
}

export type GetMyListingsData = {
  getMyListings: ListingConnection
}

// Get All Listings Types
export type ListingDetails = {
  id: string
  title: string
  description: string
  location: string
  condition: string
  category: string
  price: number
  createdAt: string
  media: string[]
  currency: string
}

export type SellerRating = {
  averageRating: number
  ratingDistribution: number[]
  totalRatings: number
}

export type User = {
  id: string
  firstName: string
  lastName: string
  avatar: string
  cover?: string
}

export type Verification = {
  id: string
  isVerified: boolean
  verifiedBy: string
  isVerifiedAt: string
  verificationReason: string
}

export type ListingDetailsExtended = {
  details: ListingDetails
  isFeatured: boolean
  isWishList: boolean
  isTrending: boolean
  isSold: boolean
  id: string
  user: User
  sellerRating: SellerRating
  numberOfViews: number
  numberOfContactClick: number
  isOwner: boolean
  canReport: boolean
  canDelete: boolean
  status?: string
  verification?: Verification
  relatedListings?: Listing[]
}

export type Listing = {
  details: ListingDetails
  isFeatured: boolean
  isWishList: boolean
  isTrending: boolean
  isSold: boolean
  id: string
  user?: User
  seller?: User
  sellerRating: SellerRating
  numberOfViews: number
  numberOfContactClick: number
  isOwner: boolean
  canReport: boolean
  canDelete: boolean
  status?: string
}

export type PageInfo = {
  endCursor: string | null
  hasNextPage: boolean
}

export type ListingEdge = {
  cursor: string
  node: Listing
}

export type ListingConnection = {
  edges: ListingEdge[]
  pageInfo: PageInfo
  totalCount: number
}

export type Pagination = {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type GetAllListingData = {
  getAllListing: ListingConnection
}

export type GetFeaturedListingsData = {
  getFeaturedListings: ListingConnection
}

export type GetTrendingListingsData = {
  getTrendingListings: ListingConnection
}

export type ListingFilterInput = {
  category?: string | null
  status?: ListingStatus | null
  condition?: string | null
}

export type GetAllListingInput = {
  input?: {
    limit?: number | null
    cursor?: string | null
    search?: string | null
    filter?: ListingFilterInput | null
  }
}

// Pagination Input Type
export type PaginationInput = {
  cursor?: string | null
  limit?: number | null
  filter?: ListingFilterInput | null
}

// Get Seller Received Enquiries Types
export type GetSellerReceivedEnquiriesInput = {
  input?: PaginationInput
}

// Get User Listing Enquiries Types
export type GetUserListingEnquiriesInput = {
  input?: PaginationInput
}

// Get Listing Enquiries Types
export type GetListingEnquiriesInput = {
  input: {
    listingId: string | null
    cursor?: string | null
    limit?: number | null
  }
}

export type EnquiryListing = {
  id: string
  media: string[]
  price: number
  title: string
  currency: string
}

export type EnquiryUser = {
  id: string
  firstName: string
  lastName: string
  avatar: string
}

export type EnquiryMessage = {
  id: string
  content: string
  createdAt: string
  isRead: boolean
}

export type EnquiryConversation = {
  id: string
}

export type Enquiry = {
  id: string
  createdAt: string
  listing: EnquiryListing
  seller: EnquiryUser
  buyer: EnquiryUser
  message: EnquiryMessage
  conversation: EnquiryConversation
}

export type EnquiryEdge = {
  cursor: string
  node: Enquiry
}

export type EnquiryConnection = {
  edges: EnquiryEdge[]
  pageInfo: PageInfo
  totalCount: number
}

export type GetUserListingEnquiriesData = {
  getUserListingEnquiries: EnquiryConnection
}

export type GetSellerReceivedEnquiriesData = {
  getSellerReceivedEnquiries: EnquiryConnection
}

// Has Contacted Seller Types
export type HasContactedSellerInput = {
  listingId: string
}

export type HasContactedSellerData = {
  hasContactedSeller: {
    hasContacted: boolean
  }
}

// Conversation Messages Types
export type ConversationMessageSender = {
  id: string
  firstName: string
  lastName: string
  avatar: string
}

export type ConversationMessage = {
  id: string
  content: string
  createdAt: string
  isRead: boolean
  readAt: string | null
  sender: ConversationMessageSender
  isMine: boolean
}

export type MessageEdge = {
  cursor: string
  node: ConversationMessage
}

export type MessageConnection = {
  edges: MessageEdge[]
  pageInfo: PageInfo
  totalCount: number
}

export type GetListingConversationMessagesInput = {
  conversationId: string
  input?: PaginationInput
}

export type GetListingConversationMessagesData = {
  getListingConversationMessages: MessageConnection
}

// Get Related Listings Types
export type RelatedListing = {
  id: string
  isSold: boolean
  details: {
    title: string
    price: number
    currency: string
    media: string[]
    category: string
  }
  sellerRating: {
    averageRating: number
    totalRatings: number
  }
}

export type RelatedListingEdge = {
  cursor: string
  node: RelatedListing
}

export type RelatedListingConnection = {
  edges: RelatedListingEdge[]
  pageInfo: PageInfo
  totalCount: number
}

export type GetRelatedListingsInput = {
  input: {
    listingId: string
    cursor?: string | null
    limit?: number
  }
}

export type GetRelatedListingsData = {
  getRelatedListingsByListingId: RelatedListingConnection
}

// Get User Listings Types
export type UserListing = {
  id: string
  isSold: boolean
  isOwner: boolean
  canDelete: boolean
  isFeatured: boolean
  isWishList: boolean
  isTrending: boolean
  canReport: boolean
  status?: string
  details: ListingDetails
  numberOfViews: number
  numberOfContactClick: number
  sellerRating: SellerRating
  user: User
}

export type UserListingEdge = {
  cursor: string
  node: UserListing
}

export type UserListingConnection = {
  edges: UserListingEdge[]
  pageInfo: PageInfo
  totalCount: number
}

export type GetUserListingsInput = {
  input: {
    userId: string
    cursor?: string | null
    limit?: number | null
  }
}

export type GetUserListingsData = {
  getListingsByUserId: UserListingConnection & {
    seller?: User & {
      email?: string
      rating?: SellerRating
    }
  }
}

// Send Listing Message Types
export type SendListingMessageInput = {
  input: {
    conversationId: string | null
    content: string | null
  }
}

export type SendListingMessageData = {
  sendMessage: {
    id: string
    conversationId: string
    senderId: string
    content: string
    isRead: boolean
    readAt: string | null
    createdAt: string
    updatedAt: string
  }
}

// Get Listing Stats Types
export type PopularCategory = {
  count: number
  name: string
}

export type GetListingStatsData = {
  getListingStats: {
    totalListings: number
    newToday: number
    yourEnquiry: number
    savedListings: number
    popularCategories: PopularCategory[]
  }
}

// Get Listing Enquiry Stats Types
export type GetListingEnquiryStatsData = {
  getListingEnquiryStats: {
    totalEnquiries: number
    uniqueBuyers: number
    unreadEnquiries: number
  }
}
