"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const PollsSettings = () => {
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
      key: "allowPolls",
      label: "Allow Poll Creation",
      description: "Enable or disable the ability to create new polls",
    },
    {
      key: "autoApprovePolls",
      label: "Auto Approve Polls",
      description: "Automatically approve new poll creation requests",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Polls Settings"
      description="Configure polls module settings"
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
        allowPolls: data?.getEntitySettings?.allowPolls ?? true,
        autoApprovePolls: data?.getEntitySettings?.autoApprovePolls ?? false,
      }}
    />
  );
};

export default PollsSettings;
