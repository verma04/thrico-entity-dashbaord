"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const Page = () => {
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
      key: "allowDiscussionForum",
      label: "Allow Forum Posts",
      description: "Enable or disable the ability to create forum posts",
    },
    {
      key: "autoApproveDiscussionForum",
      label: "Auto Approve Forum Posts",
      description: "Automatically approve new forum posts",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Discussion Forum Settings"
      description="Configure discussion forum settings"
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
        allowDiscussionForum:
          data?.getEntitySettings?.allowDiscussionForum ?? true,
        autoApproveDiscussionForum:
          data?.getEntitySettings?.autoApproveDiscussionForum ?? false,
      }}
    />
  );
};

export default Page;
