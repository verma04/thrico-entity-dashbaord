import {
  gql,
  useQuery,
  useMutation,
  type QueryHookOptions,
  type MutationHookOptions,
} from "@apollo/client";

export const GET_CLASSIFICATION_TAB_ORDER = gql`
  query GetClassificationTabOrder {
    getClassificationTabOrder {
      tabs
    }
  }
`;

export const UPDATE_CLASSIFICATION_TAB_ORDER = gql`
  mutation UpdateClassificationTabOrder($input: UpdateClassificationTabOrderInput!) {
    updateClassificationTabOrder(input: $input) {
      tabs
    }
  }
`;

export const useGetClassificationTabOrder = () => {
  return useQuery(GET_CLASSIFICATION_TAB_ORDER, {
    fetchPolicy: "network-only",
  });
};

export const useUpdateClassificationTabOrder = () => {
  return useMutation(UPDATE_CLASSIFICATION_TAB_ORDER);
};

// ── Dedicated Classification & Profile Section Visibility Settings ──

export const GET_CLASSIFICATION_SETTING = gql`
  query GetClassificationSetting {
    getClassificationSetting {
      id
      entity
      allowProfileExperience
      allowProfileEducation
      allowProfileSkills
      allowProfileSocialConnect
      allowProfileSocialLinks
      allowProfileFunctions
      allowProfileIndustries
      allowProfileInterests
    }
  }
`;

export const UPDATE_CLASSIFICATION_SETTING = gql`
  mutation UpdateClassificationSetting($input: ClassificationSettingInput!) {
    updateClassificationSetting(input: $input) {
      id
      entity
      allowProfileExperience
      allowProfileEducation
      allowProfileSkills
      allowProfileSocialConnect
      allowProfileSocialLinks
      allowProfileFunctions
      allowProfileIndustries
      allowProfileInterests
    }
  }
`;

export interface ClassificationSettingData {
  id?: string;
  entity?: string;
  allowProfileExperience?: boolean;
  allowProfileEducation?: boolean;
  allowProfileSkills?: boolean;
  allowProfileSocialConnect?: boolean;
  allowProfileSocialLinks?: boolean;
  allowProfileFunctions?: boolean;
  allowProfileIndustries?: boolean;
  allowProfileInterests?: boolean;
}

export interface GetClassificationSettingResponse {
  getClassificationSetting: ClassificationSettingData;
}

export interface UpdateClassificationSettingInput {
  allowProfileExperience?: boolean;
  allowProfileEducation?: boolean;
  allowProfileSkills?: boolean;
  allowProfileSocialConnect?: boolean;
  allowProfileSocialLinks?: boolean;
  allowProfileFunctions?: boolean;
  allowProfileIndustries?: boolean;
  allowProfileInterests?: boolean;
}

export interface UpdateClassificationSettingResponse {
  updateClassificationSetting: ClassificationSettingData;
}

export const useGetClassificationSetting = (
  options?: QueryHookOptions<GetClassificationSettingResponse>
) => {
  return useQuery<GetClassificationSettingResponse>(
    GET_CLASSIFICATION_SETTING,
    options
  );
};

export const useUpdateClassificationSetting = (
  options?: MutationHookOptions<
    UpdateClassificationSettingResponse,
    { input: UpdateClassificationSettingInput }
  >
) => {
  return useMutation<
    UpdateClassificationSettingResponse,
    { input: UpdateClassificationSettingInput }
  >(UPDATE_CLASSIFICATION_SETTING, options);
};


