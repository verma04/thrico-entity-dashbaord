"use client";

import React, { Suspense } from "react";
import { StoriesHub } from "@/components/stories/stories-hub";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function StoriesPage() {
  return (
    <Suspense fallback={null}>
      <StoriesHub />
    </Suspense>
  );
}

export default withModulePermission(StoriesPage, "STORIES", "canRead");
