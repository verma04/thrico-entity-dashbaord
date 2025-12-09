interface poll {
  id: string;
}

export interface FeedProps {
  id: number;
  user: {
    avatar: string;
    firstName: string;
    lastName: string;
    about?: {
      currentPosition?: string;
    };
  };
  poll?: poll;

  source:
    | "dashboard"
    | "group"
    | "event"
    | "jobs"
    | "marketPlace"
    | "rePost"
    | "story"
    | "admin"
    | "discussionForum"
    | "poll";
  createdAt: string;
  privacy: "PUBLIC" | "CONNECTIONS";
  addedBy: "ENTITY" | "USER";

  description?: string;
  totalReactions: number;
  totalComment: number;
  totalReShare: number;
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
