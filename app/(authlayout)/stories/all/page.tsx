"use client";

import React, { Suspense } from "react";
import { StoriesHub } from "@/components/stories/stories-hub";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function StoriesAllPage() {
  return (
    <Suspense fallback={null}>
      <StoriesHub />
    </Suspense>
  );
}

export default withModulePermission(StoriesAllPage, "STORIES", "canRead");
