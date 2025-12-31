"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const SurveysSettings = () => {
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
      key: "allowSurveys",
      label: "Allow Surveys",
      description: "Enable or disable the surveys module",
    },
    {
      key: "autoApproveSurveys",
      label: "Auto Approve Surveys",
      description: "Automatically approve new surveys",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Surveys Settings"
      description="Configure surveys module settings"
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
        allowSurveys: data?.getEntitySettings?.allowSurveys ?? true,
        autoApproveSurveys:
          data?.getEntitySettings?.autoApproveSurveys ?? false,
      }}
    />
  );
};

export default SurveysSettings;
