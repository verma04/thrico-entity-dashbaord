"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { Settings2, Briefcase } from "lucide-react";
import { PlatformSettingsPage, SettingsField } from "@/components/ui/platform/settings-page";
import { toast } from "sonner";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

const Page = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});
  const moduleName = "Opportunities";
  const singularName = "Opportunity";

  const FIELDS: SettingsField[] = [
    {
      key: "allowOpportunities",
      label: `Allow ${singularName} Posts`,
      description: `Enable or disable the ability to create ${singularName.toLowerCase()} posts across the module.`,
      icon: Briefcase,
      section: "Engagement Controls",
    },
    {
      key: "autoApproveOpportunities",
      label: `Auto Approve ${singularName} Posts`,
      description: `Automatically validate and publish new ${singularName.toLowerCase()} posts without review.`,
      icon: Settings2,
      section: "Automation Protocols",
    },
  ];

  const handleSave = async (settings: any) => {
    try {
      await update({
        variables: {
          input: settings,
        },
      });
      toast.success(`${singularName} settings updated.`);
    } catch (error) {
      toast.error(`Failed to update ${singularName.toLowerCase()} configuration.`);
      throw error;
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${moduleName} Framework`}
        description={`Moderate interactions and configure the ${singularName.toLowerCase()} engine for your ecosystem.`}
        badgeText="Global Engine"
        icon={Briefcase}
        breadcrumbs={[
          { label: "Opportunities", href: "/opportunities/all" },
          { label: "Settings" }
        ]}
      />
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <PlatformSettingsPage
          title={`${moduleName} Framework`}
          description={`Moderate interactions and configure the ${singularName.toLowerCase()} engine for your ecosystem.`}
          headerIcon={Briefcase}
          fields={FIELDS}
          data={data?.getEntitySettings}
          loading={loading}
          onSave={handleSave}
          isSaving={loadingBtn}
          badge="Global Engine"
          hideHeader={true}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withSubscriptionCheck(
  withModulePermission(Page, "OPPORTUNITIES", "canEdit"),
  "opportunities"
);
