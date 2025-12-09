import { useMutation, useQuery } from "@apollo/client";
import {
  COMMUNITY_GUIDELINE,
  COMMUNITY_TERMS_AND_CONDITIONS,
  GROUP_SETTINGS,
  UPDATE_COMMUNITY_GUIDELINE,
  UPDATE_COMMUNITY_TERMS_AND_CONDITIONS,
  UPDATE_SETTINGS,
} from "../../../quries/group/settings";

export const getGroupSettings = (options: any) =>
  useQuery(GROUP_SETTINGS, options);

export const updateGroupSettings = (options: any) =>
  useMutation(UPDATE_SETTINGS, {
    onCompleted: options.onCompleted,
    update(cache, { data: { updateGroupSettings } }) {
      try {
        cache.writeQuery({
          query: GROUP_SETTINGS,

          data: {
            getGroupSettings: updateGroupSettings,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const getCommunityTermAndConditions = () =>
  useQuery(COMMUNITY_TERMS_AND_CONDITIONS);

export const updateCommunityTermAndConditions = () =>
  useMutation(UPDATE_COMMUNITY_TERMS_AND_CONDITIONS);

export const getCommunityGuidelines = () => useQuery(COMMUNITY_GUIDELINE);

export const updateCommunityGuidelines = () =>
  useMutation(UPDATE_COMMUNITY_GUIDELINE);
