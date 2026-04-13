"use client";

import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Calendar, ShieldCheck, Zap } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";

const FIELDS: SettingsField[] = [
  {
    key: "allowEvents",
    label: "Allow Event Creation",
    description: "Enable or disable the ability to instantiate new event nodes across the ecosystem.",
    icon: ShieldCheck,
    section: "Activation Protocol",
  },
  {
    key: "autoApproveEvents",
    label: "Auto Approve Events",
    description: "Automatically authorize new event creation requests in the registry without manual validation.",
    icon: Zap,
    section: "Activation Protocol",
  },
];

const EventsSettings = () => {
  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success("Event protocols synchronized successfully.");
      refetch();
    } catch (error) {
      toast.error("Failed to update registry parameters.");
      throw error;
    }
  };

  return (
    <PlatformSettingsPage
      title="Event Protocols"
      description="Configure institutional event instantiation rules, approval protocols, and foundational module parameters."
      headerIcon={Calendar}
      badge="Registry"
      fields={FIELDS}
      data={data?.getEntitySettings}
      loading={loading}
      onSave={handleSave}
      isSaving={loadingBtn}
    />
  );
};

export default EventsSettings;

