"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const StoriesSettings = () => {
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
      key: "allowStories",
      label: "Allow Stories",
      description: "Enable or disable the ability to create new stories",
    },
    {
      key: "autoApproveStories",
      label: "Auto Approve Stories",
      description: "Automatically approve new stories",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Stories Settings"
      description="Configure stories module settings"
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
        allowStories: data?.getEntitySettings?.allowStories ?? true,
        autoApproveStories:
          data?.getEntitySettings?.autoApproveStories ?? false,
      }}
    />
  );
};

export default StoriesSettings;
