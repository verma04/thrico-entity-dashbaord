"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const ListingSettings = () => {
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
      key: "allowListing",
      label: "Allow Listings",
      description: "Enable or disable the ability to create new listings",
    },
    {
      key: "autoApproveListing",
      label: "Auto Approve Listings",
      description: "Automatically approve new listings",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Listing Settings"
      description="Configure listing module settings"
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
        allowListing: data?.getEntitySettings?.allowListing ?? true,
        autoApproveListing:
          data?.getEntitySettings?.autoApproveListing ?? false,
      }}
    />
  );
};

export default ListingSettings;
