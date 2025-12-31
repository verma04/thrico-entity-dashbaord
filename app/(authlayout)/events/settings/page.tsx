"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const EventsSettings = () => {
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
      key: "allowEvents",
      label: "Allow Event Creation",
      description: "Enable or disable the ability to create new events",
    },
    {
      key: "autoApproveEvents",
      label: "Auto Approve Events",
      description: "Automatically approve new event creation requests",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Events Settings"
      description="Configure events module settings"
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
        allowEvents: data?.getEntitySettings?.allowEvents ?? true,
        autoApproveEvents: data?.getEntitySettings?.autoApproveEvents ?? false,
      }}
    />
  );
};

export default EventsSettings;
