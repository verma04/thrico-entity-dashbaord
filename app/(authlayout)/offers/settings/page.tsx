"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const OffersSettings = () => {
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
      key: "allowOffers",
      label: "Allow Offers",
      description: "Enable or disable the ability to create new offers",
    },
    {
      key: "autoApproveOffers",
      label: "Auto Approve Offers",
      description: "Automatically approve new offers",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Offers Settings"
      description="Configure offers module settings"
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
        allowOffers: data?.getEntitySettings?.allowOffers ?? true,
        autoApproveOffers: data?.getEntitySettings?.autoApproveOffers ?? false,
      }}
    />
  );
};

export default OffersSettings;
