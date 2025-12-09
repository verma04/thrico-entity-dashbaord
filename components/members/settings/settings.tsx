"use client";

import { SettingsForm } from "./settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  console.log(
    "Settings data:",
    data?.getEntitySettings?.allowNewUser,
    data?.getEntitySettings?.autoApproveUser
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SettingsForm
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
