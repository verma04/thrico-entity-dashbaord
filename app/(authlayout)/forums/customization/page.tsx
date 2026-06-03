"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { useMembersTermsAndConditions } from "@/graphql/actions";

// Mock API function - replace with actual API call
const saveTermsAndConditions = async (type: string, content: string) => {
  // Simulate API call
  return { success: true };
};

function TermsPage() {
  <></>;
}

export default withSubscriptionCheck(
  withModulePermission(TermsPage, "FORUMS", "canEdit"),
  "forums"
);
