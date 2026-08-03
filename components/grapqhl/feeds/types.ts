export interface GetFeedStatsInput {
  feedId: string
}

export interface BasicStats {
  totalReactions: number
  totalComments: number
  totalShares: number
  createdAt: string
}

export interface ReactionBreakdown {
  count: number
  reactionsType: string
}
export enum FeedType {
  FEED = 'FEED',
  COMMUNITY = 'COMMUNITY',
}
export interface CommentsOverTime {
  count: number
  date: string
}

export interface EngagementByConnections {
  comments: number
  isConnection: boolean
  reactions: number
}

export interface FeedStats {
  feedId: string
  basicStats: BasicStats
  reactionBreakdown: ReactionBreakdown[]
  commentsOverTime: CommentsOverTime[]
  engagementByConnections: EngagementByConnections[]
  impressions: number
  reach: number
}
