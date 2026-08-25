"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MEMBER_AUTOMATION_RULE,
  GET_MEMBER_AUTOMATION_RULES,
  UPDATE_MEMBER_AUTOMATION_RULE,
  UpdateMemberAutomationRuleInput,
} from "@/graphql/member-automation";
import { AutomationForm } from "@/components/members/automation/automation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { Zap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EditAutomationRulePage = () => {
  const router = useRouter();
  const params = useParams();
  const ruleId = params.id as string;

  const { data, loading: fetchingRule } = useQuery(GET_MEMBER_AUTOMATION_RULE, {
    variables: { id: ruleId },
    skip: !ruleId,
    fetchPolicy: "network-only",
  });

  const [updateRule, { loading: updating }] = useMutation(
    UPDATE_MEMBER_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_MEMBER_AUTOMATION_RULES }],
      onCompleted: () => {
        toast.success("Automation rule updated successfully!");
        router.push("/members/automation");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update automation rule");
      },
    }
  );

  const handleSave = async (input: UpdateMemberAutomationRuleInput) => {
    await updateRule({
      variables: {
        id: ruleId,
        input,
      },
    });
  };

  const handleCancel = () => {
    router.push("/members/automation");
  };

  const rule = data?.getMemberAutomationRule;

  if (fetchingRule) {
    return (
      <EcosystemWrapper className="gap-6">
        <EcosystemHeader
          title="Edit Automation Rule"
          badgeText="Workflow Engine"
          description="Loading rule details…"
          icon={Zap}
          breadcrumbs={[
            { label: "Members", href: "/members/all" },
            { label: "Automation", href: "/members/automation" },
            { label: "Edit Rule" },
          ]}
        />
        <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
          <div className="max-w-[1040px] mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper className="gap-6">
      <EcosystemHeader
        title={`Edit Rule: ${rule?.name || "Automation Rule"}`}
        badgeText="Rule Configuration"
        description="Modify targeting conditions, event triggers, and automated actions pipeline."
        icon={Zap}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Automation", href: "/members/automation" },
          { label: rule?.name || "Edit Rule" },
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
          initialValues={rule}
          loading={updating}
          onSave={handleSave}
          onCancel={handleCancel}
          isEdit={true}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(
  EditAutomationRulePage,
  "NETWORK",
  "canUpdate"
);
