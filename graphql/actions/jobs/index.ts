import {
  gql,
  useMutation,
  MutationHookOptions,
  MutationTuple,
  QueryHookOptions,
  QueryResult,
  useQuery,
} from "@apollo/client";
import {
  ADD_JOB,
  CHANGE_JOB_STATUS,
  CHANGE_JOB_VERIFICATION,
  GET_JOB_STATS,
  GET_JOBS,
} from "../../quries/jobs";

// --- GraphQL Mutation Document ---

// --- TypeScript Types ---

export type JobCompany = {
  id: string;
  name: string;
  logo: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
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
  postedBy: string;
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
  location: string;
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
};

// --- Apollo Client Hook ---

export function useAddJob(
  options?: MutationHookOptions<{ addJob: Job }, { input: PostJobInput }>
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
  options?: QueryHookOptions<{ getJob: Job[] }, { input?: GetJobInput }>
): QueryResult<{ getJob: Job[] }, { input?: GetJobInput }> {
  return useQuery(GET_JOBS, options);
}

export type JobStats = {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalViews: number;
  avgApplications: number;
  applicationsThisWeek: number;
  applicationsLastWeek: number;
  applicationsWeeklyChange: number;
  viewsThisWeek: number;
  viewsLastWeek: number;
  viewsWeeklyChange: number;
};

// --- Apollo Client Hook ---

export function useJobStats(
  options?: QueryHookOptions<{ getJobStats: JobStats }>
): QueryResult<{ getJobStats: JobStats }> {
  return useQuery(GET_JOB_STATS, options);
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
  options?: MutationHookOptions<any, any>
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
