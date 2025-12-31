"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const ShopSettings = () => {
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
      key: "allowShop",
      label: "Allow Shop",
      description: "Enable or disable the shop module",
    },
    {
      key: "autoApproveShop",
      label: "Auto Approve Products",
      description: "Automatically approve new product listings",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Shop Settings"
      description="Configure shop module settings"
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
        allowShop: data?.getEntitySettings?.allowShop ?? true,
        autoApproveShop: data?.getEntitySettings?.autoApproveShop ?? false,
      }}
    />
  );
};

export default ShopSettings;
