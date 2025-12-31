"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const JobsSettings = () => {
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
      key: "allowJobs",
      label: "Allow Job Posting",
      description: "Enable or disable the ability to post new jobs",
    },
    {
      key: "autoApproveJobs",
      label: "Auto Approve Jobs",
      description: "Automatically approve new job posts",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Jobs Settings"
      description="Configure jobs module settings"
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
        allowJobs: data?.getEntitySettings?.allowJobs ?? true,
        autoApproveJobs: data?.getEntitySettings?.autoApproveJobs ?? false,
      }}
    />
  );
};

export default JobsSettings;
