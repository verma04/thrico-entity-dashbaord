"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  CREATE_MEMBER_AUTOMATION_RULE,
  GET_MEMBER_AUTOMATION_RULES,
  CreateMemberAutomationRuleInput,
  UpdateMemberAutomationRuleInput,
} from "@/graphql/member-automation";
import { AutomationForm } from "@/components/members/automation/automation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { Zap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CreateAutomationRulePage = () => {
  const router = useRouter();

  const [createRule, { loading }] = useMutation(CREATE_MEMBER_AUTOMATION_RULE, {
    refetchQueries: [{ query: GET_MEMBER_AUTOMATION_RULES }],
    onCompleted: () => {
      toast.success("Automation rule created successfully!");
      router.push("/members/automation");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create automation rule");
    },
  });

  const handleSave = async (
    input: CreateMemberAutomationRuleInput | UpdateMemberAutomationRuleInput
  ) => {
    await createRule({
      variables: { input: input as CreateMemberAutomationRuleInput },
    });
  };

  const handleCancel = () => {
    router.push("/members/automation");
  };

  return (
    <EcosystemWrapper className="gap-6">
      <EcosystemHeader
        title="Create Automation Rule"
        badgeText="New Workflow"
        description="Configure automated tier assignment, email triggers, circle memberships, and tagging workflows."
        icon={Zap}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Automation", href: "/members/automation" },
          { label: "Create Rule" },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="h-8 gap-1.5 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Rules
          </Button>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <AutomationForm
          loading={loading}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={false}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(
  CreateAutomationRulePage,
  "AUTOMATION",
  "canCreate"
);
