export interface FeedProps {
  id: number;
  user: {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    about?: {
      currentPosition?: string;
    };
  };
  description?: string;
  createdAt: string;
  totalReactions: number;
  totalComment: number;
  totalReShare: number;
  isLiked: boolean;
  isWishList: boolean;
  isOwner: boolean;
  source: string;
  privacy: "PUBLIC" | "CONNECTIONS";
  addedBy: "ENTITY" | "USER";
  isPinned?: boolean;
  pinnedAt?: string;
  media?: {
    url: string;
  }[];
  poll?: {
    id: string;
    title: string;
    question: string;
    resultVisibility: string;
    options: {
      id: string;
      text: string;
      order: number;
      votes: number;
    }[];
    updatedAt: string;
    createdAt: string;
    endDate?: string;
    status: string;
    totalVotes: number;
    isVoted: boolean;
    votedOptionId?: string;
  };
  moment?: {
    id: string;
    videoUrl: string;
    hlsUrl: string;
    thumbnailUrl: string;
    optimizedVideoUrl?: string;
    caption?: string;
    createdAt: string;
    updatedAt: string;
    totalReshares: number;
    totalComments: number;
    totalReactions: number;
  };
  job?: {
    title: string;
    description: string;
    location: string;
    jobType: string;
    salary: string;
    experienceLevel: string;
    workplaceType: string;
    applicationDeadline: string;
  };
  marketPlace?: {
    id: string;
    title: string;
    price: number;
    description: string;
    location: {
      name: string;
    };
    category?: string;
    media: {
      url: string;
    }[];
  };
  celebration?: {
    id: string;
    status: string;
    userId: string;
    entityId: string;
    celebrationType: string;
    title: string;
    description: string;
    cover: string;
  };
}

export interface commentProps {
  id: string;
  user: {
    avatar: string;
    firstName: string;
    lastName: string;
    about?: {
      currentPosition?: string;
    };
  };

  createdAt: string;

  addedBy: "ENTITY" | "USER";

  content: string;
}

export interface UploadFile {
  uid: string;
  name?: string;
  url?: string;
  originFileObj?: File;
  status?: "done" | "uploading" | "error";
}
