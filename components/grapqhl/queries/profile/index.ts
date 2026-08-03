"use client";
import { gql } from "@apollo/client";
import { useQuery, QueryHookOptions } from "@apollo/client/react";

export const GET_USER_PROFILE = gql`
  query GetUserProfile($input: inputId) {
    getUserProfile(input: $input) {
      id
      firstName
      avatar
      lastName
      userId
      user {
        id
        avatar
        email
        firstName
        lastName
        cover
      }
      status
      isOnline
      designation
      cover
      connectedAt
      mutualFriends {
        count
        friends {
          avatar
          id
          firstName
          lastName
        }
      }
      isFollowing
      numberOfConnections
      isCloseFriend
      currentCompany
      currentEducation
      interests
      industries
      jobFunctions
    }
  }
`;

export const GET_PROFILE_TAGS = gql`
  query Query {
    getProfileTag
  }
`;

export const UPDATE_PROFILE_TAGS = gql`
  mutation EditProfileTag($input: profileTag) {
    editProfileTag(input: $input)
  }
`;

export const UPDATE_COVER_IMAGE = gql`
  mutation UpdateProfileCover($input: inputUpdateProfileCover!) {
    updateProfileCover(input: $input) {
      cover
    }
  }
`;
export const UPDATE_AVATAR = gql`
  mutation UpdateProfileAvatar($input: inputUpdateProfileAvatar!) {
    updateProfileAvatar(input: $input) {
      avatar
    }
  }
`;
export const UPDATE_PROFILE_DETAILS = gql`
  mutation UpdateProfileDetails($input: inputProfileDetails) {
    updateProfileDetails(input: $input) {
      user {
        id
        firstName
        avatar
        lastName
        about {
          currentPosition
          bio
          linkedin
          instagram
          portfolio
          about
          pronouns
          headline
        }
        isOnline
        profile {
          education {
            id
            school
            degree
            grade
            activities
            description
            duration
          }
          experience {
            id
            companyName
            duration
            employmentType
            location
            locationType
            title
          }
        }
        cover
      }
    }
  }
`;

export const GET_PROFILE_INFO = gql`
  query GetProfileInfo {
    getProfileInfo {
      education
      experience
      currentEducation {
        id
        school {
          name
        }
        degree
        grade
        activities
        description
        duration
      }
      currentCompany {
        id
        company {
          name
        }
        duration
        employmentType
        locationType
        title
        startDate
        currentlyWorking
        location
      }

      interests
      socialLinks
      interestsCategories
      connections {
        count
        friends {
          id
          firstName
          lastName
          avatar
        }
      }
      followers
      following
      skills {
        id
        skillId
        name
        category
        level
        tags
        yearsOfExperience
        description
      }
    }
  }
`;

export const useGetProfileInfo = (options?: QueryHookOptions<any, any>) => {
  return useQuery<any, any>(GET_PROFILE_INFO, options);
};

export const useGetUserProfile = (options?: QueryHookOptions<any, any>) => {
  return useLazyQuery<any, any>(GET_USER_PROFILE, options);
};

export const ADD_EDUCATION_ITEM = gql`
  mutation AddEducationItem($input: inputEducation!) {
    addEducationItem(input: $input) {
      activities
      degree
      description
      duration
      grade
      id
      school {
        id
        name
        logo
        type
      }
    }
  }
`;

export const GET_SEARCH_COMPANIES = gql`
  query GetSearchCompanies($input: ClassificationSearchInput) {
    getSearchCompanies(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_EDUCATION = gql`
  query GetSearchEducation($input: ClassificationSearchInput) {
    getSearchEducation(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SEARCH_DEGREE = gql`
  query GetSearchDegree($input: ClassificationSearchInput) {
    getSearchDegree(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const EDIT_EDUCATION_ITEM = gql`
  mutation EditEducationItem(
    $editEducationItemId: String!
    $input: inputEducation!
  ) {
    editEducationItem(id: $editEducationItemId, input: $input) {
      id
      school {
        id
        name
        logo
        type
      }
      degree
      grade
      activities
      description
      duration
    }
  }
`;

export const EDIT_EXPERIENCE_ITEM = gql`
  mutation EditExperienceItem(
    $editExperienceItemId: String!
    $input: inputExperience!
  ) {
    editExperienceItem(id: $editExperienceItemId, input: $input) {
      id
      company {
        id
        name
        logo
      }
      duration
      employmentType
      locationType
      title
      startDate
      currentlyWorking
      location
    }
  }
`;

export const DELETE_EDUCATION_ITEM = gql`
  mutation DeleteEducationItem($deleteEducationItemId: String!) {
    deleteEducationItem(id: $deleteEducationItemId) {
      id
      school {
        id
        name
        logo
        type
      }
      degree
      grade
      activities
      description
      duration
    }
  }
`;

export const REORDER_EDUCATION = gql`
  mutation ReorderEducation($input: [ID!]!) {
    reorderEducation(input: $input) {
      id
      school {
        id
        name
        logo
        type
      }
      degree
      grade
      activities
      description
      duration
    }
  }
`;

export const ADD_EXPERIENCE_ITEM = gql`
  mutation AddExperienceItem($input: inputExperience!) {
    addExperienceItem(input: $input) {
      id
      company {
        id
        name
        logo
        type
      }
      duration
      employmentType
      locationType
      title
      startDate
      currentlyWorking
      location
    }
  }
`;

export const DELETE_EXPERIENCE_ITEM = gql`
  mutation DeleteExperienceItem($deleteExperienceItemId: String!) {
    deleteExperienceItem(id: $deleteExperienceItemId) {
      id
      company {
        id
        name
        logo
      }
      duration
      employmentType
      locationType
      title
      startDate
      currentlyWorking
      location
    }
  }
`;

export const REORDER_EXPERIENCE = gql`
  mutation ReorderExperience($input: [ID!]!) {
    reorderExperience(input: $input) {
      id
      company {
        id
        name
        logo
        type
      }
      duration
      employmentType
      locationType
      title
      startDate
      currentlyWorking
      location
    }
  }
`;

import {
  useMutation,
  MutationHookOptions,
  useLazyQuery,
} from "@apollo/client/react";

export const useAddEducationItem = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(ADD_EDUCATION_ITEM, options);
};

export const useEditEducationItem = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(EDIT_EDUCATION_ITEM, options);
};

export const useDeleteEducationItem = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(DELETE_EDUCATION_ITEM, options);
};

export const useReorderEducation = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(REORDER_EDUCATION, options);
};

export const useAddExperienceItem = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(ADD_EXPERIENCE_ITEM, options);
};

export const useEditExperienceItem = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(EDIT_EXPERIENCE_ITEM, options);
};

export const useDeleteExperienceItem = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(DELETE_EXPERIENCE_ITEM, options);
};

export const useReorderExperience = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(REORDER_EXPERIENCE, options);
};

export const useGetSearchCompanies = (options?: QueryHookOptions<any, any>) => {
  return useLazyQuery<any, any>(GET_SEARCH_COMPANIES, options);
};

export const useGetSearchEducation = (options?: QueryHookOptions<any, any>) => {
  return useLazyQuery<any, any>(GET_SEARCH_EDUCATION, options);
};

export const useGetSearchDegree = (options?: QueryHookOptions<any, any>) => {
  return useLazyQuery<any, any>(GET_SEARCH_DEGREE, options);
};

export const ADD_SKILL_ITEM = gql`
  mutation AddSkillsItem($input: inputSkill!) {
    addSkillsItem(input: $input) {
      id
      skillId
      name
      category
      level
      tags
      yearsOfExperience
      description
    }
  }
`;

export const EDIT_SKILL_ITEM = gql`
  mutation EditSkillsItem($editSkillsItemId: String!, $input: inputSkill!) {
    editSkillsItem(id: $editSkillsItemId, input: $input) {
      id
      skillId
      name
      category
      level
      tags
      yearsOfExperience
      description
    }
  }
`;

export const DELETE_SKILL_ITEM = gql`
  mutation DeleteSkillsItem($deleteSkillsItemId: String!) {
    deleteSkillsItem(id: $deleteSkillsItemId) {
      id
      skillId
      name
      category
      level
      tags
      yearsOfExperience
      description
    }
  }
`;

export const useAddSkillItem = (options?: MutationHookOptions<any, any>) => {
  return useMutation<any, any>(ADD_SKILL_ITEM, options);
};

export const useEditSkillItem = (options?: MutationHookOptions<any, any>) => {
  return useMutation<any, any>(EDIT_SKILL_ITEM, options);
};

export const useDeleteSkillItem = (options?: MutationHookOptions<any, any>) => {
  return useMutation<any, any>(DELETE_SKILL_ITEM, options);
};

export const GET_SEARCH_SKILLS = gql`
  query GetSearchSkills($input: ClassificationSearchInput) {
    getSearchSkills(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const useGetSearchSkills = (options?: QueryHookOptions<any, any>) => {
  return useLazyQuery<any, any>(GET_SEARCH_SKILLS, options);
};

export const GET_SEARCH_INTERESTS = gql`
  query GetSearchInterests($input: ClassificationSearchInput) {
    getSearchInterests(input: $input) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_USER_INTERESTS = gql`
  query GetUserInterests {
    getUserInterests {
      id
      title
    }
  }
`;

export const UPDATE_USER_INTERESTS = gql`
  mutation UpdateUserInterests($input: [ID!]!) {
    updateUserInterests(input: $input) {
      id
      title
    }
  }
`;

export const ADD_INTEREST_ITEM = gql`
  mutation AddInterestItem($title: String!) {
    addInterestItem(title: $title) {
      id
      title
    }
  }
`;

export const useGetSearchInterests = (options?: QueryHookOptions<any, any>) => {
  return useLazyQuery<any, any>(GET_SEARCH_INTERESTS, options);
};

export const useGetUserInterests = (options?: QueryHookOptions<any, any>) => {
  return useQuery<any, any>(GET_USER_INTERESTS, options);
};

export const useUpdateUserInterests = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(UPDATE_USER_INTERESTS, options);
};

export const useAddInterestItem = (options?: MutationHookOptions<any, any>) => {
  return useMutation<any, any>(ADD_INTEREST_ITEM, options);
};

export const GET_SEARCH_FUNCTIONS = gql`
  query GetSearchFunctions($input: ClassificationSearchInput) {
    getSearchFunctions(input: $input) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_USER_JOB_FUNCTIONS = gql`
  query GetUserJobFunctions {
    getUserJobFunctions {
      id
      title
    }
  }
`;

export const UPDATE_USER_JOB_FUNCTIONS = gql`
  mutation UpdateUserJobFunctions($input: [ID!]!) {
    updateUserJobFunctions(input: $input) {
      id
      title
    }
  }
`;

export const ADD_JOB_FUNCTION_ITEM = gql`
  mutation AddJobFunctionItem($title: String!) {
    addJobFunctionItem(title: $title) {
      id
      title
    }
  }
`;

export const useGetSearchFunctions = (options?: QueryHookOptions<any, any>) => {
  return useLazyQuery<any, any>(GET_SEARCH_FUNCTIONS, options);
};

export const useGetUserJobFunctions = (
  options?: QueryHookOptions<any, any>,
) => {
  return useQuery<any, any>(GET_USER_JOB_FUNCTIONS, options);
};

export const useUpdateUserJobFunctions = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(UPDATE_USER_JOB_FUNCTIONS, options);
};

export const useAddJobFunctionItem = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(ADD_JOB_FUNCTION_ITEM, options);
};

export const GET_SEARCH_INDUSTRIES = gql`
  query GetSearchIndustries($input: ClassificationSearchInput) {
    getSearchIndustries(input: $input) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_USER_INDUSTRIES = gql`
  query GetUserIndustries {
    getUserIndustries {
      id
      title
    }
  }
`;

export const UPDATE_USER_INDUSTRIES = gql`
  mutation UpdateUserIndustries($input: [ID!]!) {
    updateUserIndustries(input: $input) {
      id
      title
    }
  }
`;

export const ADD_INDUSTRY_ITEM = gql`
  mutation AddIndustryItem($title: String!) {
    addIndustryItem(title: $title) {
      id
      title
    }
  }
`;

export const useGetSearchIndustries = (
  options?: QueryHookOptions<any, any>,
) => {
  return useLazyQuery<any, any>(GET_SEARCH_INDUSTRIES, options);
};

export const useGetUserIndustries = (options?: QueryHookOptions<any, any>) => {
  return useQuery<any, any>(GET_USER_INDUSTRIES, options);
};

export const useUpdateUserIndustries = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(UPDATE_USER_INDUSTRIES, options);
};

export const useAddIndustryItem = (options?: MutationHookOptions<any, any>) => {
  return useMutation<any, any>(ADD_INDUSTRY_ITEM, options);
};

export const GET_SOCIAL_LINKS = gql`
  query GetSocialLinks {
    getSocialLinks {
      id
      platform
      url
    }
  }
`;

export const ADD_SOCIAL_LINK = gql`
  mutation AddSocialLink($input: inputSocial!) {
    addSocialLink(input: $input) {
      id
      url
      platform
    }
  }
`;

export const EDIT_SOCIAL_LINK = gql`
  mutation EditSocialLink($editSocialLinkId: String!, $input: inputSocial!) {
    editSocialLink(id: $editSocialLinkId, input: $input) {
      id
      url
      platform
    }
  }
`;

export const DELETE_SOCIAL_LINK = gql`
  mutation DeleteSocialLink($deleteSocialLinkId: String!) {
    deleteSocialLink(id: $deleteSocialLinkId) {
      id
      url
      platform
    }
  }
`;

export const useGetSocialLinks = (options?: QueryHookOptions<any, any>) => {
  return useQuery<any, any>(GET_SOCIAL_LINKS, options);
};

export const useAddSocialLink = (options?: MutationHookOptions<any, any>) => {
  return useMutation<any, any>(ADD_SOCIAL_LINK, options);
};

export const useEditSocialLink = (options?: MutationHookOptions<any, any>) => {
  return useMutation<any, any>(EDIT_SOCIAL_LINK, options);
};

export const useDeleteSocialLink = (
  options?: MutationHookOptions<any, any>,
) => {
  return useMutation<any, any>(DELETE_SOCIAL_LINK, options);
};

export const GET_PROFILE_VIEWERS = gql`
  query GetProfileViewers($input: GetProfileViewersInput) {
    getProfileViewers(input: $input) {
      edges {
        cursor
        node {
          id
          firstName
          lastName
          avatar
          designation
          viewedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
      lastWeekViews
      lastMonthViews
    }
  }
`;

export const useGetProfileViewers = (options?: QueryHookOptions<any, any>) => {
  return useQuery<any, any>(GET_PROFILE_VIEWERS, options);
};

export const GET_PROFILE_COMPLETION = gql`
  query GetProfileCompletion {
    getProfileCompletion {
      percentage
      pendingFields
    }
  }
`;

export const useGetProfileCompletion = (
  options?: QueryHookOptions<any, any>,
) => {
  return useQuery<any, any>(GET_PROFILE_COMPLETION, options);
};
