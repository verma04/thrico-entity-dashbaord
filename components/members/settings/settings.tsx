"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const fields = [
    {
      key: "autoApproveUser",
      label: "Auto Approve New Users",
      description: "Automatically approve new user registrations",
    },
    {
      key: "allowNewUser",
      label: "Allow New User Registration",
      description:
        "Turn off temporarily if you need to pause new user registrations",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Member Settings"
      description="Configure system-wide settings for user management"
      fields={fields}
      onSave={(settings) => {
        update({
          variables: {
            input: settings,
          },
        });
      }}
      isLoading={loadingBtn}
      data={{
        allowNewUser: data?.getEntitySettings?.allowNewUser ?? true,
        autoApproveUser: data?.getEntitySettings?.autoApproveUser ?? false,
      }}
    />
  );
};

export default Settings;
