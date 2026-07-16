"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import NewPoll from "@/components/polls/new-poll";
import { useRouter } from "next/navigation";

function CreatePollPage() {
  const router = useRouter();

  const handleCompleted = (id: string | number) => {
    router.push("/polls");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <NewPoll
      standalone={false}
      fullPage={true}
      onCompletedAction={handleCompleted}
      onCancel={handleCancel}
    />
  );
}

export default withSubscriptionCheck(
  withModulePermission(CreatePollPage, "POLLS", "canCreate"),
  "polls"
);
