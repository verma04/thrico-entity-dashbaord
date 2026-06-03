import { gql } from "@apollo/client";

const jobs = `
      id
      title
      description
      location
      jobType
      salary
      experienceLevel
      workplaceType
      applicationDeadline
      requirements
      responsibilities
      benefits
      skills
      isFeatured
      entity
      status
      verification {
        id
        isVerifiedAt
        isVerified
        verificationReason
      }
      addedBy
      postedBy {
        id
        firstName
        lastName
        avatar
      }

      company {
        id
        name
        logo
      }
      numberOfApplicant
      numberOfViews
      createdAt
`;
export const ADD_JOB = gql`
  mutation AddJob($input: PostJobInput!) {
    addJob(input: $input) {
${jobs}
    }
  }
`;

export const UPDATE_JOB = gql`
  mutation UpdateJob($input: UpdateJobInput!) {
    updateJob(input: $input) {
${jobs}
    }
  }
`;

export const GET_JOBS = gql`
  query GetJob($input: GetJobInput) {
    getJob(input: $input) {
      ${jobs}
    }
  }
`;

export const GET_JOB_BY_ID = gql`
  query GetJobById($id: ID!) {
    getJobById(id: $id) {
      ${jobs}
    }
  }
`;

export const CHANGE_JOB_STATUS = gql`
mutation ChangeJobStatus($input: ChangeJobStatusInput!) {
  changeJobStatus(input: $input) {
      ${jobs}
  }
}`;

export const CHANGE_JOB_VERIFICATION = gql`
mutation ChangeJobVerification($input: ChangeJobStatusInput!) {
  changeJobVerification(input: $input) {
      ${jobs}
  }
}`;

export const GET_JOB_STATS = gql`
  query GetJobStats($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getJobStats(timeRange: $timeRange, dateRange: $dateRange) {
      totalJobs
      activeJobs
      totalApplications
      totalViews
      totalJobsChange
      activeJobsChange
      applicationsChange
      viewsChange
    }
  }
`;

export const GET_JOB_APPLICATION_TREND = gql`
  query GetJobApplicationTrend($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getJobApplicationTrend(timeRange: $timeRange, dateRange: $dateRange) {
      name
      applications
    }
  }
`;

export const GET_JOB_TYPE_DISTRIBUTION = gql`
  query GetJobTypeDistribution($timeRange: TimeRange, $dateRange: DateRangeInput) {
    getJobTypeDistribution(timeRange: $timeRange, dateRange: $dateRange) {
      name
      value
      color
    }
  }
`;

export const GET_JOB_APPLICANTS = gql`
  query GetJobApplicants($jobId: ID!, $page: Int, $limit: Int) {
    getJobApplicants(jobId: $jobId, page: $page, limit: $limit) {
      data {
        id
        fullName
        email
        phone
        resume
        createdAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;
