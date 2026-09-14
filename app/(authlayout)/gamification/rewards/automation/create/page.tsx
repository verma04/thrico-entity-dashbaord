"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  CREATE_REWARDS_AUTOMATION_RULE,
  GET_REWARDS_AUTOMATION_RULES,
  CreateRewardsAutomationRuleInput,
  UpdateRewardsAutomationRuleInput,
} from "@/graphql/rewards-automation";
import { RewardsAutomationForm } from "@/components/rewards/automation/rewards-automation-form";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { toast } from "sonner";

const CreateRewardsAutomationRulePage = () => {
  const router = useRouter();

  const [createRule, { loading }] = useMutation(
    CREATE_REWARDS_AUTOMATION_RULE,
    {
      refetchQueries: ["GetRewardsAutomationRules"],
      onCompleted: () => {
        toast.success("Rewards automation rule created successfully!");
        router.push("/gamification/rewards/automation");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to create rewards automation rule");
      },
    }
  );

  const handleSave = async (
    input:
      | CreateRewardsAutomationRuleInput
      | UpdateRewardsAutomationRuleInput
  ) => {
    await createRule({
      variables: { input: input as CreateRewardsAutomationRuleInput },
    });
  };

  const handleCancel = () => {
    router.push("/gamification/rewards/automation");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background w-screen h-screen p-0 m-0 flex flex-col overflow-hidden animate-in fade-in duration-200">
      <RewardsAutomationForm
        loading={loading}
        onSave={handleSave}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
};

export default withModulePermission(
  CreateRewardsAutomationRulePage,
  "REWARDS",
  "canCreate"
);
