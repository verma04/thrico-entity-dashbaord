import { useMutation, useQuery } from "@apollo/client";
import { USER_SETTINGS, UPDATE_SETTINGS } from "../../../quries/user/settings";

export const getUserSettings = (options: any) =>
  useQuery(USER_SETTINGS, options);

export const updateUserSettings = (options: any) =>
  useMutation(UPDATE_SETTINGS, {
    onCompleted: options.onCompleted,
    update(cache, { data: { updateUserSettings } }) {
      try {
        cache.writeQuery({
          query: USER_SETTINGS,

          data: {
            getUserSettings: updateUserSettings,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
