export interface UsersGraphFilter {
  search?: string;
  location?: string;
  industries?: string[];
  skills?: string[];
  education?: string[];
  company?: string[];
  interests?: string[];
}

export interface GraphNode {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  entityId?: string;
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
