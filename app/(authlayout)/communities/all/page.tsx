"use client";

import React from "react";
import CommunitiesManage from "@/components/communities/manage/communities-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const CommunitiesAllPage = () => {
  return <CommunitiesManage status="ALL" />;
};

export default withModulePermission(
  CommunitiesAllPage,
  "COMMUNITIES",
  "canRead",
);
