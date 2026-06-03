"use client";

import React from "react";

import Communities from "../../../../components/communities/Communities";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const CommunitiesAllPage = () => {
  return <Communities status={"ALL"} />;
};

export default withModulePermission(
  CommunitiesAllPage,
  "COMMUNITIES",
  "canRead",
);
