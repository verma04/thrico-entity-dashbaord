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
import { withModulePermission } from "@/components/hoc/with-module-permission";
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
    input: CreateMemberAutomationRuleInput | UpdateMemberAutomationRuleInput,
  ) => {
    await createRule({
      variables: { input: input as CreateMemberAutomationRuleInput },
    });
  };

  const handleCancel = () => {
    router.push("/members/automation");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen p-0 m-0 flex flex-col overflow-hidden animate-in fade-in duration-200">
      <AutomationForm
        loading={loading}
        onSave={handleSave}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
};

export default withModulePermission(
  CreateAutomationRulePage,
  "AUTOMATION",
  "canCreate",
);
