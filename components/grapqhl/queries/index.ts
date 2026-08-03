"use client";
import { gql } from "@apollo/client";
import {
  MutationHookOptions,
  MutationResult,
  useMutation,
  useQuery,
} from "@apollo/client/react";

const profile = `
  id
  email
  firstName
  isApproved
  lastName
  isRequested
  avatar
  cover
  status
  about{
    headline
  }
  location
`;

export const GET_YEAR = gql`
  query Books {
    books {
      author
      title
    }
  }
`;
export const GET_USER = gql`
  query GetUser {
    getUser {
      ${profile}
    }
  }
`;

export const CHECK_USER_ONLINE = gql`
  query CheckUserOnline {
    checkUserOnline {
      status
      message
    }
  }
`;

export const COMPLETE_KYC = gql`
  mutation CompleteKyc($input: kyc) {
    completeKyc(input: $input) {
      success
    }
  }
`;

export const ACCEPT_REQUEST = gql`
  mutation AcceptRequestGroup($input: request) {
    acceptRequestGroup(input: $input) {
      id
    }
  }
`;
export const GET_ORG_DETAILS = gql`
  query GetOrgDetails {
    getOrgDetails: entityDetails {
      id
      name
      logo
      favicon
    }
  }
`;

export const UPDATE_PROFILE_AVATAR = gql`
  mutation UpdateProfileAvatar($input: inputUpdateProfileAvatar!) {
    updateProfileAvatar(input: $input) {
      cover
      avatar
    }
  }
`;

export const UPDATE_PROFILE_COVER = gql`
  mutation UpdateProfileCover($input: inputUpdateProfileCover!) {
    updateProfileCover(input: $input) {
      cover
      avatar
    }
  }
`;

export const UPDATE_PROFILE_DETAILS = gql`
  mutation UpdateProfileDetails($input: inputProfileDetails) {
    updateProfileDetails(input: $input) {
      id
      firstName
      avatar
      lastName
      about {
        headline
      }

      cover
    }
  }
`;

// Define the input type for updating profile cover
export type coverInput = {
  cover: string | null;
  // add other fields as needed
};

// Define the mutation result type for updateProfileCover
export type UpdateProfileCoverData = {
  updateProfileCover: {
    id: string;
    email: string;
    firstName: string;
    isApproved: boolean;
    lastName: string;
    isRequested: boolean;
    avatar: string;
    cover: string;
    about: {
      headline: string;
    };
    location: string;
  };
};

export type UpdateProfileCoverInput = {
  input: coverInput;
};

export const useUpdateProfileCover = (
  options?: useMutation.Options<
    UpdateProfileCoverData,
    UpdateProfileCoverInput
  >,
): [
  (input: coverInput) => Promise<any>,
  useMutation.Result<UpdateProfileCoverData>,
] => {
  const [mutate, result] = useMutation<
    UpdateProfileCoverData,
    UpdateProfileCoverInput
  >(UPDATE_PROFILE_COVER, {
    ...options,
    update: (cache, { data }) => {
      if (data?.updateProfileCover) {
        // Read the existing user from the cache
        const existingUser: any = cache.readQuery({ query: GET_USER });
        if (existingUser?.getUser) {
          // Merge only the cover and avatar fields
          cache.writeQuery({
            query: GET_USER,
            data: {
              getUser: {
                ...existingUser.getUser,
                cover: data.updateProfileCover.cover,
              },
            },
          });
        }
      }
      // If you want to call a custom update from options, call it here
      if (options && options.update) {
        options.update(cache, { data } as any, {
          variables: options.variables as any,
        });
      }
    },
  });

  const updateProfileCover = (input: coverInput) => {
    return mutate({ variables: { input } });
  };

  return [updateProfileCover, result];
};

// Define the input type for updating profile avatar
export type avatarInput = {
  avatar: string | null;
  // add other fields as needed
};

// Define the mutation result type for updateProfileAvatar
export type UpdateProfileAvatarData = {
  updateProfileAvatar: {
    id: string;
    email: string;
    firstName: string;
    isApproved: boolean;
    lastName: string;
    isRequested: boolean;
    avatar: string;
    cover: string;
    about: {
      headline: string;
    };
    location: string;
  };
};

export type UpdateProfileAvatarInput = {
  input: avatarInput;
};

export const useUpdateProfileAvatar = (
  options?: useMutation.Options<
    UpdateProfileAvatarData,
    UpdateProfileAvatarInput
  >,
): [
  (input: avatarInput) => Promise<any>,
  useMutation.Result<UpdateProfileAvatarData>,
] => {
  const [mutate, result] = useMutation<
    UpdateProfileAvatarData,
    UpdateProfileAvatarInput
  >(UPDATE_PROFILE_AVATAR, {
    ...options,
    update: (cache, { data }) => {
      if (data?.updateProfileAvatar) {
        // Read the existing user from the cache
        const existingUser: any = cache.readQuery({ query: GET_USER });
        if (existingUser?.getUser) {
          // Merge only the avatar and cover fields
          cache.writeQuery({
            query: GET_USER,
            data: {
              getUser: {
                ...existingUser.getUser,
                avatar: data.updateProfileAvatar.avatar,
                cover: data.updateProfileAvatar.cover,
              },
            },
          });
        }
      }
      // If you want to call a custom update from options, call it here
      if (options && options.update) {
        options.update(cache, { data } as any, {
          variables: options.variables as any,
        });
      }
    },
  });

  const updateProfileAvatar = (input: avatarInput) => {
    return mutate({ variables: { input } });
  };

  return [updateProfileAvatar, result];
};

// Define the CompleteKycData type for mutation result
export type CompleteKycData = {
  completeKyc: {
    success: boolean;
  };
};

// Define the input type for updating profile details
export type ProfileDetailsInput = {
  firstName?: string | null;
  headline?: string | null;
  lastName?: string | null;
  location?: string | null;
  // add other fields as needed
};

export type UpdateProfileDetailsInput = {
  input: ProfileDetailsInput;
};

// Define the mutation result type for updateProfileDetails
export type UpdateProfileDetailsData = {
  updateProfileDetails: {
    id: string;
    firstName: string;
    avatar: string;
    lastName: string;
    about: {
      headline: string;
    };
    isOnline: boolean;
    cover: string;
  };
};

export const useUpdateProfileDetails = (
  options?: useMutation.Options<
    UpdateProfileDetailsData,
    UpdateProfileDetailsInput
  >,
): [
  (input: ProfileDetailsInput) => Promise<any>,
  useMutation.Result<UpdateProfileDetailsData>,
] => {
  const [mutate, result] = useMutation<
    UpdateProfileDetailsData,
    UpdateProfileDetailsInput
  >(UPDATE_PROFILE_DETAILS, {
    ...options,
    refetchQueries: [{ query: GET_USER }],
  });

  const updateProfileDetails = (input: ProfileDetailsInput) => {
    return mutate({ variables: { input } });
  };

  return [updateProfileDetails, result];
};

export const CHECK_USER_ACCOUNT = gql`
  query checkAllUserAccount {
    checkAllUserAccount {
      id
      name
      logo
      lastActive
    }
  }
`;

// Define the type for the query result
export type CheckUserAccountData = {
  checkAllUserAccount: Array<{
    id: string;
    name: string;
    logo: string;
    lastActive: string;
  }>;
};

// Custom hook for the CHECK_USER_ACCOUNT query
export const useCheckUserAccount = () => {
  return useQuery<CheckUserAccountData>(CHECK_USER_ACCOUNT);
};

export const ENTITY_DETAILS = gql`
  query entityDetails {
    entityDetails {
      id
      name
      logo
      favicon
      subscription {
        status
        modules {
          name
          icon
          isPopular
          showInWebNavigationSortNumber
          customName
        }
      }
      theme {
        primaryColor
        colorPrimary
        borderRadius
        colorBgContainer
      }
    }
  }
`;

export const GET_ENTITY_SETTINGS = gql`
  query GetEntitySettings {
    getEntitySettings {
      allowMediaGalleryComments
    }
  }
`;

