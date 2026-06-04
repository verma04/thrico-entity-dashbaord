"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import Forum from "@/components/forums/forum/Forum";
import React from "react";

const ForumsAllPage = () => {
  return <Forum status={"ALL"} />;
};

export default withSubscriptionCheck(
  withModulePermission(ForumsAllPage, "FORUMS", "canRead"),
  "forums",
);
