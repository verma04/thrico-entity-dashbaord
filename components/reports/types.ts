export interface Reporter {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Report {
  id: string;
  targetId: string;
  module: string;
  reportedBy: string;
  reporter: Reporter;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsData {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  reports: Report[];
}
