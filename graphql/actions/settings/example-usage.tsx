/**
 * Example usage of Entity Settings hooks
 *
 * This file demonstrates how to use the useGetEntitySettings and useUpdateEntitySettings hooks
 */

import {
  useGetEntitySettings,
  useUpdateEntitySettings,
} from "@/graphql/actions/settings";
import { useState } from "react";

export function EntitySettingsExample() {
  // Fetch entity settings
  const { data, loading, error, refetch } = useGetEntitySettings();

  // Update entity settings mutation
  const [updateSettings, { loading: updating }] = useUpdateEntitySettings({
    onCompleted: (data) => {
      console.log("Settings updated successfully:", data);
      refetch(); // Refetch to get updated data
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
    },
  });

  const handleToggleSetting = async (field: string, currentValue: boolean) => {
    await updateSettings({
      variables: {
        input: {
          [field]: !currentValue,
        },
      },
    });
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error loading settings: {error.message}</div>;
  if (!data?.getEntitySettings) return <div>No settings found</div>;

  const settings = data.getEntitySettings;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Entity Settings</h2>

      {/* Example: Toggle allowNewUser */}
      <div className="flex items-center justify-between">
        <span>Allow New Users</span>
        <button
          onClick={() =>
            handleToggleSetting("allowNewUser", settings.allowNewUser)
          }
          disabled={updating}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {settings.allowNewUser ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Example: Toggle autoApproveUser */}
      <div className="flex items-center justify-between">
        <span>Auto Approve Users</span>
        <button
          onClick={() =>
            handleToggleSetting("autoApproveUser", settings.autoApproveUser)
          }
          disabled={updating}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {settings.autoApproveUser ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Example: Toggle allowCommunity */}
      <div className="flex items-center justify-between">
        <span>Allow Community</span>
        <button
          onClick={() =>
            handleToggleSetting("allowCommunity", settings.allowCommunity)
          }
          disabled={updating}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {settings.allowCommunity ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Add more settings as needed */}
    </div>
  );
}

// Alternative: Direct usage without component
export async function updateEntitySettingsDirectly() {
  const { data } = await useUpdateEntitySettings({
    variables: {
      input: {
        allowNewUser: true,
        autoApproveUser: false,
        allowCommunity: true,
        autoApproveCommunity: false,
        // ... add other fields as needed
      },
    },
  });

  return data;
}
