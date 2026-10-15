"use client";

import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ModulesProvider } from "@/components/settings/modules/modules-context";
import { ModulesLayoutShell } from "@/components/settings/modules/modules-layout-shell";

function ModulesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModulesProvider>
      <ModulesLayoutShell>{children}</ModulesLayoutShell>
    </ModulesProvider>
  );
}

export default withModulePermission(ModulesLayout, "PLATFORM_FEATURES");
