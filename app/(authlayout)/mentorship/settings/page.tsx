"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const MentorshipSettings = () => {
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
      key: "allowMentorship",
      label: "Allow Mentorship",
      description: "Enable or disable the mentorship module",
    },
    {
      key: "autoApproveMentorship",
      label: "Auto Approve Mentors",
      description: "Automatically approve new mentor applications",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Mentorship Settings"
      description="Configure mentorship module settings"
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
        allowMentorship: data?.getEntitySettings?.allowMentorship ?? true,
        autoApproveMentorship:
          data?.getEntitySettings?.autoApproveMentorship ?? false,
      }}
    />
  );
};

export default MentorshipSettings;
