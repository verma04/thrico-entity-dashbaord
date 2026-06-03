"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import Poll from "@/components/polls/polls";
import { By } from "@/components/polls/ts-types";

function PollsPage() {
  return <Poll by={By.ENTITY} />;
}

export default withSubscriptionCheck(
  withModulePermission(PollsPage, "POLLS", "canRead"),
  "polls"
);
