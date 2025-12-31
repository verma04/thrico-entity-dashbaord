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
      key: "allowCommunity",
      label: "Allow Community Creation",
      description: "Enable or disable the ability to create new communities",
    },
    {
      key: "autoApproveCommunity",
      label: "Auto Approve Communities",
      description: "Automatically approve new community creation requests",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Community Settings"
      description="Configure community and group management settings"
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
        allowCommunity: data?.getEntitySettings?.allowCommunity ?? true,
        autoApproveCommunity:
          data?.getEntitySettings?.autoApproveCommunity ?? false,
        autoApproveGroup: data?.getEntitySettings?.autoApproveGroup ?? false,
      }}
    />
  );
};

export default Settings;
