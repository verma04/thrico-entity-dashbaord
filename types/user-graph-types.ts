export interface UsersGraphFilter {
  search?: string;
  location?: string;
  industries?: string[];
  skills?: string[];
  education?: string[];
  company?: string[];
  interests?: string[];
  gamificationScore?: ScoreFilter;
  impactScore?: ScoreFilter;
  coins?: ScoreFilter;
  gender?: string[];
}

export interface ScoreFilter {
  min?: number;
  max?: number;
}

export interface GraphNode {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  entityId?: string;
  gamificationScore?: number;
  impactScore?: number;
  coins?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationType: string;
}

export interface UsersGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GetUsersGraphQueryResponse {
  getUsersGraph: UsersGraph;
}

export interface GetUsersGraphQueryVariables {
  filter?: UsersGraphFilter;
  limit?: number;
}
