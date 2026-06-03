"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { WallOfFameManager } from "@/components/wall-of-fame/wall-of-fame-manager";

function AllEntriesPage() {
  return <WallOfFameManager />;
}

export default withSubscriptionCheck(
  withModulePermission(AllEntriesPage, "WALL_OF_FAME", "canRead"),
  "wall-of-fame"
);
