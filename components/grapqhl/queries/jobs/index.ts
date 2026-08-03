import { gql } from "@apollo/client";

export const GET_ALL_JOBS = gql`
  query GetAllJobs($input: inputGetJobs) {
    getAllJobs(input: $input) {
      edges {
        cursor
        node {
          id
          isFeatured
          isWishList
          isTrending
          details {
            id
            title
            company
            location
            jobType
            experienceLevel
            salary
            description
            applicationLink
            applicationDeadline
            requirements
            responsibilities
            benefits
            skills
            workplaceType
            createdAt
            isFeatured
            isWishList
            isTrending
            numberOfViews
            numberOfApplicant
            status
          }
          postedBy {
            avatar
            email
            firstName
            lastName
            about {
              headline
            }
          }
          canReport
          canDelete
          isOwner
          isJobSaved
          status
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const GET_MY_JOBS = gql`
  query GetMyJobs($input: inputGetJobs) {
    getMyJobs(input: $input) {
      edges {
        cursor
        node {
          id
          isFeatured
          isWishList
          isTrending
          details {
            id
            title
            company
            location
            jobType
            experienceLevel
            salary
            description
            applicationLink
            applicationDeadline
            requirements
            responsibilities
            benefits
            skills
            workplaceType
            createdAt
            isFeatured
            isWishList
            isTrending
            numberOfViews
            numberOfApplicant
            status
          }
          postedBy {
            avatar
            email
            firstName
            lastName
            about {
              headline
            }
          }
          canReport
          canDelete
          isOwner
          isJobSaved
          status
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const GET_ALL_JOBS_APPLIED = gql`
  query GetAllJobsApplied($input: inputGetJobs) {
    getAllJobsApplied(input: $input) {
      edges {
        cursor
        node {
          id
          isFeatured
          isWishList
          isTrending
          details {
            id
            title
            company
            location
            jobType
            experienceLevel
            salary
            description
            applicationLink
            applicationDeadline
            requirements
            responsibilities
            benefits
            skills
            workplaceType
            createdAt
            isFeatured
            isWishList
            isTrending
            numberOfViews
            numberOfApplicant
            status
          }
          postedBy {
            avatar
            email
            firstName
            lastName
            about {
              headline
            }
          }
          canReport
          canDelete
          isOwner
          isJobSaved
          status
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const POST_JOB = gql`
  mutation PostJob($input: tag) {
    postJob(input: $input) {
      id
      jobTitle
      slug
      location
      jobType
      workplaceType
      salary
      company
    }
  }
`;

export const JOBS_POSTED_BY_ME = gql`
  query GetJobPostedByMe {
    getJobPostedByMe {
      id
      jobTitle
      slug
      location
      company
      jobType
      workplaceType
      salary
      description
      experience
    }
  }
`;

export const DUPLICATE_JOB = gql`
  mutation DuplicateJob($input: inputID) {
    duplicateJob(input: $input) {
      id
      jobTitle
      slug
      location
      company
      jobType
      workplaceType
      salary
      description
      experience
    }
  }
`;

export const APPLY_JOB = gql`
  mutation ApplyJob($input: inputApplyJob!) {
    applyJob(input: $input) {
      success
    }
  }
`;

export const GET_SEARCH_JOB_TITLE = gql`
  query GetSearchJobTitle($input: ClassificationSearchInput) {
    getSearchJobTitle(input: $input) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const ADD_JOB = gql`
  mutation createJob($input: inputPostJob) {
    createJob(input: $input) {
      id
      title
      company
      location
      jobType
      experienceLevel
      salary
      description
      applicationLink
      applicationDeadline
      requirements
      responsibilities
      benefits
      skills
      workplaceType
      createdAt
      isFeatured
      isWishList
      isTrending
      numberOfViews
      numberOfApplicant
      status
    }
  }
`;
