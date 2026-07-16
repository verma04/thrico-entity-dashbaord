"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Calendar, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

const getFields = (singularName: string, moduleName: string): SettingsField[] => [
  {
    key: "allowEvents",
    label: `Allow ${singularName} Creation`,
    description: `Enable or disable the ability to instantiate new ${singularName.toLowerCase()} nodes across the ecosystem.`,
    icon: ShieldCheck,
    section: "Activation Protocol",
  },
  {
    key: "autoApproveEvents",
    label: `Auto Approve ${moduleName}`,
    description: `Automatically authorize new ${singularName.toLowerCase()} creation requests in the registry without manual validation.`,
    icon: Zap,
    section: "Activation Protocol",
  },
];

const EventsSettings = () => {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);
  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success(`${singularName} protocols synchronized successfully.`);
      refetch();
    } catch (error) {
      toast.error("Failed to update registry parameters.");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title={`${singularName} Protocols`}
      description={`Configure institutional ${singularName.toLowerCase()} instantiation rules, approval protocols, and foundational module parameters.`}
      headerIcon={Calendar}
      badge="Registry"
      fields={getFields(singularName, moduleName)}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};




export default withSubscriptionCheck(
  withModulePermission(EventsSettings, "EVENTS", "canEdit"),
  "events"
);
