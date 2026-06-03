import {
  ADD_JOB,
  UPDATE_JOB,
  CHANGE_JOB_STATUS,
  CHANGE_JOB_VERIFICATION,
  GET_JOB_STATS,
  GET_JOBS,
  GET_JOB_BY_ID,
  GET_JOB_APPLICATION_TREND,
  GET_JOB_TYPE_DISTRIBUTION,
} from "@/graphql/quries/jobs";
import {
  gql,
  useMutation,
  MutationHookOptions,
  MutationTuple,
  QueryHookOptions,
  QueryResult,
  useQuery,
} from "@apollo/client";
import { DateRangeInput, TimeRange } from "../dashbaord/dashboard-quries";
export { TimeRange };
export type { DateRangeInput };

// --- GraphQL Mutation Document ---

// --- TypeScript Types ---

export type JobCompany = {
  id: string;
  name: string;
  logo: string;
};

export type JobLocation = {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  location: JobLocation;
  jobType: string;
  salary: string;
  experienceLevel: string;
  workplaceType: string;
  applicationDeadline: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  isFeatured: boolean;
  entity: string;
  addedBy: string;
  postedBy: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  company: JobCompany;
  numberOfApplicant: number;
  numberOfViews: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  verification: {
    id: string;
    isVerifiedAt: string | null;
    isVerified: boolean;
    verificationReason: string | null;
  };
};

export type PostJobInput = {
  title: string;
  description: string;
  location: string | JobLocation;
  jobType: string;
  salary: string;
  experienceLevel: string;
  workplaceType: string;
  applicationDeadline: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  isFeatured?: boolean;
  entity: string;
  company: {
    id: string;
  };
};

export type UpdateJobInput = {
  id: string;
  title?: string;
  description?: string;
  location?: string | JobLocation;
  jobType?: string;
  salary?: string;
  experienceLevel?: string;
  workplaceType?: string;
  applicationDeadline?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills?: string[];
  isFeatured?: boolean;
  company?: {
    id: string;
  };
};

// --- Apollo Client Hook ---

export function useAddJob(
  options?: MutationHookOptions<{ addJob: Job }, { input: PostJobInput }>,
) {
  return useMutation(ADD_JOB, {
    ...options,
    update(cache, { data }) {
      try {
        const addJob = data?.addJob;
        if (addJob && addJob.status === "APPROVED") {
          // Update for status: "APPROVED"
          const approvedData: any = cache.readQuery({
            query: GET_JOBS,
            variables: {
              input: {
                status: "APPROVED",
              },
            },
          });

          cache.writeQuery({
            query: GET_JOBS,
            data: {
              getJob: [addJob, ...(approvedData?.getJob || [])],
            },
            variables: {
              input: {
                status: "APPROVED",
              },
            },
          });

          // Update for status: "ALL"
          const allData: any = cache.readQuery({
            query: GET_JOBS,
            variables: {
              input: {
                status: "ALL",
              },
            },
          });

          cache.writeQuery({
            query: GET_JOBS,
            data: {
              getJob: [addJob, ...(allData?.getJob || [])],
            },
            variables: {
              input: {
                status: "ALL",
              },
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
}

export function useUpdateJob(
  options?: MutationHookOptions<{ updateJob: Job }, { input: UpdateJobInput }>,
) {
  return useMutation(UPDATE_JOB, {
    ...options,
  });
}

export enum JobStatus {
  ALL = "ALL",
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  DISABLED = "DISABLED",
  PAUSED = "PAUSED",
}

// TypeScript interface for GetJobInput
export interface GetJobInput {
  status?: JobStatus;
}

// --- Apollo Client Hook ---

export function useJobs(
  options?: QueryHookOptions<{ getJob: Job[] }, { input?: GetJobInput }>,
): QueryResult<{ getJob: Job[] }, { input?: GetJobInput }> {
  return useQuery(GET_JOBS, options);
}

export function useGetJobById(
  options?: QueryHookOptions<{ getJobById: Job }, { id: string }>,
): QueryResult<{ getJobById: Job }, { id: string }> {
  return useQuery(GET_JOB_BY_ID, options);
}

export type JobStats = {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalViews: number;
  totalJobsChange: number;
  activeJobsChange: number;
  applicationsChange: number;
  viewsChange: number;
};

export type GetJobStatsResponse = {
  getJobStats: JobStats;
};

// --- Apollo Client Hook ---

export function useJobStats(
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<
    GetJobStatsResponse,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >,
): QueryResult<
  GetJobStatsResponse,
  { timeRange?: TimeRange; dateRange?: DateRangeInput }
> {
  return useQuery(GET_JOB_STATS, {
    variables: { timeRange, dateRange },
    ...options,
  });
}

export function useChangeJobStatus(options?: MutationHookOptions<any, any>) {
  return useMutation(CHANGE_JOB_STATUS, {
    ...options,
    refetchQueries: [
      {
        query: GET_JOBS,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },
      {
        query: GET_JOBS,
        variables: {
          input: {
            status: "PENDING",
          },
        },
      },
      {
        query: GET_JOBS,
        variables: {
          input: {
            status: "DISABLED",
          },
        },
      },

      {
        query: GET_JOBS,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  });
}

export function useChangeJobVerification(
  options?: MutationHookOptions<any, any>,
) {
  return useMutation(CHANGE_JOB_VERIFICATION, {
    ...options,
    refetchQueries: [
      {
        query: GET_JOBS,
        variables: {
          input: {
            status: "ALL",
          },
        },
      },

      {
        query: GET_JOBS,
        variables: {
          input: {
            status: "APPROVED",
          },
        },
      },
    ],
    awaitRefetchQueries: true,
  });
}

export type JobApplicationTrend = {
  name: string;
  applications: number;
};

export type GetJobApplicationTrendResponse = {
  getJobApplicationTrend: JobApplicationTrend[];
};

export function useJobApplicationTrend(
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<
    GetJobApplicationTrendResponse,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >,
): QueryResult<
  GetJobApplicationTrendResponse,
  { timeRange?: TimeRange; dateRange?: DateRangeInput }
> {
  return useQuery(GET_JOB_APPLICATION_TREND, {
    variables: { timeRange, dateRange },
    ...options,
  });
}

export type JobTypeDistribution = {
  name: string;
  value: number;
  color: string;
};

export type GetJobTypeDistributionResponse = {
  getJobTypeDistribution: JobTypeDistribution[];
};

export function useJobTypeDistribution(
  timeRange?: TimeRange,
  dateRange?: DateRangeInput,
  options?: QueryHookOptions<
    GetJobTypeDistributionResponse,
    { timeRange?: TimeRange; dateRange?: DateRangeInput }
  >,
): QueryResult<
  GetJobTypeDistributionResponse,
  { timeRange?: TimeRange; dateRange?: DateRangeInput }
> {
  return useQuery(GET_JOB_TYPE_DISTRIBUTION, {
    variables: { timeRange, dateRange },
    ...options,
  });
}

export type JobApplicant = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  createdAt: string;
};

export type JobApplicantsResponse = {
  data: JobApplicant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function useJobApplicants(jobId: string, page: number = 1, limit: number = 5, options?: QueryHookOptions<{ getJobApplicants: JobApplicantsResponse }, { jobId: string, page: number, limit: number }>) {
  // Import GET_JOB_APPLICANTS directly inside or rely on the updated import at the top of the file
  return useQuery<{ getJobApplicants: JobApplicantsResponse }, { jobId: string, page: number, limit: number }>(require("@/graphql/quries/jobs").GET_JOB_APPLICANTS, {
    variables: { jobId, page, limit },
    ...options,
  });
}

