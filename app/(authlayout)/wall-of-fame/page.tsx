"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import WallOfFameAnalytics from "@/components/wall-of-fame/wall-of-fame-analytics";

function WallOfFamePage() {
  return <WallOfFameAnalytics />;
}

export default withSubscriptionCheck(
  withModulePermission(WallOfFamePage, "WALL_OF_FAME", "canRead"),
  "wall-of-fame"
);
