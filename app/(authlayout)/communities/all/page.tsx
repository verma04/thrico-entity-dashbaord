"use client";

import React from "react";
import CommunitiesManage from "@/components/communities/manage/communities-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function CommunitiesAllPage() {
  return <CommunitiesManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(CommunitiesAllPage, "COMMUNITIES", "canRead"),
  "communities",
);
