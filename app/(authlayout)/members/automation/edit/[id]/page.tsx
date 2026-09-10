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
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { Zap } from "lucide-react";
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
      <div className="fixed inset-0 z-50 bg-background w-screen h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center animate-pulse shadow-sm">
          <Zap className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-foreground">Loading Workflow Studio</h3>
          <p className="text-xs text-muted-foreground">Fetching automation rule details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen p-0 m-0 flex flex-col overflow-hidden animate-in fade-in duration-200">
      <AutomationForm
        initialValues={rule}
        loading={updating}
        onSave={handleSave}
        onCancel={handleCancel}
        isEdit={true}
      />
    </div>
  );
};

export default withModulePermission(
  EditAutomationRulePage,
  "AUTOMATION",
  "canEdit"
);
